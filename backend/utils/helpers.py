from flask import jsonify
import uuid
import re

def success_response(data, message="Success", status_code=200):
    """
    Standardized success response format.
    """
    return jsonify({
        "status": "success",
        "message": message,
        "data": data
    }), status_code

def error_response(message="An error occurred", status_code=400):
    """
    Standardized error response format.
    """
    return jsonify({
        "status": "error",
        "message": message
    }), status_code

def format_currency(amount):
    """
    Formats a numeric amount into a currency string (e.g., 2400 -> "$2,400").
    """
    try:
        return "${:,.0f}".format(float(amount))
    except (ValueError, TypeError):
        return "$0"

def generate_product_id():
    """
    Generates a unique product ID string (e.g., PRD-XXXX).
    """
    return f"PRD-{uuid.uuid4().hex[:6].upper()}"

def validate_email(email):
    """
    Simple regex to validate email format.
    """
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return re.match(pattern, email) is not None
