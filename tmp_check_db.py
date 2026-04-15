import sys
import os

backend_path = r"d:\Moon_Light_Medico\backend"
sys.path.append(backend_path)

try:
    from database import engine
    from sqlalchemy import text
    
    print("Connecting to database...")
    with engine.connect() as conn:
        print("Checking tables...")
        res = conn.execute(text("SHOW TABLES")).fetchall()
        print(f"Tables: {res}")
        
        print("\nDescribing medicines table:")
        res = conn.execute(text("DESCRIBE medicines")).fetchall()
        for row in res:
            print(row)
            
        print("\nData sample (brand_name, stock_quantity):")
        res = conn.execute(text("SELECT brand_name, stock_quantity FROM medicines LIMIT 3")).fetchall()
        for row in res:
            print(row)
            
except Exception as e:
    print(f"\nERROR: {str(e)}")
