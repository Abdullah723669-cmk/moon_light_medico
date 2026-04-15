import sys
import os
sys.path.append(os.path.abspath("backend"))

from database import SessionLocal
from routers.chat import perform_search

db = SessionLocal()
try:
    print("Testing perform_search('Napa')...")
    result = perform_search("Napa", db)
    print(f"Result:\n{result}")
finally:
    db.close()
