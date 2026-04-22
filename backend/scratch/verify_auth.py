import requests
import json
import time

BASE_URL = "http://127.0.0.1:5000/api"

def test_auth():
    print("--- Starting Auth Verification ---")
    
    # 1. Register User
    register_data = {
        "username": "testuser",
        "email": "test@example.com",
        "password": "testpassword123",
        "role": "Staff"
    }
    
    print(f"Testing Registration for {register_data['username']}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/register", json=register_data)
        print(f"Status: {resp.status_code}")
        print(f"Response: {resp.json()}")
    except Exception as e:
        print(f"Registration failed: {e}")

    # 2. Login User
    login_data = {
        "username": "testuser",
        "password": "testpassword123"
    }
    
    print(f"\nTesting Login for {login_data['username']}...")
    try:
        resp = requests.post(f"{BASE_URL}/auth/login", json=login_data)
        print(f"Status: {resp.status_code}")
        data = resp.json()
        print(f"Response: {json.dumps(data, indent=2)}")
        
        if resp.status_code == 200 and "access_token" in data:
            print("\n[SUCCESS] Login verified! Access token received.")
            
            # 3. Test /me endpoint
            token = data["access_token"]
            headers = {"Authorization": f"Bearer {token}"}
            print("\nTesting /me endpoint...")
            resp_me = requests.get(f"{BASE_URL}/auth/me", headers=headers)
            print(f"Status: {resp_me.status_code}")
            print(f"Me Response: {resp_me.json()}")
        else:
            print("\n[FAILURE] Login failed.")
            
    except Exception as e:
        print(f"Login failed: {e}")

if __name__ == "__main__":
    # Wait a bit for server to be ready
    time.sleep(2)
    test_auth()
