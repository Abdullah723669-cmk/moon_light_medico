from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas
from sqlalchemy import or_
import inventory_utils

router = APIRouter(prefix="/api/medicines", tags=["Medicines"])

def inject_today_stock(db: Session, medicine: models.Medicine):
    """Helper to attach today's stock metrics to a medicine object."""
    daily_stock = inventory_utils.get_or_create_daily_stock(db, medicine.id)
    if daily_stock:
        medicine.today_opening = daily_stock.opening_stock
        medicine.today_added = daily_stock.added_quantity
        medicine.today_sales = daily_stock.sales_quantity
        medicine.today_returns = daily_stock.return_sales_quantity
        medicine.today_closing = daily_stock.closing_stock
    return medicine

@router.get("/search", response_model=List[schemas.MedicineResponse])
def search_medicines(q: str = "", db: Session = Depends(get_db)):
    medicines = db.query(models.Medicine).filter(
        or_(
            models.Medicine.brand_name.ilike(f"%{q}%"),
            models.Medicine.generic_name.ilike(f"%{q}%"),
            models.Medicine.category.ilike(f"%{q}%")
        )
    ).all()
    return [inject_today_stock(db, m) for m in medicines]

@router.get("/", response_model=List[schemas.MedicineResponse])
def get_all_medicines(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    medicines = db.query(models.Medicine).offset(skip).limit(limit).all()
    return [inject_today_stock(db, m) for m in medicines]

@router.get("/{id}", response_model=schemas.MedicineResponse)
def get_medicine(id: int, db: Session = Depends(get_db)):
    medicine = db.query(models.Medicine).filter(models.Medicine.id == id).first()
    if not medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")
    return inject_today_stock(db, medicine)

@router.post("/", response_model=schemas.MedicineResponse, status_code=201)
def create_medicine(medicine: schemas.MedicineCreate, db: Session = Depends(get_db)):
    db_medicine = models.Medicine(**medicine.model_dump())
    db.add(db_medicine)
    db.commit()
    db.refresh(db_medicine)
    
    # Initialize Daily Stock record
    # If medicine is created with stock, it counts as 'added' today
    if db_medicine.stock_quantity > 0:
        inventory_utils.update_daily_stock(db, db_medicine.id, added_diff=db_medicine.stock_quantity)
    else:
        inventory_utils.get_or_create_daily_stock(db, db_medicine.id)
        
    db.refresh(db_medicine)
    return inject_today_stock(db, db_medicine)

@router.put("/{id}", response_model=schemas.MedicineResponse)
def update_medicine(id: int, medicine: schemas.MedicineUpdate, db: Session = Depends(get_db)):
    db_medicine = db.query(models.Medicine).filter(models.Medicine.id == id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    old_stock = db_medicine.stock_quantity
    # 1. Update medicine base fields
    update_data = medicine.model_dump(exclude_unset=True)
    
    # Extract today's overrides if provided
    manual_added = update_data.pop('today_added', None)
    manual_returns = update_data.pop('today_returns', None)
    
    for key, value in update_data.items():
        setattr(db_medicine, key, value)

    # 2. Sync with Daily Stock
    # If manual overrides were provided in the form, they take precedence
    if manual_added is not None or manual_returns is not None:
        stock_record = inventory_utils.get_or_create_daily_stock(db, db_medicine.id)
        if manual_added is not None:
            stock_record.added_quantity = manual_added
        if manual_returns is not None:
            stock_record.return_sales_quantity = manual_returns
            
        # Recalculate closing
        stock_record.closing_stock = (
            stock_record.opening_stock + 
            stock_record.added_quantity + 
            stock_record.return_sales_quantity - 
            stock_record.sales_quantity
        )
        # Sync back to medicine table
        db_medicine.stock_quantity = stock_record.closing_stock
        db_medicine.closing_stock = stock_record.closing_stock

    # Fallback: Sync with Daily Stock only if stock_quantity was updated manually (legacy logic)
    elif 'stock_quantity' in update_data:
        new_stock = update_data['stock_quantity']
        if new_stock > old_stock:
            inventory_utils.update_daily_stock(db, db_medicine.id, added_diff=(new_stock - old_stock))
        elif new_stock < old_stock:
            inventory_utils.update_daily_stock(db, db_medicine.id)

    db.commit()
    db.refresh(db_medicine)
    return inject_today_stock(db, db_medicine)

@router.delete("/{id}")
def delete_medicine(id: int, db: Session = Depends(get_db)):
    db_medicine = db.query(models.Medicine).filter(models.Medicine.id == id).first()
    if not db_medicine:
        raise HTTPException(status_code=404, detail="Medicine not found")

    # Delete associated order_items and stocks first to avoid foreign key constraint errors
    db.query(models.OrderItem).filter(models.OrderItem.medicine_id == id).delete()
    db.query(models.Stock).filter(models.Stock.medicine_id == id).delete()

    db.delete(db_medicine)
    db.commit()
    return {"message": "Deleted successfully"}
