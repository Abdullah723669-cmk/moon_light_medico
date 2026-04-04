import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import engine
from sqlalchemy import text

def run_update():
    with engine.begin() as conn:
        try:
            print("Syncing stock_quantity with closing_stock...")
            conn.execute(text("UPDATE medicines SET stock_quantity = closing_stock;"))
            print("Update completed successfully.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_update()
