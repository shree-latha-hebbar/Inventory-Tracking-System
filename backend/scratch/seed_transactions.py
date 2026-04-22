from app import create_app
from models.db import db
from models.transaction_model import Transaction
from models.product_model import Product
from models.user_model import User

app = create_app()
with app.app_context():
    # 1. Get the admin user to associate with transactions
    admin = User.query.filter_by(username='admin').first()
    if not admin:
        print("Admin user not found. Please run seed script first.")
        exit()

    # 2. Get existing products
    products = Product.query.all()
    if not products:
        print("No products found to transact.")
        exit()
    
    # 3. Define some initial history
    txn_data = [
        {"pid": products[0].id, "qty": 15, "type": "RESTOCK", "notes": "Legacy stock migration"},
        {"pid": products[1].id, "qty": -5, "type": "OUT", "notes": "Internal audit adjustment"},
        {"pid": products[2].id, "qty": 10, "type": "IN", "notes": "Sample delivery"},
    ]

    for data in txn_data:
        new_txn = Transaction(
            product_id=data["pid"],
            user_id=admin.id,
            quantity=data["qty"],
            transaction_type=data["type"],
            notes=data["notes"]
        )
        db.session.add(new_txn)
    
    db.session.commit()
    print(f"Successfully seeded {len(txn_data)} transactions.")
