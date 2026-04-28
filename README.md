# 📦 InvenTrack — Inventory Tracking System

A full-stack web application for real-time inventory management. InvenTrack helps businesses track stock levels, manage products, monitor transactions, generate reports, and receive automated low-stock alerts — all through a clean, role-based dashboard.

---

## ✨ Features

- **🔐 Role-Based Access Control** — Three roles: Admin, Manager, and Staff, each with different permissions for viewing, editing, and deleting inventory data
- **📊 Live Dashboard** — Real-time summary of total assets, inventory value, critical stock items, and 7-day movement flow
- **🛒 Product Management** — Add, edit, archive, and restore products with full audit trail via transactions
- **📦 Order Management** — Auto-generates pending purchase orders when stock falls below threshold
- **🔔 Smart Stock Alerts** — Automatically triggers in-app notifications and sends email alerts when stock is critically low (≤10% of capacity or ≤5 units)
- **📈 Reports & Analytics** — Sales trends, stock velocity, category distribution charts, and critical stock lists
- **🔄 Transaction Logging** — Every stock change (sale, adjustment, disposal, restore) is logged with user and timestamp
- **🔑 Secure Auth** — JWT-based authentication with bcrypt password hashing, forgot/reset password via email
- **🗃️ Soft Delete / Archive** — Products can be archived (Managers) or permanently deleted (Admins only)

---

## 🛠️ Tech Stack

### Frontend
![React](https://img.shields.io/badge/React_19-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
![React Router](https://img.shields.io/badge/React_Router-CA4245?style=for-the-badge&logo=react-router&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)

### Backend
![Flask](https://img.shields.io/badge/Flask-000000?style=for-the-badge&logo=flask&logoColor=white)
![SQLite](https://img.shields.io/badge/SQLite-07405E?style=for-the-badge&logo=sqlite&logoColor=white)
![JWT](https://img.shields.io/badge/JWT-black?style=for-the-badge&logo=JSON%20web%20tokens)
![Python](https://img.shields.io/badge/Python_3.13-3776AB?style=for-the-badge&logo=python&logoColor=white)

---

## 📁 Project Structure

```
Inventory-Tracking-System/
├── backend/
│   ├── app.py                  # Flask app factory
│   ├── config.py               # Configuration (JWT, DB, email)
│   ├── requirements.txt
│   ├── models/
│   │   ├── user_model.py       # User with role & reset token
│   │   ├── product_model.py    # Product with soft delete
│   │   ├── order_model.py      # Purchase orders
│   │   ├── transaction_model.py
│   │   └── notification_model.py
│   ├── routes/
│   │   ├── auth.py             # Login, register, password reset
│   │   ├── products.py         # CRUD + archive/restore
│   │   ├── orders.py
│   │   ├── transactions.py
│   │   ├── reports.py          # Analytics endpoints
│   │   ├── suppliers.py
│   │   ├── users.py
│   │   └── notifications.py
│   └── utils/
│       ├── alerts.py           # Stock threshold + auto-order logic
│       └── email_service.py    # Email alerts & password reset emails
│
└── frontend/
    ├── public/
    └── src/
        ├── App.js              # Route definitions
        ├── components/         # Navbar, Sidebar, Footer, Toast
        └── pages/              # Dashboard, Products, Orders,
                                # Transactions, Reports, Login, etc.
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Python 3.10+
- Node.js 18+
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/shree-latha-hebbar/Inventory-Tracking-System.git
cd Inventory-Tracking-System
```

---

### 2. Backend Setup

```bash
cd backend
pip install -r requirements.txt
```

Create a `.env` file in the `backend/` directory:

```env
SECRET_KEY=your_secret_key
JWT_SECRET_KEY=your_jwt_secret
MAIL_USERNAME=your_email@gmail.com
MAIL_PASSWORD=your_app_password
```

Run the Flask server:

```bash
python app.py
```

The API will be available at `http://localhost:5001`

---

### 3. Frontend Setup

```bash
cd frontend
npm install
npm start
```

The app will open at `http://localhost:3000`

---

## 🔐 Default Roles & Permissions

| Action                    | Staff | Manager | Admin |
|---------------------------|:-----:|:-------:|:-----:|
| View products & dashboard | ✅    | ✅      | ✅    |
| Add / Edit products       | ✅    | ✅      | ✅    |
| Archive products          | ❌    | ✅      | ✅    |
| Restore archived products | ❌    | ✅      | ✅    |
| Permanently delete        | ❌    | ❌      | ✅    |
| Create new user accounts  | ❌    | ❌      | ✅    |

> **Note:** Only Admins can register new users. New accounts must be created by an existing Admin through the application.

---

## 🔌 API Overview

| Method | Endpoint                        | Description                        |
|--------|---------------------------------|------------------------------------|
| POST   | `/api/auth/login`               | Login with username or email       |
| POST   | `/api/auth/forgot-password`     | Send password reset email          |
| POST   | `/api/auth/reset-password`      | Reset password via token           |
| GET    | `/api/products/`                | List all active products           |
| POST   | `/api/products/`                | Add a new product                  |
| DELETE | `/api/products/:id?mode=temporary` | Archive a product               |
| DELETE | `/api/products/:id?mode=permanent` | Permanently delete (Admin only) |
| POST   | `/api/products/:id/restore`     | Restore archived product           |
| GET    | `/api/reports/summary`          | Dashboard KPIs                     |
| GET    | `/api/reports/sales-trend`      | 7-day movement trend               |
| GET    | `/api/reports/critical-list`    | Products with critically low stock |

All protected routes require a `Bearer <token>` in the `Authorization` header.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).