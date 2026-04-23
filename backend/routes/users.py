from flask import Blueprint, jsonify
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
            "status": "Active" # We could add a 'last_seen' field later
        })
    
    return jsonify(user_list), 200
