import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.db import db
from models.user_model import User

app = create_app()
with app.app_context():
    # Check for specific presets
    presets = [
        {"username": "manager", "email": "manager@inventrack.com", "password": "password123", "role": "Manager"},
        {"username": "staff", "email": "staff@inventrack.com", "password": "password123", "role": "Staff"},
        {"username": "admin", "email": "admin@inventrack.com", "password": "admin123", "role": "Admin"}
    ]
    
    for p in presets:
        existing = User.query.filter((User.username == p['username']) | (User.email == p['email'])).first()
        if not existing:
            print(f"Creating missing user: {p['username']}")
            new_user = User(username=p['username'], email=p['email'], role=p['role'])
            new_user.set_password(p['password'])
            db.session.add(new_user)
            db.session.commit()
        else:
            print(f"User already exists: {p['username']}")
            # Update password/role if needed, but existing is fine for now.
