import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import SessionLocal
import models
import datetime

db = SessionLocal()
try:
    db_medicine = models.Medicine(
        brand_name="Test",
        generic_name="Test",
        category="Test",
        strength="Test",
        price=1.0,
        stock_quantity=10,
        stock_date=None,
        opening_stock=None,
        total_sales_quantity=None,
        closing_stock=None,
    )
    db.add(db_medicine)
    db.commit()
    print("Success")
except Exception as e:
    print("DB ERROR:", str(e))
