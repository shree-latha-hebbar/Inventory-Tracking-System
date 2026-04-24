import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app

def send_email(subject, body, recipient=None, is_html=False):
    """
    Utility function to send an email using the configuration in app.config.
    """
    server = current_app.config['MAIL_SERVER']
    port = current_app.config['MAIL_PORT']
    use_tls = current_app.config['MAIL_USE_TLS']
    username = current_app.config['MAIL_USERNAME']
    password = current_app.config['MAIL_PASSWORD']
    sender = current_app.config['MAIL_DEFAULT_SENDER']
    
    receiver = recipient if recipient else current_app.config['MAIL_RECEIVER']

    msg = MIMEMultipart()
    msg['From'] = sender
    msg['To'] = receiver
    msg['Subject'] = subject
    
    # Attach body (Plain text or HTML)
    msg.attach(MIMEText(body, 'html' if is_html else 'plain'))

    try:
        smtp_conn = smtplib.SMTP(server, port, timeout=10)
        if use_tls:
            smtp_conn.starttls()
        
        smtp_conn.login(username, password)
        smtp_conn.send_message(msg)
        smtp_conn.quit()
        return True, "Email sent successfully"
    except Exception as e:
        print(f"SMTP Error: {e}")
        return False, str(e)

def send_low_stock_alert(product_name, current_stock):
    """
    Helper to send a pre-formatted low stock alert in HTML.
    """
    subject = f"🚨 Low Stock Alert: {product_name}"
    
    html_body = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
        <h2 style="color: #ef4444; margin-bottom: 16px;">Critical Stock Alert</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            The following product has reached a critical stock level:
        </p>
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0;">
            <p style="margin: 0; font-weight: 800; color: #0f172a;">Product: {product_name}</p>
            <p style="margin: 8px 0 0; color: #2563eb; font-weight: 700;">Remaining: {current_stock} Units</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
            Please log in to the <strong>InvenTrack Dashboard</strong> to manage replenishment.
        </p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            This is an automated message from your InvenTrack Intelligence System.
        </p>
    </div>
    """
    # 📬 Send the alert
    return send_email(subject, html_body, is_html=True)

def send_order_approval_notification(order):
    """
    Sends an email notification to both Manager and Supplier when a purchase order is approved.
    """
    from models.product_model import Product
    
    product_name = "Unknown Product"
    if order.product_id:
        try:
            product = Product.query.get(int(order.product_id))
            if product: product_name = product.name
        except:
            product = Product.query.filter_by(product_id=order.product_id).first()
            if product: product_name = product.name

    subject = f"✅ Purchase Order Approved: {order.order_id}"
    
    html_body = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
        <h2 style="color: #16a34a; margin-bottom: 16px;">Purchase Order Authorized</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            This order has been officially authorized for procurement.
        </p>
        <div style="background-color: #f0fdf4; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #bbf7d0;">
            <p style="margin: 0; font-weight: 800; color: #065f46;">Order ID: {order.order_id}</p>
            <p style="margin: 8px 0 0; color: #0f172a;"><strong>Asset:</strong> {product_name}</p>
            <p style="margin: 4px 0 0; color: #0f172a;"><strong>Quantity:</strong> {order.quantity} Units</p>
            <p style="margin: 4px 0 0; color: #0f172a;"><strong>Total Value:</strong> {order.value}</p>
            <p style="margin: 4px 0 0; color: #0f172a;"><strong>Supplier:</strong> {order.supplier}</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
            <strong>To Supplier:</strong> Please prepare the shipment as per the quantities listed above. 
            <strong>To Manager:</strong> Procurement has been initiated.
        </p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Official Authorization from InvenTrack Logistics.
        </p>
    </div>
    """
    
    # 📬 Send to Manager (from config)
    send_email(subject, html_body, is_html=True)
    # 📬 Send to Supplier (simulated - using receiver email for now)
    send_email(f"📦 New Order Authorization: {order.order_id}", html_body, is_html=True)
    # 📬 Also send a copy back to the Sender (configured Gmail account) for record-keeping
    return send_email(f"📋 Copy: Purchase Order Authorized - {order.order_id}", html_body, is_html=True)

def send_delivery_confirmation(order):
    """
    Sends a confirmation email to the supplier once the items are marked as 'Received'.
    """
    from models.product_model import Product
    
    product_name = "Unknown Product"
    if order.product_id:
        try:
            product = Product.query.get(int(order.product_id))
            if product: product_name = product.name
        except:
            product = Product.query.filter_by(product_id=order.product_id).first()
            if product: product_name = product.name

    subject = f"📦 Delivery Confirmation: {order.order_id}"
    
    html_body = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
        <h2 style="color: #2563eb; margin-bottom: 16px;">Shipment Received</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            We are confirming that the following shipment has been successfully received at our facility.
        </p>
        <div style="background-color: #eff6ff; padding: 16px; border-radius: 8px; margin: 20px 0; border: 1px solid #bfdbfe;">
            <p style="margin: 0; font-weight: 800; color: #1e40af;">Order ID: {order.order_id}</p>
            <p style="margin: 8px 0 0; color: #0f172a;"><strong>Product:</strong> {product_name}</p>
            <p style="margin: 4px 0 0; color: #0f172a;"><strong>Status:</strong> Delivered & Logged</p>
            <p style="margin: 4px 0 0; color: #0f172a;"><strong>Quantity:</strong> {order.quantity} Units</p>
        </div>
        <p style="color: #64748b; font-size: 14px;">
            Thank you for your timely fulfillment. This order is now marked as <strong>Completed</strong> in our system.
        </p>
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            Automated Delivery Receipt - InvenTrack Intelligence.
        </p>
    </div>
    """
    return send_email(subject, html_body, is_html=True)

def send_password_reset_email(user, reset_token):
    """
    Sends a password reset link to the user's registered email.
    The reset link will be: http://localhost:3000/reset-password?token={token}
    """
    # Frontend reset URL - update this for production
    reset_link = f"http://localhost:3000/reset-password?token={reset_token}"
    
    subject = "🔐 InvenTrack: Password Reset Request"
    
    html_body = f"""
    <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; padding: 20px; border: 1px solid #e2e8f0; border-radius: 12px; max-width: 600px;">
        <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f172a; font-size: 1.5rem; margin: 0;">InvenTrack</h1>
            <p style="color: #64748b; font-size: 0.85rem; margin: 4px 0 0;">Intelligent Inventory Management</p>
        </div>
        
        <h2 style="color: #ef4444; margin-bottom: 16px;">Password Reset Request</h2>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            Hello <strong>{user.username}</strong>,
        </p>
        <p style="color: #475569; font-size: 16px; line-height: 1.5;">
            We received a request to reset your password. Click the button below to create a new password for your account.
        </p>
        
        <div style="text-align: center; margin: 32px 0;">
            <a href="{reset_link}" style="display: inline-block; background: #0f172a; color: #ffffff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-weight: 700; font-size: 1rem;">
                Reset My Password
            </a>
        </div>
        
        <div style="background-color: #f8fafc; padding: 16px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #ef4444;">
            <p style="margin: 0; color: #64748b; font-size: 0.85rem;">
                <strong>⚠️ Security Notice:</strong> This link will expire in <strong>1 hour</strong>. If you did not request a password reset, please ignore this email. No changes will be made to your account.
            </p>
        </div>
        
        <hr style="border: 0; border-top: 1px solid #f1f5f9; margin: 24px 0;" />
        <p style="font-size: 12px; color: #94a3b8; text-align: center;">
            This is an automated message from the InvenTrack Intelligence System. Please do not reply to this email.
        </p>
    </div>
    """
    return send_email(subject, html_body, is_html=True)
