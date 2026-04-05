import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import engine
from sqlalchemy import text

def run_migration():
    with engine.begin() as conn:
        try:
            print("Adding discount_amount column to orders...")
            conn.execute(text("ALTER TABLE orders ADD COLUMN discount_amount FLOAT DEFAULT 0.0;"))
            print("Success")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_migration()
