import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    color: "#0f172a",
    display: "flex",
  },
  main: {
    flex: 1,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    maxWidth: "calc(100vw - 280px)",
  },
  formContainer: {
    background: "#fff",
    padding: "40px",
    borderRadius: "28px",
    border: "1.5px solid #e2e8f0",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
    maxWidth: "600px",
    width: "100%",
    margin: "0 auto",
  },
  h2: {
    fontSize: "1.75rem",
    fontWeight: "950",
    marginBottom: "8px",
    letterSpacing: "-0.5px",
  },
  label: {
    display: "block",
    fontSize: "0.85rem",
    fontWeight: "800",
    color: "#94a3b8",
    textTransform: "uppercase",
    marginBottom: "8px",
  },
  input: {
    width: "100%",
    padding: "14px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#f8fafc",
    fontSize: "0.95rem",
    fontWeight: "600",
    outline: "none",
    marginBottom: "20px",
  },
  btnPrimary: {
    width: "100%",
    padding: "16px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "800",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.3)",
    transition: "all .3s",
  },
  error: {
    background: "#fef2f2",
    border: "1px solid #fee2e2",
    color: "#dc2626",
    padding: "16px",
    borderRadius: "12px",
    fontSize: "0.85rem",
    fontWeight: "700",
    marginBottom: "24px",
  },
  breadcrumb: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#94a3b8",
    marginBottom: "4px",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },
};

function AddProduct() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const role = (localStorage.getItem("role") || "Staff").toLowerCase();

  const [form, setForm] = useState({
    product_id: "",
    name: "",
    category: "",
    price: "",
    total: "",
    current: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMenuClick = (menu) => {
    if (menu === "Dashboard") navigate("/dashboard");
    if (menu === "Manage Products" || menu === "Product Search") navigate("/products");
    if (menu === "Stock Orders") navigate("/orders");
    if (menu === "Inventory Reports") navigate("/reports");
    if (menu === "Transaction History") navigate("/transactions");
    if (menu === "Suppliers") navigate("/dashboard", { state: { activeItem: "Suppliers" } });
    
    // 🛡️ Admin/Manager Navigation back to Dashboard
    const dashboardItems = ["Update Stock", "User Roles", "Audit Logs", "System Config"];
    if (dashboardItems.includes(menu)) {
      navigate("/dashboard", { state: { activeItem: menu } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        ...form,
        total: Number(form.total),
        current: Number(form.current),
      };

      await axios.post("http://127.0.0.1:5001/api/products/", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      navigate("/products", { state: { toast: "Asset registered successfully!" } });
    } catch (err) {
      console.error("Failed to add product:", err);
      const msg = err.response?.data?.message || "Failed to add product. Please verify connectivity and authority.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={S.root}>
      <Sidebar 
        role={role} 
        activeItem="Manage Products" 
        onMenuClick={handleMenuClick} 
        onLogout={handleLogout} 
      />

      <main style={S.main}>
        <Navbar role={role} />

        <div className="it-fade-up">
          <button style={S.breadcrumb} onClick={() => navigate("/products")}>← Back to Inventory</button>
          
          <div style={S.formContainer}>
            <h2 style={S.h2}>Add New Asset</h2>
            <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "0.95rem" }}>
              Enter the blueprint details to register a new product in the system.
            </p>

            {error && <div style={S.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <label style={S.label}>Asset Identifier</label>
              <input
                type="text"
                name="product_id"
                placeholder="e.g. PRD-001"
                value={form.product_id}
                onChange={handleChange}
                style={S.input}
                required
              />

              <label style={S.label}>Product Name</label>
              <input
                type="text"
                name="name"
                placeholder="Enter full product name"
                value={form.name}
                onChange={handleChange}
                style={S.input}
                required
              />

              <label style={S.label}>Category</label>
              <div style={{ position: "relative" }}>
                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                  style={{ ...S.input, appearance: "none" }}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="Hardware">Hardware</option>
                  <option value="Laptops">Laptops</option>
                  <option value="Monitor">Monitors</option>
                  <option value="Peripheral">Peripherals</option>
                  <option value="Electronics">Electronics</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Stationery">Stationery</option>
                  <option value="Office Supplies">Office Supplies</option>
                </select>
                <div style={{ position: "absolute", right: "16px", top: "16px", pointerEvents: "none", fontSize: "0.8rem", color: "#94a3b8" }}>▼</div>
              </div>

              <label style={S.label}>Unit Price</label>
              <input
                type="text"
                name="price"
                placeholder="e.g. $1,200"
                value={form.price}
                onChange={handleChange}
                style={S.input}
                required
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={S.label}>Total Capacity</label>
                  <input
                    type="number"
                    name="total"
                    placeholder="0"
                    value={form.total}
                    onChange={handleChange}
                    style={S.input}
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Initial Stock</label>
                  <input
                    type="number"
                    name="current"
                    placeholder="0"
                    value={form.current}
                    onChange={handleChange}
                    style={S.input}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                style={{ ...S.btnPrimary, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
              >
                {loading ? "REGISTERING ASSET..." : "REGISTER ASSET"}
              </button>
            </form>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default AddProduct;
