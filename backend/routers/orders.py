from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
import models, schemas
from database import get_db

router = APIRouter(prefix="/orders", tags=["orders"])

@router.post("/", response_model=schemas.OrderResponse)
def create_order(order: schemas.OrderCreate, db: Session = Depends(get_db)):
    # Calculate next order ID
    last_order = db.query(models.Order).order_by(models.Order.id.desc()).first()
    next_id = 1 if not last_order else last_order.id + 1
    
    # Format order_number like ORD-000001
    order_number = f"ORD-{next_id:06d}"
    
    db_order = models.Order(
        order_number=order_number,
        customer_name=order.customer_name,
        phone_number=order.phone_number,
        address=order.address,
        total_cost=order.total_cost,
        payment_mode=order.payment_mode,
        status="Pending"
    )
    
    db.add(db_order)

    # Process inventory updates based on cart items
    for item in order.items:
        medicine = db.query(models.Medicine).filter(models.Medicine.id == item.medicine_id).first()
        if medicine:
            # Increment daily sales
            medicine.total_sales_quantity = (medicine.total_sales_quantity or 0) + item.quantity
            # Decrement active stock
            medicine.stock_quantity = (medicine.stock_quantity or 0) - item.quantity
            # Set today's closing stock dynamically
            medicine.closing_stock = medicine.stock_quantity

    db.commit()
    db.refresh(db_order)
    return db_order

@router.get("/", response_model=list[schemas.OrderResponse])
def get_orders(db: Session = Depends(get_db)):
    return db.query(models.Order).all()
