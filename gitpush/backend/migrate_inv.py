import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import engine
from sqlalchemy import text
import models

def run_migration():
    # Let SQLAlchemy construct the new order_items table securely on its own
    print("Executing SQLAlchemy table creation for new models...")
    models.Base.metadata.create_all(bind=engine)

    # Let's perform the manual ALTER command for the Invoice Number explicitly 
    with engine.begin() as conn:
        try:
            print("Adding invoice_number to orders...")
            conn.execute(text("ALTER TABLE orders ADD COLUMN invoice_number VARCHAR(50);"))
        except Exception as e:
            print(f"Adding invoice column skipped/error: {e}")

if __name__ == "__main__":
    run_migration()
