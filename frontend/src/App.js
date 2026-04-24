import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";

// Ensure these paths match your folder structure exactly [cite: 32-35]
import Home from "./pages/Home";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Products from "./pages/Products";
import AddProduct from "./pages/AddProduct";
import EditProduct from "./pages/EditProduct";
import AboutUs from "./pages/AboutUs";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Orders from "./pages/Orders";
import Contact from "./pages/Contact";

function App() {
    return (
        <div className="min-h-screen bg-slate-50">
            <Routes>
                {/* Public Routes */}
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/about" element={<AboutUs />} />

                {/* Dashboard and Products */}
                <Route path="/dashboard" element={<Dashboard />} />
                <Route path="/products" element={<Products />} />
                <Route path="/transactions" element={<Transactions />} />
                <Route path="/reports" element={<Reports />} />
                <Route path="/orders" element={<Orders />} />
                <Route path="/add-product" element={<AddProduct />} />
                <Route path="/edit-product/:id" element={<EditProduct />} />
                <Route path="/contact" element={<Contact />} />
                {/* Redirect unknown routes to Home */}
                <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
        </div>
    );
}

export default App;