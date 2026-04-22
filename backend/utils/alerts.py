from utils.email_service import send_low_stock_alert

def check_stock_level(product):
    """
    Checks if a product's stock is low and triggers an alert if necessary.
    A product is considered 'low stock' if current quantity is less than 10% of total capacity,
    or if it falls below a hardcoded minimum (e.g., 5 units).
    """
    # Threshold logic: 10% of total capacity or minimum 5 units
    threshold = max(int(product.total * 0.1), 5)
    
    if product.current <= threshold:
        print(f"ALERT: Low stock detected for {product.name} ({product.current} units left).")
        
        # Trigger the email service
        success, message = send_low_stock_alert(product.name, product.current)
        
        if success:
            return True, f"Alert sent for {product.name}"
        else:
            return False, f"Failed to send alert for {product.name}: {message}"
            
    return False, "Stock level is sufficient"

def process_transaction_alerts(product):
    """
    Wrapper to be called after every transaction (Sale or Adjustment)
    to ensure stock levels are monitored in real-time.
    """
    return check_stock_level(product)
