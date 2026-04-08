import os
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import google.generativeai as genai
from database import get_db
import models
from schemas import ChatRequest
from dotenv import load_dotenv

load_dotenv(override=True)

router = APIRouter(
    prefix="/api/chat",
    tags=["chat"],
    responses={404: {"description": "Not found"}},
)

# Configure Gemini API
GENAI_API_KEY = os.getenv("GEMINI_API_KEY")
if GENAI_API_KEY:
    genai.configure(api_key=GENAI_API_KEY)

# Initialize the model with tools
# We use gemini-1.5-flash since it supports tools and is fast
MODEL_NAME = "gemini-2.5-flash" 

SYSTEM_INSTRUCTION = """
You are a smart, polite, and helpful customer service virtual assistant for Moon Light Medico, a reputed online pharmacy mimicking the operations and policies of Lazz Pharma in Bangladesh.
Your goal is to answer queries politely and wisely based on the website's context.

Key Information & Policies:
- We provide genuine medicines, fast delivery, and have a simple return policy.
- Prescription (Rx) items require a valid prescription upload before purchase. Over-the-counter (OTC) medicines can be purchased directly.
- We act as a reliable healthcare partner (just like Lazz Pharma). Everything from regular meds to life-saving drugs.
- You can check the availability of medicines, their stock, and prices using the search_medicine tool.
- If a user asks a medical question, remind them that you are an AI assistant and they should consult a doctor for professional medical advice, but you can certainly help them find generic equivalents or the medicine they need in our store.
"""

def search_medicine(query: str, db: Session) -> str:
    """Search for a medicine in the Moon Light Medico inventory by name to check stock, price, and availability. 
    Use this when a customer asks if we have a particular medicine or what its price is.
    
    Args:
        query: The name of the medicine (brand or generic) to search for.
    """
    medicines = db.query(models.Medicine).filter(models.Medicine.brand_name.ilike(f"%{query}%")).limit(5).all()
    if not medicines:
        # Try generic name too
        medicines = db.query(models.Medicine).filter(models.Medicine.generic_name.ilike(f"%{query}%")).limit(5).all()
        
    if not medicines:
        return f"No medicine found matching '{query}' in the inventory."
        
    result = []
    for m in medicines:
        item_type = 'Rx (Prescription Needed)' if m.is_rx else 'OTC'
        status = 'In Stock' if m.stock_quantity > 0 else 'Out of Stock'
        result.append(f"- {m.brand_name} ({m.strength}) | Generic: {m.generic_name} | Price: {m.price} BDT | Status: {status} ({m.stock_quantity} available) | Type: {item_type}")
        
    return "\n".join(result)

@router.post("/")
def chat_with_bot(request: ChatRequest, db: Session = Depends(get_db)):
    if not GENAI_API_KEY:
        raise HTTPException(status_code=500, detail="Gemini API key is not configured in the backend.")
        
    try:
        # Define a local wrapper so the model doesn't see the 'db' argument
        def search_medicine_tool(query: str) -> str:
            """Search for a medicine in the Moon Light Medico inventory by name to check stock, price, and availability. 
            Use this when a customer asks if we have a particular medicine or what its price is.
            
            Args:
                query: The name of the medicine (brand or generic) to search for.
            """
            return search_medicine(query, db)
            
        # Configure model
        model = genai.GenerativeModel(
            model_name=MODEL_NAME,
            system_instruction=SYSTEM_INSTRUCTION,
            tools=[search_medicine_tool]
        )
        
        # Convert schemas.ChatMessage to Gemini expected format
        chat_history = []
        for msg in request.messages[:-1]:
            # Gemini roles are 'user' and 'model'
            role = 'model' if msg.role == 'assistant' else 'user'
            chat_history.append({'role': role, 'parts': [msg.content]})
            
        # Initialize chat session with automatic tool calling enabled
        chat = model.start_chat(history=chat_history, enable_automatic_function_calling=True)
        
        # Send the latest message
        latest_message = request.messages[-1].content
        response = chat.send_message(latest_message)
        
        return {"role": "assistant", "content": response.text}
        
    except Exception as e:
        error_msg = str(e)
        if "429" in error_msg or "quota" in error_msg.lower():
            print("Chatbot Rate Limit Error:", error_msg)
            raise HTTPException(
                status_code=429, 
                detail="The AI is currently at its processing limit for the free tier. Please wait about 30 seconds before asking another question."
            )
            
        print("Error in chat:", e)
        raise HTTPException(status_code=500, detail=error_msg)
