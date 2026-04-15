from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from typing import List
from database import get_db
import models
import schemas

import datetime
import inventory_utils
from typing import Optional

router = APIRouter(prefix="/api/stock", tags=["Stock Management"])

@router.get("/", response_model=List[schemas.StockResponse])
def get_stock_logs(target_date: Optional[datetime.date] = None, db: Session = Depends(get_db)):
    """Fetch daily stock logs for a specific date. If date is not provided, defaults to today. Ensures all medicines have a record for this date."""
    if target_date is None:
        target_date = datetime.date.today()
        
    # Force initialize stock records for all medicines for target_date
    medicines = db.query(models.Medicine).all()
    for medicine in medicines:
        inventory_utils.get_or_create_daily_stock(db, medicine.id, target_date)
        
    return db.query(models.Stock).filter(models.Stock.date == target_date).order_by(models.Stock.brand_name.asc()).all()
