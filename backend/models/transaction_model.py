from models.db import db, ma
from datetime import datetime

class Transaction(db.Model):
    __tablename__ = 'transactions'
    
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('products.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    quantity = db.Column(db.Integer, nullable=False) # Positive for stock-in, negative for stock-out
    transaction_type = db.Column(db.String(50), nullable=False) # e.g., 'SALE', 'RESTOCK', 'ADJUSTMENT', 'RETURN'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    notes = db.Column(db.String(255), nullable=True)

    # Relationships
    product = db.relationship('Product', backref=db.backref('transactions', lazy=True))
    user = db.relationship('User', backref=db.backref('transactions', lazy=True))

    def __init__(self, product_id, user_id, quantity, transaction_type, notes=None):
        self.product_id = product_id
        self.user_id = user_id
        self.quantity = quantity
        self.transaction_type = transaction_type
        self.notes = notes

from marshmallow import fields

class TransactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Transaction
        load_instance = True
        include_fk = True
    
    product_name = fields.String(attribute="product.name", dump_only=True)
    user_name = fields.String(attribute="user.username", dump_only=True)

transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
