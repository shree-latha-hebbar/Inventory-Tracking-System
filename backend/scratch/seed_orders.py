import sys
import os
from datetime import datetime

# Add the parent directory to sys.path so we can import the models
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.db import db
from models.order_model import Order
from models.product_model import Product
from models.product_model import Product

def seed_orders():
    app = create_app()
    with app.app_context():
        print("Seeding Orders...")
        
        # Clear existing data
        # Order.query.delete()
        
        # Find a real product to link to
        product = Product.query.first()
        p_id = product.product_id if product else "PROD-001"
        p_name = product.name if product else "Generic Product"

        # 1. Create Mock Orders
        mock_orders = [
            {
                "order_id": "PO-8041",
                "product_id": p_id,
                "supplier": "Global Tech Inc.",
                "date": "Today",
                "quantity": 10,
                "value": "$12,400",
                "status": "Approved"
            },
            {
                "order_id": "PO-8040",
                "product_id": p_id,
                "supplier": "Office Max Co.",
                "date": "Yesterday",
                "quantity": 5,
                "value": "$1,850",
                "status": "Pending"
            },
            {
                "order_id": "PO-8039",
                "product_id": p_id,
                "supplier": "Steelcase Mfg.",
                "date": "15 Apr",
                "quantity": 8,
                "value": "$4,200",
                "status": "Received"
            }
        ]

        for o in mock_orders:
            if not Order.query.filter_by(order_id=o["order_id"]).first():
                new_order = Order(**o)
                db.session.add(new_order)
                print(f"Added order {o['order_id']}")

        db.session.commit()
        print("Seeding completed successfully!")

if __name__ == "__main__":
    seed_orders()
