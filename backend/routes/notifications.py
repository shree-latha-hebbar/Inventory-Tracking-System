from flask import Blueprint, request, jsonify
from models.db import db
from models.notification_model import Notification, notifications_schema, notification_schema
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.product_model import Product

notifications_bp = Blueprint('notifications', __name__)

@notifications_bp.route('/', methods=['GET'])
@jwt_required()
def get_notifications():
    # Fetch notifications for current user or global notifications
    current_user_id = get_jwt_identity()
    notifications = Notification.query.filter(
        (Notification.user_id == current_user_id) | (Notification.user_id == None)
    ).order_by(Notification.timestamp.desc()).limit(10).all()
    
    return jsonify(notifications_schema.dump(notifications)), 200

@notifications_bp.route('/read/<int:id>', methods=['PUT'])
@jwt_required()
def mark_as_read(id):
    notification = Notification.query.get(id)
    if not notification:
        return jsonify({"message": "Notification not found"}), 404
    
    notification.is_read = True
    db.session.commit()
    return jsonify({"message": "Notification marked as read"}), 200

@notifications_bp.route('/read-all', methods=['PUT'])
@jwt_required()
def mark_all_as_read():
    current_user_id = get_jwt_identity()
    Notification.query.filter_by(user_id=current_user_id, is_read=False).update({"is_read": True})
    db.session.commit()
    return jsonify({"message": "All notifications marked as read"}), 200

@notifications_bp.route('/audit', methods=['POST'])
@jwt_required()
def run_system_audit():
    # 🔍 Find all products below threshold
    critical_products = Product.query.all()
    to_alert = []
    
    for p in critical_products:
        threshold = max(int(p.total * 0.1), 5)
        if p.current <= threshold:
            to_alert.append(p.name)
            
    if to_alert:
        # Create a summary notification
        count = len(to_alert)
        msg = f"System Check: {count} items require urgent replenishment ({', '.join(to_alert[:3])}{'...' if count > 3 else ''})"
        
        # Check if a summary was sent in the last hour to prevent spam
        from datetime import datetime, timedelta
        hour_ago = datetime.utcnow() - timedelta(hours=1)
        existing = Notification.query.filter(
            Notification.title == "Critical Stock Alert",
            Notification.timestamp > hour_ago
        ).first()
        
        if not existing:
            new_notif = Notification(
                title="Critical Stock Alert",
                message=msg,
                type="critical"
            )
            db.session.add(new_notif)
            db.session.commit()
            return jsonify({"message": "Audit complete, notification generated"}), 201
            
    return jsonify({"message": "Audit complete, no new alerts needed"}), 200
