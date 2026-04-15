from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import models, schemas
from database import get_db
import inventory_utils

router = APIRouter(prefix="/api/orders", tags=["orders"])

@router.post("/", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Calculate next order ID
    last_order = db.query(models.Order).order_by(models.Order.id.desc()).first()
    next_id = 1 if not last_order else last_order.id + 1
    
    # Format order_number like ORD-000001
    order_number = f"ORD-{next_id:06d}"
    invoice_number = f"INV-{next_id:06d}"
    
    db_order = models.Order(
        order_number=order_number,
        invoice_number=invoice_number,
        customer_name=order.customer_name,
        phone_number=order.phone_number,
        address=order.address,
        total_cost=order.total_cost,
        discount_amount=order.discount_amount,
        delivery_charge=order.delivery_charge,
        payment_mode=order.payment_mode,
        status="Pending"
    )
    
    db.add(db_order)

    # Process inventory updates based on cart items
    for item in order.items:
        medicine = db.query(models.Medicine).filter(models.Medicine.id == item.medicine_id).first()
        if medicine:
            # Update Daily Stock table
            inventory_utils.update_daily_stock(db, medicine.id, sales_diff=item.quantity)
            
            # Snap item stats into Order Item table
            order_item = models.OrderItem(
                medicine_id=medicine.id,
                brand_name=medicine.brand_name,
                quantity=item.quantity,
                price=medicine.price
            )
            db_order.items.append(order_item)

    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/invoice/{invoice_number}", response_model=schemas.OrderResponse)
def get_invoice(invoice_number: str, db: Session = Depends(get_db)):
    order = db.query(models.Order).filter(models.Order.invoice_number == invoice_number).first()
    if not order:
        raise HTTPException(status_code=404, detail="Invoice not found")
    return order

@router.get("/", response_model=list[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).order_by(models.Order.id.desc()).all()

@router.put("/{order_id}", response_model=schemas.OrderResponse)
def update_order(order_id: int, order_update: schemas.OrderUpdate, db: Session = Depends(get_db)):
    """Admin endpoint to update an order — edit discount, delivery charge, status, notes, and items (returns)."""
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    # Update basic fields
    update_data = order_update.model_dump(exclude_unset=True, exclude={'items'})
    for key, value in update_data.items():
        setattr(db_order, key, value)

    # Update items if provided (Return Sales logic)
    if order_update.items is not None:
        for new_item in order_update.items:
            # Find existing item in this order
            existing_item = db.query(models.OrderItem).filter(
                models.OrderItem.order_id == order_id,
                models.OrderItem.medicine_id == new_item.medicine_id
            ).first()
            
            if existing_item:
                old_qty = existing_item.quantity
                new_qty = new_item.quantity
                
                if old_qty != new_qty:
                    diff = old_qty - new_qty
                    if diff > 0:
                        # Return sales (qty reduced)
                        inventory_utils.update_daily_stock(db, new_item.medicine_id, returns_diff=diff)
                    else:
                        # Correction/Add more to order (qty increased)
                        inventory_utils.update_daily_stock(db, new_item.medicine_id, sales_diff=abs(diff))
                    
                    # Update order item quantity
                    existing_item.quantity = new_qty

    db.commit()
    db.refresh(db_order)
    return db_order

@router.patch("/{order_id}/status", response_model=schemas.OrderResponse)
def update_order_status(order_id: int, status: str, db: Session = Depends(get_db)):
    """Quick status update for an order."""
    db_order = db.query(models.Order).filter(models.Order.id == order_id).first()
    if not db_order:
        raise HTTPException(status_code=404, detail="Order not found")

    db_order.status = status
    db.commit()
    db.refresh(db_order)
    return db_order
