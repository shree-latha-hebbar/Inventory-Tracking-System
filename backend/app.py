from flask import Flask, jsonify
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from config import Config
from models.db import db, ma, bcrypt

def create_app(config_class=Config):
    app = Flask(__name__)
    app.config.from_object(config_class)

    # Initialize extensions
    CORS(app)
    db.init_app(app)
    ma.init_app(app)
    bcrypt.init_app(app)
    JWTManager(app)

    # Register blueprints
    from routes.auth import auth_bp
    from routes.products import products_bp
    from routes.orders import orders_bp
    from routes.transactions import transactions_bp
    from routes.reports import reports_bp
    from routes.users import users_bp
    
    app.register_blueprint(auth_bp, url_prefix='/api/auth')
    app.register_blueprint(products_bp, url_prefix='/api/products')
    app.register_blueprint(orders_bp, url_prefix='/api/orders')
    app.register_blueprint(transactions_bp, url_prefix='/api/transactions')
    app.register_blueprint(reports_bp, url_prefix='/api/reports')
    app.register_blueprint(users_bp, url_prefix='/api/users')

    @app.route('/', methods=['GET'])
    def home():
        return jsonify({
            "status": "active",
            "message": "InvenTrack Backend API is running.",
            "api_endpoints": {
                "health": "/api/health",
                "auth": "/api/auth",
                "products": "/api/products",
                "orders": "/api/orders",
                "transactions": "/api/transactions",
                "reports": "/api/reports"
            }
        }), 200

    @app.route('/api/health', methods=['GET'])
    def health_check():
        return jsonify({"status": "healthy", "message": "Backend is running"}), 200

    with app.app_context():
        db.create_all()

    return app

if __name__ == '__main__':
    app = create_app()
    app.run(debug=True, port=5000)
