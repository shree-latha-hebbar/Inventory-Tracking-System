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

class OrderSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Order
        load_instance = True
    
    # 🚀 Dynamically include product name in the API response
    product_name = ma.Method("get_product_name")

    def get_product_name(self, obj):
        from models.product_model import Product
        if obj.product_id:
            # Check if product_id is numeric or the string UID
            try:
                # Try numeric lookup first
                product = Product.query.get(int(obj.product_id))
                if product: return product.name
            except:
                pass
            
            # Fallback to string product_id lookup
            product = Product.query.filter_by(product_id=obj.product_id).first()
            if product: return product.name
            
        return "Unknown Product"

order_schema = OrderSchema()
orders_schema = OrderSchema(many=True)
