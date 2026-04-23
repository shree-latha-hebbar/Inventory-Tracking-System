from models.db import db, ma
from datetime import datetime

class Order(db.Model):
    __tablename__ = 'orders'
    
    id = db.Column(db.Integer, primary_key=True)
    order_id = db.Column(db.String(20), unique=True, nullable=False) # e.g. PO-8041
    product_id = db.Column(db.String(20), nullable=True) # ID of the product being ordered
    supplier = db.Column(db.String(100), nullable=False)
    date = db.Column(db.String(50), nullable=False)
    quantity = db.Column(db.Integer, default=1)
    value = db.Column(db.String(50), nullable=False)
    status = db.Column(db.String(20), default='Pending')
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    def __init__(self, order_id, product_id, supplier, date, quantity, value, status='Pending'):
        self.order_id = order_id
        self.product_id = product_id
        self.supplier = supplier
        self.date = date
        self.quantity = quantity
        self.value = value
        self.status = status

class OrderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        load_instance = True

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
