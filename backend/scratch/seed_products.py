import sys
import os

# Add the backend directory to sys.path
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.db import db
from models.product_model import Product

INITIAL_PRODUCTS = [
  { "product_id": "PRD-2031", "name": "Corporate Workstation", "category": "Hardware", "total": 45, "current": 38, "price": "$2,400" },
  { "product_id": "PRD-2032", "name": "UltraSharp Display 32\"", "category": "Monitor", "total": 20, "current": 4, "price": "$899" },
  { "product_id": "PRD-2033", "name": "Logitech MX Master 3S", "category": "Peripheral", "total": 100, "current": 85, "price": "$99" },
  { "product_id": "PRD-2034", "name": "Steelcase Gesture Chair", "category": "Furniture", "total": 12, "current": 2, "price": "$1,300" },
  { "product_id": "PRD-2035", "name": "MacBook Pro M3 Max", "category": "Laptops", "total": 15, "current": 15, "price": "$3,499" },
  { "product_id": "PRD-2036", "name": "Dell Precision Tower", "category": "Hardware", "total": 8, "current": 0, "price": "$4,200" },
  { "product_id": "PRD-2037", "name": "Sony WH-1000XM5", "category": "Audio", "total": 30, "current": 22, "price": "$399" },
  { "product_id": "PRD-2038", "name": "iPad Pro 12.9\"", "category": "Tablets", "total": 25, "current": 10, "price": "$1,099" },
  { "product_id": "PRD-2039", "name": "Herman Miller Aeron", "category": "Furniture", "total": 10, "current": 8, "price": "$1,500" },
  { "product_id": "PRD-2040", "name": "Samsung Odyssey G9", "category": "Monitor", "total": 5, "current": 1, "price": "$1,299" },
  { "product_id": "PRD-2041", "name": "Blue Yeti Microphone", "category": "Audio", "total": 15, "current": 12, "price": "$129" },
  { "product_id": "PRD-2042", "name": "Keychron K2 Keyboard", "category": "Peripheral", "total": 40, "current": 35, "price": "$89" },
  { "product_id": "PRD-2043", "name": "Steelcase Leap V2", "category": "Furniture", "total": 8, "current": 5, "price": "$1,100" },
  { "product_id": "PRD-2044", "name": "Dell UltraSharp 27\"", "category": "Monitor", "total": 15, "current": 10, "price": "$499" },
]

app = create_app()
with app.app_context():
    for p in INITIAL_PRODUCTS:
        existing = Product.query.filter_by(product_id=p['product_id']).first()
        if not existing:
            new_prod = Product(**p)
            db.session.add(new_prod)
            print(f"Adding product: {p['name']}")
    db.session.commit()
    print("Database seeded!")
