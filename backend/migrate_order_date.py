import sys
from database import engine
from sqlalchemy import text

def run_migration():
    with engine.begin() as conn:
        try:
            print("Adding order_date column...")
            conn.execute(text("ALTER TABLE orders ADD COLUMN order_date DATE;"))
        except Exception as e:
            print(f"Error or already exists: {e}")

    print("Migration completed successfully.")

if __name__ == "__main__":
    run_migration()
