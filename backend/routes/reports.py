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
        # More robust parsing
        clean_price = str(price_str).replace('$', '').replace(',', '').strip()
        return float(clean_price)
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
    
    # Dynamic health calculation: 100% minus percentage of products out of stock or critical
    system_health = 100.0
    if total_assets > 0:
        out_of_stock = len([p for p in products if p.current == 0])
        health_deduction = (out_of_stock * 5) + (critical_stock * 2) # Arbitrary deduction logic
        system_health = max(0, 100.0 - (health_deduction / total_assets * 10))
    
    return jsonify({
        "total_assets": total_assets,
        "total_value": round(total_value, 2),
        "critical_stock": critical_stock,
        "movement_flow": recent_txns,
        "system_health": round(system_health, 1)
    }), 200

@reports_bp.route('/velocity', methods=['GET'])
@jwt_required()
def get_velocity():
    # Optimize: Use a JOIN to fetch product names alongside transaction counts in one query
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    
    velocity_query = db.session.query(
        Product.name, 
        func.count(Transaction.id).label('txn_count')
    ).join(Transaction, Product.id == Transaction.product_id)\
     .filter(Transaction.timestamp >= thirty_days_ago)\
     .group_by(Product.id)\
     .order_by(func.count(Transaction.id).desc())\
     .limit(5).all()
     
    results = [
        {
            "name": name,
            "val": f"{count} Movements"
        } for name, count in velocity_query
    ]
            
    return jsonify(results), 200

@reports_bp.route('/critical-list', methods=['GET'])
@jwt_required()
def get_critical_list():
    # Fetch top 5 critical items
    # Using explicit comparison to help Pylance/Linter
    critical_products = Product.query.filter(Product.current <= 5).order_by(Product.current.asc()).limit(5).all()
    results = []
    for p in critical_products:
        results.append({
            "id": p.id,
            "product_id": p.product_id,
            "name": p.name,
            "val": f"{p.current} Units",
            "color": "#ef4444" if p.current <= 2 else "#f59e0b"
        })
    return jsonify(results), 200

@reports_bp.route('/valuation-history', methods=['GET'])
@jwt_required()
def get_valuation_history():
    # Reconstruct inventory value for the last 30 days
    # Value = Current_Value - sum(Transactions since that day)
    
    products = Product.query.all()
    current_value = sum(p.current * parse_price(p.price) for p in products)
    
    # Get all transactions in last 30 days, sorted by timestamp desc
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    transactions = Transaction.query.filter(Transaction.timestamp >= thirty_days_ago)\
                                    .order_by(Transaction.timestamp.desc()).all()
    
    # We'll build the history backwards
    history = []
    temp_value = current_value
    
    # Group transactions by day
    txns_by_day = {}
    for txn in transactions:
        day_str = txn.timestamp.strftime('%Y-%m-%d')
        if day_str not in txns_by_day:
            txns_by_day[day_str] = 0
        
        # Calculate value impact: quantity * product_price
        # Since we are going backwards, if a transaction ADDED stock (+qty), we SUBTRACT it from current value
        # to get previous value. If it REMOVED stock (-qty), we ADD it back.
        # This is handled by simply subtracting (qty * price)
        prod_price = parse_price(txn.product.price)
        txns_by_day[day_str] += (txn.quantity * prod_price)

    # Generate last 30 days
    for i in range(30):
        date = datetime.utcnow() - timedelta(days=i)
        date_str = date.strftime('%Y-%m-%d')
        
        # Add to history
        history.append({
            "date": date_str,
            "value": round(temp_value, 2)
        })
        
        # Move back to previous day's value
        if date_str in txns_by_day:
            temp_value -= txns_by_day[date_str]
            
    return jsonify(history[::-1]), 200 # Return in chronological order

@reports_bp.route('/category-distribution', methods=['GET'])
@jwt_required()
def get_category_distribution():
    # Get total count of products per category
    data = db.session.query(
        Product.category,
        func.count(Product.id)
    ).group_by(Product.category).all()
    
    colors = ["#1e3a8a", "#3b82f6", "#f59e0b", "#10b981", "#6366f1", "#8b5cf6"]
    results = []
    for i, (category, count) in enumerate(data):
        results.append({
            "name": category,
            "val": count,
            "color": colors[i % len(colors)]
        })
    return jsonify(results), 200
