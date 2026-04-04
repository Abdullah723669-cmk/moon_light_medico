import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import engine
from sqlalchemy import text

def run_update():
    with engine.begin() as conn:
        try:
            print("Updating stock_date to today...")
            conn.execute(text("UPDATE medicines SET stock_date = CURRENT_DATE();"))
            print("Update completed successfully.")
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_update()
