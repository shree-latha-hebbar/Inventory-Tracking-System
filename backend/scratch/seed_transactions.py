import requests
import random
from datetime import datetime, timedelta

BASE_URL = "http://127.0.0.1:5001/api"

def seed_transactions():
    print("🚀 Seeding transactions...")
    
    # 1. Login to get token
    login_data = {"email": "admin@inventrack.com", "password": "password123"}
    login_res = requests.post(f"{BASE_URL}/auth/login", json=login_data)
    if login_res.status_code != 200:
        print("❌ Login failed. Make sure server is running and seeds are populated.")
        return
    token = login_res.json().get("access_token")
    headers = {"Authorization": f"Bearer {token}"}

    # 2. Get products
    prod_res = requests.get(f"{BASE_URL}/products/", headers=headers)
    products = prod_res.json()
    if not products:
        print("❌ No products found to seed transactions for.")
        return

    # 3. Create random transactions over the last 30 days
    actions = ["RESTOCK", "CONSUME", "ADJUSTMENT", "SALE"]
    
    for _ in range(25):
        product = random.choice(products)
        action = random.choice(actions)
        qty = random.randint(1, 10)
        
        # Random date within last 30 days
        days_ago = random.randint(0, 30)
        timestamp = (datetime.utcnow() - timedelta(days=days_ago)).isoformat()

        payload = {
            "product_id": product['id'],
            "type": action,
            "quantity": qty,
            "notes": f"Seeded {action} for {product['name']}",
            "timestamp": timestamp
        }

        res = requests.post(f"{BASE_URL}/transactions/", json=payload, headers=headers)
        if res.status_code == 201:
            print(f"✅ Added {action} for {product['name']}")
        else:
            print(f"❌ Failed to add transaction: {res.text}")

if __name__ == "__main__":
    seed_transactions()
