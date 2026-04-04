import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import SessionLocal
import models

db = SessionLocal()
try:
    db_medicine = models.Medicine(
        brand_name="Test2",
        generic_name="Test2",
        category="Test2",
        strength="Test2",
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
    with open('db_error.txt', 'w') as f:
        f.write(str(e))
    print("Error saved to db_error.txt")
