from flask import Blueprint, request, jsonify
from models.db import db
from models.supplier_model import Supplier, suppliers_schema, supplier_schema
from flask_jwt_extended import jwt_required

suppliers_bp = Blueprint('suppliers', __name__)

@suppliers_bp.route('/', methods=['GET'])
@jwt_required()
def get_suppliers():
    all_suppliers = Supplier.query.all()
    return jsonify(suppliers_schema.dump(all_suppliers)), 200

@suppliers_bp.route('/', methods=['POST'])
@jwt_required()
def add_supplier():
    data = request.get_json()
    try:
        new_supplier = Supplier(
            name=data['name'],
            category=data['category'],
            contact_email=data['contact_email'],
            lead_time=data.get('lead_time', '7 Days'),
            performance_rating=data.get('performance_rating', 5.0)
        )
        db.session.add(new_supplier)
        db.session.commit()
        return supplier_schema.jsonify(new_supplier), 201
    except Exception as e:
        return jsonify({"message": str(e)}), 400

@suppliers_bp.route('/<int:id>', methods=['DELETE'])
@jwt_required()
def delete_supplier(id):
    supplier = Supplier.query.get(id)
    if not supplier:
        return jsonify({"message": "Supplier not found"}), 404
    db.session.delete(supplier)
    db.session.commit()
    return jsonify({"message": "Supplier deleted"}), 200
