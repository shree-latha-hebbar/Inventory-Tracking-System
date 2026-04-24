import requests

BASE_URL = "http://127.0.0.1:5001/api"

# 1. Login to get token
print("Logging in...")
login_data = {"username": "admin", "password": "admin123"}
r = requests.post(f"{BASE_URL}/auth/login", json=login_data)
if r.status_code != 200:
    print(f"[ERROR] Login failed: {r.text}")
    exit()

token = r.json().get("access_token")

# 2. Fetch Orders
print("Fetching Orders...")
headers = {"Authorization": f"Bearer {token}"}
r = requests.get(f"{BASE_URL}/orders/", headers=headers)

if r.status_code == 200:
    orders = r.json()
    print(f"\n[SUCCESS] Found {len(orders)} orders in the database:")
    print("-" * 50)
    for order in orders:
        print(f"Order ID: {order['order_id']}")
        print(f"Supplier: {order['supplier']}")
        print(f"Value:    {order['value']}")
        print(f"Status:   {order['status']}")
        print(f"Product:  {order.get('product_id', 'N/A')}")
        print("-" * 50)
else:
    print(f"[ERROR] Failed to fetch orders: {r.status_code}")
    print(r.text)
