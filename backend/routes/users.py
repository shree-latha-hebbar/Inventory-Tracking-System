from flask import Blueprint, jsonify, request
from models.db import db
from models.user_model import User
from flask_jwt_extended import jwt_required, get_jwt_identity

users_bp = Blueprint('users', __name__)

@users_bp.route('/', methods=['GET'])
@jwt_required()
def get_all_users():
    # Only Managers and Admins can see the user list
    current_user_id = get_jwt_identity()
    requester = User.query.get(current_user_id)
    
    if not requester or requester.role.lower() not in ['admin', 'manager']:
        return jsonify({"message": "Access denied. Management only."}), 403
    
    users = User.query.all()
    user_list = []
    for u in users:
        user_list.append({
            "id": u.id,
            "username": u.username,
            "email": u.email,
            "role": u.role,
            "status": "Active" # Defaulting to Active for now
        })
    
    return jsonify(user_list), 200

@users_bp.route('/<int:user_id>', methods=['PUT'])
@jwt_required()
def update_user_role(user_id):
    """Admin only: Grant or revoke access/change role"""
    current_user_id = get_jwt_identity()
    requester = User.query.get(current_user_id)
    
    if not requester or requester.role.lower() != 'admin':
        return jsonify({"message": "Access denied. Admins only."}), 403
        
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    data = request.get_json()
    new_role = data.get('role')
    
    if new_role:
        if new_role not in ['Admin', 'Manager', 'Staff']:
            return jsonify({"message": "Invalid role specified"}), 400
        user.role = new_role
        
    db.session.commit()
    return jsonify({"message": f"User {user.username} role updated to {user.role}"}), 200

@users_bp.route('/<int:user_id>', methods=['DELETE'])
@jwt_required()
def delete_user(user_id):
    """Admin only: Remove an employee/revoke all access"""
    current_user_id = get_jwt_identity()
    requester = User.query.get(current_user_id)
    
    if not requester or requester.role.lower() != 'admin':
        return jsonify({"message": "Access denied. Admins only."}), 403
        
    user = User.query.get(user_id)
    if not user:
        return jsonify({"message": "User not found"}), 404
        
    # Prevent self-deletion
    if int(current_user_id) == user_id:
        return jsonify({"message": "Cannot delete your own admin account"}), 400
        
    db.session.delete(user)
    db.session.commit()
    return jsonify({"message": f"User {user.username} has been removed from the system"}), 200
