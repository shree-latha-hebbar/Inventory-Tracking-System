from models.db import db, ma
from datetime import datetime

class Notification(db.Model):
    __tablename__ = 'notifications'
    
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=True) # Null for global/admin alerts
    title = db.Column(db.String(100), nullable=False)
    message = db.Column(db.String(255), nullable=False)
    type = db.Column(db.String(50), default='info') # 'info', 'warning', 'critical', 'success'
    is_read = db.Column(db.Boolean, default=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, title, message, type='info', user_id=None):
        self.title = title
        self.message = message
        self.type = type
        self.user_id = user_id

class NotificationSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Notification
        load_instance = True

notification_schema = NotificationSchema()
notifications_schema = NotificationSchema(many=True)
