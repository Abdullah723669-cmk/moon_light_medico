import sys
import os

# Add the parent directory to sys.path to import from sibling modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from database import SessionLocal
import models
import datetime

def reset_database():
    db = SessionLocal()
    try:
        print("Starting Database Reset...")

        # 1. Delete transactions
        print("- Clearing Order Items...")
        db.query(models.OrderItem).delete()
        
        print("- Clearing Orders...")
        db.query(models.Order).delete()
        
        print("- Clearing Stock Logs...")
        db.query(models.Stock).delete()
        
        print("- Clearing Prescriptions...")
        db.query(models.Prescription).delete()

        # 2. Reset Medicines
        print("- Resetting all medicines to 500 pcs...")
        medicines = db.query(models.Medicine).all()
        today = datetime.date.today()
        
        for medicine in medicines:
            medicine.stock_quantity = 500
            medicine.opening_stock = 500
            medicine.closing_stock = 500
            medicine.total_sales_quantity = 0
            
            # 3. Re-initialize today's stock record for the report
            new_stock = models.Stock(
                date=today,
                medicine_id=medicine.id,
                brand_name=medicine.brand_name,
                opening_stock=500,
                sales_quantity=0,
                return_sales_quantity=0,
                added_quantity=0,
                closing_stock=500
            )
            db.add(new_stock)

        db.commit()
        print("SUCCESS: Database has been reset to brand new state.")
        print(f"Total Medicines Reset: {len(medicines)}")

    except Exception as e:
        db.rollback()
        print(f"ERROR during reset: {str(e)}")
    finally:
        db.close()

if __name__ == "__main__":
    reset_database()
