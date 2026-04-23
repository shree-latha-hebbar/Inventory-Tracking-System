from flask import Blueprint, jsonify, request
from models.db import db
from models.transaction_model import Transaction, transactions_schema, transaction_schema
from models.product_model import Product
from utils.alerts import process_transaction_alerts
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
    user_id = get_jwt_identity()
    
    product_id_input = data.get('product_id')
    raw_quantity = data.get('quantity')
    txn_type = data.get('transaction_type', '').upper()
    
    if not all([product_id_input, raw_quantity, txn_type]):
        return jsonify({"message": "Missing required fields"}), 400
        
    # Find product by numeric ID or string SKU
    product = None
    if isinstance(product_id_input, int) or (isinstance(product_id_input, str) and product_id_input.isdigit()):
        product = Product.query.get(int(product_id_input))
    
    if not product:
        product = Product.query.filter_by(product_id=str(product_id_input)).first()

    if not product:
        return jsonify({"message": "Product not found"}), 404
        
    # Enforce quantity sign based on transaction type
    # 'IN', 'RESTOCK', 'RETURN' -> Positive
    # 'OUT', 'SALE', 'ADJUSTMENT' (if negative) -> Negative
    
    quantity = abs(int(raw_quantity))
    if txn_type in ['OUT', 'SALE']:
        quantity = -quantity
    elif txn_type == 'ADJUSTMENT':
        # For adjustments, we respect the sign sent if provided, otherwise assume negative if not specified
        quantity = int(raw_quantity)
    
    # Update current stock
    product.current += quantity
    
    new_txn = Transaction(
        product_id=product.id,
        user_id=user_id,
        quantity=quantity,
        transaction_type=txn_type,
        notes=data.get('notes')
    )
    
    db.session.add(new_txn)
    db.session.commit()
    
    # Check for low stock after transaction
    process_transaction_alerts(product)
    
    return jsonify({
        "message": "Transaction logged and stock updated",
        "transaction": transaction_schema.dump(new_txn)
    }), 201
