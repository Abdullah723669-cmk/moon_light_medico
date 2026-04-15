import sys
import os
sys.path.append(os.path.abspath("backend"))

from database import engine
from sqlalchemy import text

try:
    with engine.connect() as conn:
        print("Checking medicines table columns:")
        result = conn.execute(text("DESCRIBE medicines"))
        for row in result:
            print(row)
except Exception as e:
    print(f"Error: {e}")
