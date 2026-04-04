import urllib.request
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

data = json.dumps(payload).encode('utf-8')
req = urllib.request.Request("http://localhost:8000/api/medicines/", data=data, headers={'Content-Type': 'application/json'})
try:
    with urllib.request.urlopen(req) as res:
        print("STATUS:", res.getcode())
        print("RESPONSE:", res.read().decode('utf-8'))
except urllib.error.HTTPError as e:
    print("STATUS:", e.code)
    print("RESPONSE:", e.read().decode('utf-8'))
except Exception as e:
    print("Exception:", e)
