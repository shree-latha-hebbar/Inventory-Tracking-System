from flask import Blueprint, request, jsonify
from models.db import db
from models.product_model import Product, product_schema, products_schema
from flask_jwt_extended import jwt_required

products_bp = Blueprint('products', __name__)

@products_bp.route('/', methods=['GET'])
@jwt_required()
def get_products():
    products = Product.query.all()
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
        current=data.get('current', 0)
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

@products_bp.route('/<string:product_id>', methods=['DELETE'])
@jwt_required()
def delete_product(product_id):
    product = Product.query.filter_by(product_id=product_id).first()
    if not product:
        return jsonify({"message": "Product not found"}), 404
        
    db.session.delete(product)
    db.session.commit()
    return jsonify({"message": "Product deleted"}), 200
