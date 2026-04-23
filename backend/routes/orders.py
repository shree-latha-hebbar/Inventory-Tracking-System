from flask import Blueprint, jsonify, request
from datetime import datetime
from models.db import db
from models.order_model import Order, orders_schema, order_schema
from flask_jwt_extended import jwt_required

orders_bp = Blueprint('orders', __name__)

@orders_bp.route('/', methods=['GET'])
@jwt_required()
def get_orders():
    orders = Order.query.all()
    return jsonify(orders_schema.dump(orders)), 200

@orders_bp.route('/', methods=['POST'])
@jwt_required()
def create_order():
    data = request.get_json()
    
    # Auto-generate Order ID if not provided
    order_id = data.get('order_id')
    if not order_id:
        import random
        import string
        suffix = ''.join(random.choices(string.digits, k=4))
        order_id = f"PO-{suffix}"
    
    # Check if order_id already exists
    if Order.query.filter_by(order_id=order_id).first():
        return jsonify({"message": f"Order ID {order_id} already exists"}), 400

    new_order = Order(
        order_id=order_id,
        product_id=data.get('product_id'),
        supplier=data.get('supplier'),
        date=data.get('date'),
        quantity=data.get('quantity', 1),
        value=data.get('value'),
        status=data.get('status', 'Pending')
    )
    db.session.add(new_order)
    db.session.commit()
    return jsonify({"message": "Order created successfully"}), 201

@orders_bp.route('/<string:order_id>', methods=['GET'])
@jwt_required()
def get_order(order_id):
    order = Order.query.filter_by(order_id=order_id).first()
    if not order:
        return jsonify({"message": "Order not found"}), 404
    return jsonify(order_schema.dump(order)), 200

@orders_bp.route('/<string:order_id>', methods=['PUT'])
@jwt_required()
def update_order(order_id):
    order = Order.query.filter_by(order_id=order_id).first()
    if not order:
        return jsonify({"message": "Order not found"}), 404
        
    data = request.get_json()
    new_status = data.get('status', order.status)
    
    # Integration Logic: If order is being marked as 'Received', update stock and log transaction
    if new_status == 'Received' and order.status != 'Received':
        from models.product_model import Product
        from models.transaction_model import Transaction
        from flask_jwt_extended import get_jwt_identity
        
        product = Product.query.filter_by(product_id=order.product_id).first()
        if product:
            # Increment product stock
            product.current += order.quantity
            
            # Log the transaction
            new_txn = Transaction(
                product_id=product.id,
                user_id=get_jwt_identity(),
                quantity=order.quantity,
                transaction_type='RESTOCK',
                notes=f"Received Order: {order.order_id}"
            )
            db.session.add(new_txn)
            print(f"Stock updated for {product.name}. Added {order.quantity} units.")
        else:
            print(f"Warning: Product {order.product_id} not found. Stock update skipped.")

    order.supplier = data.get('supplier', order.supplier)
    order.date = data.get('date', order.date)
    order.quantity = data.get('quantity', order.quantity)
    order.value = data.get('value', order.value)
    order.status = new_status
    
    db.session.commit()
    return jsonify(order_schema.dump(order)), 200

@orders_bp.route('/<string:order_id>', methods=['DELETE'])
@jwt_required()
def delete_order(order_id):
    order = Order.query.filter_by(order_id=order_id).first()
    if not order:
        return jsonify({"message": "Order not found"}), 404
        
    db.session.delete(order)
    db.session.commit()
    return jsonify({"message": "Order deleted"}), 200
