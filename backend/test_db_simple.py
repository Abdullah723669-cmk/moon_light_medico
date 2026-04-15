import sys
import os
sys.path.append(os.getcwd())
from sqlalchemy import create_engine, text
from database import DB_USER, DB_PASSWORD, DB_HOST, DB_PORT, DB_NAME

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://{DB_USER}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
print(f"Connecting to: {SQLALCHEMY_DATABASE_URL.replace(DB_PASSWORD, '****')}")

try:
    engine = create_engine(SQLALCHEMY_DATABASE_URL)
    with engine.connect() as connection:
        result = connection.execute(text("SELECT count(*) FROM medicines"))
        count = result.scalar()
        print(f"Successfully connected! Found {count} medicines.")
except Exception as e:
    print(f"Error: {e}")
