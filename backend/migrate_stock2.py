import sys
sys.path.append('d:/Moon_Light_Medico/backend')
from database import engine
from sqlalchemy import text

def run_migration():
    with engine.begin() as conn:
        try:
            print("Adding stock_quantity column...")
            conn.execute(text("ALTER TABLE medicines ADD COLUMN stock_quantity INT DEFAULT 0;"))
        except Exception as e:
            print(f"Error: {e}")

if __name__ == "__main__":
    run_migration()
