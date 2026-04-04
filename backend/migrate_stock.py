import sys
import os

from database import engine
from sqlalchemy import text

def run_migration():
    """Adds stock tracking columns to the medicines table safely."""
    with engine.begin() as conn:
        try:
            print("Adding stock_date column...")
            conn.execute(text("ALTER TABLE medicines ADD COLUMN stock_date DATE;"))
        except Exception as e:
            print(f"Skipping stock_date: {e}")

        try:
            print("Adding opening_stock column...")
            conn.execute(text("ALTER TABLE medicines ADD COLUMN opening_stock INT DEFAULT 0;"))
        except Exception as e:
            print(f"Skipping opening_stock: {e}")
            
        try:
            print("Adding total_sales_quantity column...")
            conn.execute(text("ALTER TABLE medicines ADD COLUMN total_sales_quantity INT DEFAULT 0;"))
        except Exception as e:
            print(f"Skipping total_sales_quantity: {e}")
            
        try:
            print("Adding closing_stock column...")
            conn.execute(text("ALTER TABLE medicines ADD COLUMN closing_stock INT DEFAULT 0;"))
        except Exception as e:
            print(f"Skipping closing_stock: {e}")

    print("Migration completed successfully.")

if __name__ == "__main__":
    run_migration()
