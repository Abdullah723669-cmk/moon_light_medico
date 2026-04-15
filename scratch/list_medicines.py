import sys
import os
sys.path.append(os.path.abspath("backend"))

from database import SessionLocal
import models

db = SessionLocal()
try:
    medicines = db.query(models.Medicine).limit(10).all()
    for m in medicines:
        print(f"ID: {m.id} | Brand: {m.brand_name} | Generic: {m.generic_name}")
finally:
    db.close()
