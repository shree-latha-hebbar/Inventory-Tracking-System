from flask import Blueprint, request, jsonify
from models.db import db
from models.user_model import User, user_schema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity

auth_bp = Blueprint('auth', __name__)

@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(username=data.get('username')).first() or \
       User.query.filter_by(email=data.get('email')).first():
        return jsonify({"message": "User already exists"}), 400

    new_user = User(
        username=data.get('username'),
        email=data.get('email'),
        role=data.get('role', 'Staff')
    )
    new_user.set_password(data.get('password'))

    db.session.add(new_user)
    db.session.commit()

    return jsonify({"message": "User registered successfully"}), 201

@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    user = User.query.filter_by(username=data.get('username')).first()

    if user and user.check_password(data.get('password')):
        access_token = create_access_token(identity=str(user.id))
        return jsonify({
            "access_token": access_token,
            "user": user_schema.dump(user)
        }), 200

    return jsonify({"message": "Invalid credentials"}), 401

@auth_bp.route('/me', methods=['GET'])
@jwt_required()
def get_me():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    return jsonify(user_schema.dump(user)), 200
