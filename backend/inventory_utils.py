import datetime
from sqlalchemy.orm import Session
import models

def get_or_create_daily_stock(db: Session, medicine_id: int, target_date: datetime.date = None):
    """
    Ensures a Stock record exists for the target date for a specific medicine.
    Implements the 'Auto-shift' logic: Previous closing is this date's opening.
    """
    if target_date is None:
        target_date = datetime.date.today()
    
    # Check if record already exists for target_date
    stock_record = db.query(models.Stock).filter(
        models.Stock.medicine_id == medicine_id, 
        models.Stock.date == target_date
    ).first()
    
    if stock_record:
        return stock_record
    
    # Record doesn't exist, create it by shifting previous record's closing
    medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if not medicine:
        return None
        
    # Find most recent previous record
    last_record = db.query(models.Stock).filter(
        models.Stock.medicine_id == medicine_id,
        models.Stock.date < target_date
    ).order_by(models.Stock.date.desc()).first()
    
    # If no previous record, use the medicine's opening_stock (initial setup)
    opening_stock = last_record.closing_stock if last_record else (medicine.opening_stock or 0)
    
    new_stock = models.Stock(
        date=target_date,
        medicine_id=medicine_id,
        brand_name=medicine.brand_name,
        opening_stock=opening_stock,
        sales_quantity=0,
        return_sales_quantity=0,
        added_quantity=0,
        closing_stock=opening_stock # Starts as opening before any transaction
    )
    
    db.add(new_stock)
    db.commit()
    db.refresh(new_stock)
    return new_stock

def update_daily_stock(db: Session, medicine_id: int, sales_diff: int = 0, returns_diff: int = 0, added_diff: int = 0):
    """
    Updates today's stock record with the provided differences.
    Adjusts closing_stock accordingly.
    """
    stock_record = get_or_create_daily_stock(db, medicine_id)
    if not stock_record:
        return
        
    stock_record.sales_quantity += sales_diff
    stock_record.return_sales_quantity += returns_diff
    stock_record.added_quantity += added_diff
    
    # closing = opening + added + returns - sales
    stock_record.closing_stock = (
        stock_record.opening_stock + 
        stock_record.added_quantity + 
        stock_record.return_sales_quantity - 
        stock_record.sales_quantity
    )
    
    # Also update the Medicine table current state just in case
    medicine = db.query(models.Medicine).filter(models.Medicine.id == medicine_id).first()
    if medicine:
        medicine.stock_quantity = stock_record.closing_stock
        medicine.total_sales_quantity = (medicine.total_sales_quantity or 0) + (sales_diff - returns_diff)
        medicine.closing_stock = stock_record.closing_stock
        
    db.commit()
    db.refresh(stock_record)
    return stock_record
