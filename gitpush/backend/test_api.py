import requests
import json

payload = {
    "brand_name": "Test",
    "generic_name": "Test",
    "category": "Test",
    "strength": "Test",
    "is_rx": False,
    "price": 10.0,
    "stock_quantity": 10,
    "stock_date": None,
    "opening_stock": None,
    "total_sales_quantity": None,
    "closing_stock": None
}

try:
    res = requests.post("http://localhost:8000/api/medicines/", json=payload)
    print("STATUS:", res.status_code)
    print("RESPONSE:", res.text)
except Exception as e:
    print("Exception:", e)
