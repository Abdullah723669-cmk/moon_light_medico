import os
import logging
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
import models
from schemas import ChatRequest
from dotenv import load_dotenv

# Setup logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Load environment variables
load_dotenv(os.path.join(os.path.dirname(os.path.dirname(__file__)), ".env"), override=True)

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

# Use gemini-2.5-flash-lite — lightweight model with available free-tier quota
MODEL_NAME = "gemini-2.5-flash-lite"

SYSTEM_INSTRUCTION = """
You are a smart, polite, and helpful customer service virtual assistant for Moon Light Medico, a reputed online pharmacy in Bangladesh.
Your goal is to answer pharmacy and medicine related queries politely and accurately using our real-time inventory.

Key Information & Policies:
- Genuine medicines, fast delivery, and simple return policy.
- Prescription (Rx) items require a valid prescription upload. OTC medicines can be purchased directly.
- Use the search_medicine tool for checking prices, stock, and availability. 
- ALWAYS use the tool when asked about medicine details. Do not guess.
- If a user asks medical advice, remind them you are an AI and they should consult a doctor.
- If a medicine is not found, suggest that they search for generic names or contact support.

Order Management (Admin):
- Use the lookup_order tool when asked about order status, order details, or customer orders.
- You can look up orders by order number (e.g. ORD-000001), customer name, or phone number.
- Provide order status, items, total cost, and other details when asked.
- If no specific query is given, return a summary of recent orders.
- Use the get_order_stats tool when asked about order counts, totals, summaries, how many orders are completed/pending, total revenue, or any aggregate/statistical question about orders.
- ALWAYS use get_order_stats for questions like "how many orders", "total orders", "completed orders count", etc.
"""

def perform_search(query: str, db: Session) -> str:
    """Core medicine search logic with improved cleaning and flexibility."""
    try:
        # Clean query: Remove common question words and medicine forms/strengths
        clean_query = query.lower()
        # Remove common phrases
        for word in ['what', 'is', 'the', 'price', 'of', 'for', 'about', 'show', 'me', 'tell', 'info', 'check']:
            clean_query = clean_query.replace(f"{word} ", "").strip()
        
        # Remove medicinal forms/strengths that often interfere with simple brand matching
        import re
        # Remove strengths like 20mg, 500 mg, etc.
        clean_query = re.sub(r'\d+\s*(mg|ml|mcg|gm|g|iu)', '', clean_query).strip()
        # Remove forms like tab, tablet, cap, capsule, syrup
        clean_query = re.sub(r'\b(tab|tablet|capsule|caps|cap|syrup|suspension|injection|inj|syp)\b', '', clean_query).strip()
        
        logger.info(f"Searching for: '{clean_query}' (original: '{query}')")
        
        if not clean_query or len(clean_query) < 2:
            return "Please provide a specific medicine name to search for."

        # Try brand name search
        medicines = db.query(models.Medicine).filter(
            models.Medicine.brand_name.ilike(f"%{clean_query}%")
        ).limit(5).all()
        
        # If no results, try generic name search
        if not medicines:
            medicines = db.query(models.Medicine).filter(
                models.Medicine.generic_name.ilike(f"%{clean_query}%")
            ).limit(5).all()
            
        if not medicines:
            return f"I couldn't find any medicine matching '{clean_query}' in our inventory. Please check the spelling or contact our support team."
            
        result = []
        for m in medicines:
            item_type = 'Rx (Prescription Needed)' if m.is_rx else 'OTC'
            status = 'In Stock' if m.stock_quantity > 0 else 'OUT OF STOCK'
            result.append(
                f"- Brand: {m.brand_name} | Strength: {m.strength} | Generic: {m.generic_name}\n"
                f"  Price: {m.price} BDT | Stock: {status} ({m.stock_quantity} available) | Type: {item_type}"
            )
            
        return "\n".join(result)
    except Exception as e:
        logger.error(f"Critical Database Error in perform_search: {str(e)}")
        return f"DATABASE_ERROR: I encountered an issue connecting to our medicine database. Technical details: {str(e)}"

def perform_order_lookup(query: str, db: Session) -> str:
    """Look up orders by order number, customer name, or phone number."""
    try:
        from sqlalchemy import or_
        clean_query = query.strip()
        logger.info(f"Order lookup for: '{clean_query}'")

        if not clean_query or len(clean_query) < 2:
            orders = db.query(models.Order).order_by(models.Order.id.desc()).limit(10).all()
            if not orders:
                return "No orders found in the system."
            result = [f"Recent Orders (last {len(orders)}):"]
            for o in orders:
                item_count = len(o.items) if o.items else 0
                result.append(
                    f"- {o.order_number} | Customer: {o.customer_name} | Phone: {o.phone_number}\n"
                    f"  Status: {o.status} | Items: {item_count} | Total: {o.total_cost} BDT | Date: {o.order_date}"
                )
            return "\n".join(result)

        orders = db.query(models.Order).filter(
            or_(
                models.Order.order_number.ilike(f"%{clean_query}%"),
                models.Order.invoice_number.ilike(f"%{clean_query}%"),
                models.Order.customer_name.ilike(f"%{clean_query}%"),
                models.Order.phone_number.ilike(f"%{clean_query}%")
            )
        ).order_by(models.Order.id.desc()).limit(10).all()

        if not orders:
            return f"No orders found matching '{clean_query}'. Try searching by order number (e.g. ORD-000001), customer name, or phone number."

        result = [f"Found {len(orders)} order(s):"]
        for o in orders:
            items_detail = []
            for item in (o.items or []):
                items_detail.append(f"    - {item.brand_name} x{item.quantity} @ {item.price} BDT")
            items_str = "\n".join(items_detail) if items_detail else "    (no items)"
            discount_info = f" | Discount: {o.discount_amount} BDT" if o.discount_amount else ""
            result.append(
                f"- Order: {o.order_number} | Invoice: {o.invoice_number}\n"
                f"  Customer: {o.customer_name} | Phone: {o.phone_number}\n"
                f"  Address: {o.address}\n"
                f"  Status: {o.status} | Payment: {o.payment_mode}{discount_info}\n"
                f"  Total: {o.total_cost} BDT | Date: {o.order_date}\n"
                f"  Items:\n{items_str}"
            )
        return "\n".join(result)
    except Exception as e:
        logger.error(f"Order lookup error: {str(e)}")
        return f"DATABASE_ERROR: Error looking up orders. Technical details: {str(e)}"

def perform_order_stats(db: Session) -> str:
    """Get aggregate order statistics."""
    try:
        from sqlalchemy import func
        total = db.query(func.count(models.Order.id)).scalar() or 0
        statuses = db.query(
            models.Order.status, func.count(models.Order.id)
        ).group_by(models.Order.status).all()
        total_revenue = db.query(func.sum(models.Order.total_cost)).scalar() or 0
        total_discount = db.query(func.sum(models.Order.discount_amount)).scalar() or 0

        result = [f"Order Statistics:"]
        result.append(f"- Total Orders: {total}")
        for status, count in statuses:
            result.append(f"- {status}: {count}")
        result.append(f"- Total Revenue: {total_revenue:.2f} BDT")
        result.append(f"- Total Discounts Given: {total_discount:.2f} BDT")
        result.append(f"- Net Revenue: {total_revenue - total_discount:.2f} BDT")
        return "\n".join(result)
    except Exception as e:
        logger.error(f"Order stats error: {str(e)}")
        return f"DATABASE_ERROR: Error fetching order stats. Details: {str(e)}"

@router.post("/")
def chat_with_bot(request: ChatRequest, db: Session = Depends(get_db)):
    api_key = os.getenv("GEMINI_API_KEY")
    if not api_key:
        raise HTTPException(status_code=500, detail="Gemini API key not configured in .env")

    import google.generativeai as genai
    import time
    genai.configure(api_key=api_key)
    
    # Define tools inside the route for DB session access
    def search_medicine(query: str) -> str:
        """
        Search for a medicine in the Moon Light Medico inventory.
        Args:
            query: The brand name or generic name of the medicine.
        """
        logger.info(f"AI Tool Call: search_medicine(query='{query}')")
        return perform_search(query, db)

    def lookup_order(query: str) -> str:
        """
        Look up order status and details in the Moon Light Medico system.
        Args:
            query: The order number (e.g. ORD-000001), customer name, or phone number. Use empty string for recent orders.
        """
        logger.info(f"AI Tool Call: lookup_order(query='{query}')")
        return perform_order_lookup(query, db)

    def get_order_stats() -> str:
        """
        Get aggregate order statistics including total orders, count by status (Completed, Pending, etc.), and total revenue.
        Call this when the user asks about order counts, totals, how many orders, revenue, or any summary/statistical question about orders.
        """
        logger.info("AI Tool Call: get_order_stats()")
        return perform_order_stats(db)

    try:
        model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            system_instruction=SYSTEM_INSTRUCTION,
            tools=[search_medicine, lookup_order, get_order_stats]
        )
        
        # Limit history to last 10 messages to reduce token usage and avoid 429 rate limits
        recent_messages = request.messages[-11:]
        history = []
        for msg in recent_messages[:-1]:
            history.append({
                "role": "model" if msg.role == "assistant" else "user",
                "parts": [msg.content]
            })
            
        chat_session = model.start_chat(history=history, enable_automatic_function_calling=True)
        user_message = recent_messages[-1].content
        
        # Implement a basic retry mechanism for 429/Processing Limit errors
        max_retries = 2
        last_exception = None
        
        for attempt in range(max_retries + 1):
            try:
                response = chat_session.send_message(user_message)
                return {"role": "assistant", "content": response.text}
            except Exception as e:
                error_str = str(e).lower()
                last_exception = e
                if ("429" in error_str or "quota" in error_str or "limit" in error_str) and attempt < max_retries:
                    wait_time = (attempt + 1) * 2  # Exponential-ish backoff
                    logger.warning(f"AI Limit reached. Retrying in {wait_time}s... (Attempt {attempt + 1}/{max_retries})")
                    time.sleep(wait_time)
                    continue
                break
        
        # If we reach here, it failed after retries or was a non-retryable error
        if last_exception:
            raise last_exception
            
    except Exception as e:
        error_str = str(e)
        logger.error(f"Chatbot Exception: {error_str}")
        
        if "429" in error_str or "quota" in error_str.lower():
            raise HTTPException(status_code=429, detail="AI processing limit reached. Please wait a moment.")
            
        raise HTTPException(status_code=500, detail=f"Chat error: {error_str}")
