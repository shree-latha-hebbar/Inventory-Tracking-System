from utils.email_service import send_low_stock_alert
from models.notification_model import Notification
from models.order_model import Order
from models.db import db
import random
from datetime import datetime

def check_stock_level(product):
    """
    Checks if a product's stock is low and triggers an alert if necessary.
    Also automatically creates a Pending Purchase Order for Manager approval.
    """
    # Threshold logic: 10% of total capacity or minimum 5 units
    threshold = max(int(product.total * 0.1), 5)
    
    if product.current <= threshold:
        print(f"ALERT: Low stock detected for {product.name} ({product.current} units left).")
        
        # 1. Create an In-App Notification
        try:
            # Check if we already sent a notification recently
            new_notif = Notification(
                title="Critical Stock Alert",
                message=f"{product.name} is low on stock ({product.current} left). Auto-order created for approval.",
                type="critical"
            )
            db.session.add(new_notif)
        except Exception as e:
            print(f"Error creating notification: {e}")

        # 2. Automatically Create a Pending Purchase Order for Manager Approval
        try:
            # Check if a pending order already exists for this product
            existing_order = Order.query.filter_by(product_id=str(product.id), status='Pending').first()
            
            if not existing_order:
                # Calculate restock quantity (back to total capacity)
                restock_qty = product.total - product.current
                if restock_qty <= 0: restock_qty = 10 # Default fallback
                
                # Estimate value
                try:
                    unit_price = float(product.price.replace('$', '').replace(',', ''))
                    total_value = f"${(unit_price * restock_qty):,.2f}"
                except:
                    total_value = "$0.00"

                new_order = Order(
                    order_id=f"AUTO-PO-{random.randint(1000, 9999)}",
                    product_id=str(product.id),
                    supplier="System Auto-Sourcing",
                    date=datetime.now().strftime("%d %b %Y"),
                    quantity=restock_qty,
                    value=total_value,
                    status='Pending'
                )
                db.session.add(new_order)
                print(f"AUTO-ORDER: Created pending order for {product.name}.")
        except Exception as e:
            print(f"Error creating auto-order: {e}")

        db.session.commit()

        # 3. Trigger the email service (Initial alert to admin/manager)
        success, message = send_low_stock_alert(product.name, product.current)
        
        if success:
            return True, f"Alert sent and Auto-Order created for {product.name}"
        else:
            return False, f"Failed to send alert for {product.name}: {message}"
            
    return False, "Stock level is sufficient"

def process_transaction_alerts(product):
    """
    Wrapper to be called after every transaction (Sale or Adjustment)
    to ensure stock levels are monitored in real-time.
    """
    return check_stock_level(product)
