from flask import Blueprint, jsonify
from sqlalchemy import func
from models.db import db
from models.product_model import Product
from models.transaction_model import Transaction
from flask_jwt_extended import jwt_required
from datetime import datetime, timedelta

reports_bp = Blueprint('reports', __name__)

def parse_price(price_str):
    """Helper to convert '$2,400' to 2400.0"""
    try:
        if not price_str: return 0.0
        return float(str(price_str).replace('$', '').replace(',', '').strip())
    except Exception as e:
        print(f"Error parsing price '{price_str}': {e}")
        return 0.0

@reports_bp.route('/summary', methods=['GET'])
@jwt_required()
def get_summary():
    products = Product.query.all()
    
    total_assets = len(products)
    total_value = sum(p.current * parse_price(p.price) for p in products)
    critical_stock = len([p for p in products if p.current <= 5])
    
    # Calculate movement flow (count of transactions in last 7 days)
    seven_days_ago = datetime.utcnow() - timedelta(days=7)
    recent_txns = Transaction.query.filter(Transaction.timestamp >= seven_days_ago).count()
    
    return jsonify({
        "total_assets": total_assets,
        "total_value": total_value,
        "critical_stock": critical_stock,
        "movement_flow": recent_txns,
        "system_health": 99.8
    }), 200

@reports_bp.route('/velocity', methods=['GET'])
@jwt_required()
def get_velocity():
    # Top products by transaction count in the last 30 days
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    velocity_data = db.session.query(
        Transaction.product_id, 
        func.count(Transaction.id).label('txn_count')
    ).filter(Transaction.timestamp >= thirty_days_ago)\
     .group_by(Transaction.product_id)\
     .order_by(func.count(Transaction.id).desc())\
     .limit(5).all()
     
    results = []
    for pid, count in velocity_data:
        product = Product.query.get(pid)
        if product:
            results.append({
                "name": product.name,
                "val": f"{count} Movements"
            })
            
    return jsonify(results), 200

@reports_bp.route('/critical-list', methods=['GET'])
@jwt_required()
def get_critical_list():
    # Fetch top 5 critical items
    critical_products = Product.query.filter(Product.current <= 5).order_by(Product.current.asc()).limit(5).all()
    results = []
    for p in critical_products:
        results.append({
            "name": p.name,
            "val": f"{p.current} Units",
            "color": "#ef4444" if p.current <= 2 else "#f59e0b"
        })
    return jsonify(results), 200
