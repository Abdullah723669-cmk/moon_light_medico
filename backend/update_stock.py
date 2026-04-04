import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import engine
from sqlalchemy import text

def run_update():
    with engine.begin() as conn:
        try:
            print("Updating opening_stock and stock_date...")
            conn.execute(text("UPDATE medicines SET opening_stock = 500, stock_date = '2026-04-05';"))
            print("Update completed successfully.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_update()
