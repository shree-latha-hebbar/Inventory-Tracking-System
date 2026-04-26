from flask import Blueprint, request, jsonify
from models.db import db
from models.product_model import Product, product_schema, products_schema
from models.transaction_model import Transaction
from flask_jwt_extended import jwt_required, get_jwt_identity

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    include_deleted = request.args.get('include_deleted', 'false').lower() == 'true'
    
    if include_deleted:
        products = Product.query.all()
    else:
        products = Product.query.filter_by(is_deleted=False).all()
        
    return jsonify(products_schema.dump(products)), 200

@products_bp.route('/archived', methods=['GET'])
@jwt_required()
def get_archived_products():
    """Returns only soft-deleted products"""
    products = Product.query.filter_by(is_deleted=True).all()
    return jsonify(products_schema.dump(products)), 200

@products_bp.route('/<string:product_id>', methods=['GET'])
@jwt_required()
def get_product(product_id):
    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({"message": "Product not found"}), 404
    return jsonify(product_schema.dump(product)), 200

@products_bp.route('/', methods=['POST'])
@jwt_required()
def add_product():
    data = request.get_json()
    
    # Simple validation
    if not data.get('name') or not data.get('category'):
        return jsonify({"message": "Missing required fields"}), 400

    new_product = Product(
        product_id=data.get('product_id'),
        name=data.get('name'),
        category=data.get('category'),
        price=data.get('price'),
        total=data.get('total', 0),
        current=data.get('current', 0),
        is_deleted=False
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify(product_schema.dump(new_product)), 201

@products_bp.route('/<string:product_id>', methods=['PUT'])
@jwt_required()
def update_product(product_id):
    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({"message": "Product not found"}), 404
        
    data = request.get_json()
    
    product.name = data.get('name', product.name)
    product.category = data.get('category', product.category)
    product.price = data.get('price', product.price)
    product.total = data.get('total', product.total)
    product.current = data.get('current', product.current)
    
    db.session.commit()
    return jsonify(product_schema.dump(product)), 200

@products_bp.route('/<string:product_id>/restore', methods=['POST'])
@jwt_required()
def restore_product(product_id):
    """Admin/Manager route to bring back a temporarily deleted item"""
    current_user_id = get_jwt_identity()
    from models.user_model import User
    requester = User.query.get(current_user_id)
    
    if not requester or requester.role.lower() not in ['admin', 'manager']:
        return jsonify({"message": "Access denied. Restoration requires Manager or Admin privileges."}), 403

    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({"message": "Asset blueprint not found"}), 404
    
    # Log restoration
    user_id = get_jwt_identity()
    restore_txn = Transaction(
        product_id=product.id,
        user_id=user_id,
        quantity=product.current, # Re-adding the stock back to active reporting
        transaction_type='RESTORE',
        notes=f"Asset restored from Archive."
    )
    db.session.add(restore_txn)
    
    product.is_deleted = False
    product.disposal_reason = None
    db.session.commit()
    return jsonify({"message": f"Asset '{product.name}' has been restored to active inventory"}), 200

@products_bp.route('/<string:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    current_user_id = get_jwt_identity()
    from models.user_model import User
    requester = User.query.get(current_user_id)
    
    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({"message": "Product not found"}), 404
        
    mode = request.args.get('mode', 'temporary') # 'temporary' or 'permanent'
    data = request.get_json() or {}
    reason = data.get('reason', 'Not Specified')
    
    if mode == 'permanent':
        # ONLY Admins can permanently purge assets
        if not requester or requester.role.lower() != 'admin':
            return jsonify({"message": "Access denied. Permanent deletion requires Admin privileges."}), 403
            
        db.session.delete(product)
        db.session.commit()
        return jsonify({"message": f"Asset '{product.name}' has been permanently purged from system"}), 200
    else:
        # Managers and Admins can archive/restore
        if not requester or requester.role.lower() not in ['admin', 'manager']:
            return jsonify({"message": "Access denied. Archiving requires Manager or Admin privileges."}), 403
            
        # Log this disposal as a transaction for financial reporting
        disposal_txn = Transaction(
            product_id=product.id,
            user_id=current_user_id,
            quantity=-product.current, # Removing all current stock
            transaction_type='DISPOSAL',
            notes=f"Asset decommissioned. Reason: {reason}"
        )
        db.session.add(disposal_txn)

        product.is_deleted = True
        product.disposal_reason = reason
        db.session.commit()
        return jsonify({"message": f"Asset '{product.name}' has been moved to Archive (Reason: {reason})"}), 200
