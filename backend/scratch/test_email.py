import sys
import os

# Add the backend directory to sys.path so we can import modules
sys.path.append(os.path.abspath(os.path.join(os.path.dirname(__file__), '..')))

from app import create_app
from utils.email_service import send_email, send_low_stock_alert

def test_email_connection():
    app = create_app()
    with app.app_context():
        print("--- Testing Email Connection ---")
        print(f"Server: {app.config['MAIL_SERVER']}")
        print(f"Port: {app.config['MAIL_PORT']}")
        print(f"User: {app.config['MAIL_USERNAME']}")
        print(f"Recipient: {app.config['MAIL_RECEIVER']}")
        
        # Test 1: Simple Plain Text Email
        print("\nSending plain text test email...")
        success, message = send_email("Test: Connection Check", "If you receive this, the InvenTrack SMTP connection is working.")
        if success:
            print("✅ Plain text email sent!")
        else:
            print(f"❌ Failed: {message}")

        # Test 2: HTML Low Stock Alert
        print("\nSending HTML low stock alert...")
        success, message = send_low_stock_alert("Corporate Workstation", 3)
        if success:
            print("✅ HTML alert sent!")
        else:
            print(f"❌ Failed: {message}")

if __name__ == '__main__':
    test_email_connection()
