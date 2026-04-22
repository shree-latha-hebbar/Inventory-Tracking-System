from flask import Blueprint, jsonify, request
from models.db import db
from models.transaction_model import Transaction, transactions_schema, transaction_schema
from models.product_model import Product
from flask_jwt_extended import jwt_required, get_jwt_identity

transactions_bp = Blueprint('transactions', __name__)

@transactions_bp.route('/', methods=['GET'])
@jwt_required()
def get_transactions():
    transactions = Transaction.query.order_by(Transaction.timestamp.desc()).all()
    return jsonify(transactions_schema.dump(transactions)), 200

@transactions_bp.route('/', methods=['POST'])
@jwt_required()
def create_transaction():
    data = request.get_json()
    user_id = get_jwt_identity() # Use the logged-in user's ID
    
    product_id = data.get('product_id')
    quantity = data.get('quantity')
    txn_type = data.get('transaction_type')
    
    if not all([product_id, quantity, txn_type]):
        return jsonify({"message": "Missing required fields"}), 400
        
    # Automatically update product stock
    product = Product.query.get(product_id)
    if not product:
        return jsonify({"message": "Product not found"}), 404
        
    # Update current stock
    product.current += quantity # Assumes quantity is already positive for IN and negative for OUT
    
    new_txn = Transaction(
        product_id=product_id,
        user_id=user_id,
        quantity=quantity,
        transaction_type=txn_type,
        notes=data.get('notes')
    )
    
    db.session.add(new_txn)
    db.session.commit()
    
    return jsonify({
        "message": "Transaction logged and stock updated",
        "transaction": transaction_schema.dump(new_txn)
    }), 201
