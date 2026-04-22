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

class TransactionSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Transaction
        load_instance = True
        include_fk = True

transaction_schema = TransactionSchema()
transactions_schema = TransactionSchema(many=True)
