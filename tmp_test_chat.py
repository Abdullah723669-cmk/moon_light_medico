import requests
import json

url = "http://localhost:8000/api/chat/"
payload = {
    "messages": [
        {"role": "user", "content": "What is the price of Maxpro?"}
    ]
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=payload)
    print(f"Status Code: {response.status_code}")
    print("Response:")
    print(json.dumps(response.json(), indent=2))
except Exception as e:
    print(f"Error: {e}")
