import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app

def send_email(subject, body, recipient=None):
    """
    Utility function to send an email using the configuration in app.config.
    Both sender and receiver defaults are pulled from the same place (config.py).
    """
    # Pull config from current_app context
    server = current_app.config['MAIL_SERVER']
    port = current_app.config['MAIL_PORT']
    use_tls = current_app.config['MAIL_USE_TLS']
    username = current_app.config['MAIL_USERNAME']
    password = current_app.config['MAIL_PASSWORD']
    sender = current_app.config['MAIL_DEFAULT_SENDER']
    
    # Use the default receiver from config if no recipient is provided
    receiver = recipient if recipient else current_app.config['MAIL_RECEIVER']

    # Create the message
    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = receiver
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    try:
        # Connect to the SMTP server
        smtp_conn = smtplib.SMTP(server, port)
        if use_tls:
            smtp_conn.starttls()
        
        # Login
        smtp_conn.login(username, password)
        
        # Send the email
        smtp_conn.send_message(msg)
        smtp_conn.quit()
        return True, "Email sent successfully"
    except Exception as e:
        return False, str(e)

def send_low_stock_alert(product_name, current_stock):
    """
    Helper to send a pre-formatted low stock alert.
    """
    subject = f"Low Stock Alert: {product_name}"
    body = f"The product '{product_name}' has reached a low stock level. Current quantity: {current_stock}. Please restock soon."
    return send_email(subject, body)
