import sys
import os

# Add the backend directory to sys.path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from models.db import db
from models.supplier_model import Supplier

def seed_suppliers():
    app = create_app()
    with app.app_context():
        # Check if suppliers already exist
        if Supplier.query.first():
            print("Suppliers already seeded.")
            return

        suppliers = [
            Supplier("Global Tech Inc.", "Hardware & Silicates", "support@globaltech.com", "12 Days", 4.8),
            Supplier("Steelcase Mfg.", "Premium Furniture", "logistics@steelcase.com", "24 Days", 4.5),
            Supplier("LG Display Hub", "Monitors & Panels", "hub@lgdisplay.com", "08 Days", 4.9),
            Supplier("Logitech Logistics", "Peripherals", "b2b@logitech.com", "05 Days", 4.7),
            Supplier("Nvidia Foundry", "GPUs & Processing", "foundry@nvidia.com", "15 Days", 4.9)
        ]

        db.session.add_all(suppliers)
        db.session.commit()
        print("Suppliers seeded successfully!")

if __name__ == '__main__':
    seed_suppliers()
