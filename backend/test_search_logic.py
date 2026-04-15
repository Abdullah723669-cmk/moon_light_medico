import sys
import os
sys.path.append(os.getcwd())
from sqlalchemy.orm import Session
from database import SessionLocal
from routers.chat import perform_search
import models

def test_search():
    db = SessionLocal()
    try:
        # Test 1: Empty search
        res = perform_search("What is the price of Napa?", db)
        print("Search Results for 'Napa':")
        print(res)
        
        # Test 2: Check models
        medicines = db.query(models.Medicine).all()
        print(f"\nTotal medicines via models: {len(medicines)}")
        if medicines:
             print(f"First medicine: {medicines[0].brand_name}")
             
    except Exception as e:
        print(f"Error: {e}")
    finally:
        db.close()

if __name__ == "__main__":
    test_search()
