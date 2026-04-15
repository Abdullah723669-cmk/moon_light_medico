import sys
import os

# Add backend to path
sys.path.append(os.path.abspath("backend"))

try:
    from database import engine
    from sqlalchemy import text
    
    print("Connecting...")
    with engine.connect() as conn:
        print("Executing SELECT 1...")
        result = conn.execute(text("SELECT 1")).fetchone()
        print(f"Result: {result}")
        
    print("Connection successful!")
except Exception as e:
    print(f"Error: {e}")
    import traceback
    traceback.print_exc()
