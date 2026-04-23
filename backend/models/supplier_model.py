from models.db import db, ma

class Supplier(db.Model):
    __tablename__ = 'suppliers'
    
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    category = db.Column(db.String(100), nullable=False) # e.g., 'Hardware', 'Furniture'
    contact_email = db.Column(db.String(120), nullable=False)
    lead_time = db.Column(db.String(50), nullable=True) # e.g., '12 Days'
    performance_rating = db.Column(db.Float, default=5.0)

    def __init__(self, name, category, contact_email, lead_time=None, performance_rating=5.0):
        self.name = name
        self.category = category
        self.contact_email = contact_email
        self.lead_time = lead_time
        self.performance_rating = performance_rating

class SupplierSchema(ma.SQLAlchemyAutoSchema):
    class Meta:
        model = Supplier
        load_instance = True

supplier_schema = SupplierSchema()
suppliers_schema = SupplierSchema(many=True)
