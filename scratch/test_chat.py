import requests

url = "http://127.0.0.1:8000/api/chat/"
data = {
    "messages": [
        {"role": "user", "content": "What is the price of Napa?"}
    ]
}

try:
    print(f"Sending request to {url}...")
    response = requests.post(url, json=data)
    print(f"Status Code: {response.status_code}")
    print(f"Response: {response.json()}")
except Exception as e:
    print(f"Error: {e}")
