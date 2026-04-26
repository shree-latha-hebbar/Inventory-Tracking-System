from flask import Blueprint, request, jsonify
from models.db import db
from models.user_model import User, user_schema
from flask_jwt_extended import create_access_token, jwt_required, get_jwt_identity
from datetime import datetime, timedelta
import secrets
import re

auth_bp = Blueprint('auth', __name__)

def is_valid_email(email):
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None

@auth_bp.route('/register', methods=['POST'])
@jwt_required()
def register():
    # ONLY Admins can register new users
    current_user_id = get_jwt_identity()
    requester = User.query.get(current_user_id)
    
    if not requester or requester.role.lower() != 'admin':
        return jsonify({"message": "Access denied. Only Admins can create new user accounts."}), 403

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
    # Accept either username or email as the identifier
    identifier = data.get('username') or data.get('email')
    user = User.query.filter((User.username == identifier) | (User.email == identifier)).first()

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

@auth_bp.route('/forgot-password', methods=['POST'])
def forgot_password():
    """
    Accepts email or username, generates a secure reset token,
    stores it with expiry (1 hour), and sends a reset email.
    """
    data = request.get_json()
    identifier = data.get('email') or data.get('username')

    if not identifier:
        return jsonify({"message": "Email or username is required"}), 400

    user = User.query.filter(
        (User.username == identifier) | (User.email == identifier)
    ).first()

    # Always return success to prevent user enumeration attacks
    if not user:
        return jsonify({"message": "If that account exists, a reset link has been sent."}), 200

    # Generate a cryptographically secure token
    reset_token = secrets.token_urlsafe(32)
    reset_expiry = datetime.utcnow() + timedelta(hours=1)

    user.reset_token = reset_token
    user.reset_token_expiry = reset_expiry
    db.session.commit()

    # Send reset email via the email service
    from utils.email_service import send_password_reset_email
    try:
        send_password_reset_email(user, reset_token)
        return jsonify({"message": "If that account exists, a reset link has been sent."}), 200
    except Exception as e:
        print(f"Failed to send password reset email: {e}")
        # Still return success so an attacker can't tell the email failed
        return jsonify({"message": "If that account exists, a reset link has been sent."}), 200

@auth_bp.route('/reset-password', methods=['POST'])
def reset_password():
    """
    Validates the reset token and updates the user's password.
    Token is single-use and expires after 1 hour.
    """
    data = request.get_json()
    token = data.get('token')
    new_password = data.get('new_password')

    if not token or not new_password:
        return jsonify({"message": "Token and new password are required"}), 400

    if len(new_password) < 6:
        return jsonify({"message": "Password must be at least 6 characters"}), 400

    user = User.query.filter_by(reset_token=token).first()

    if not user:
        return jsonify({"message": "Invalid or expired reset token"}), 400

    if user.reset_token_expiry < datetime.utcnow():
        # Clear expired token
        user.reset_token = None
        user.reset_token_expiry = None
        db.session.commit()
        return jsonify({"message": "Reset token has expired. Please request a new one."}), 400

    # Token is valid — update password
    user.set_password(new_password)
    user.reset_token = None  # Single-use
    user.reset_token_expiry = None
    db.session.commit()

    return jsonify({"message": "Your password has been reset successfully. Please log in."}), 200
