import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { useNotification } from "../context/NotificationContext";
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
    boxShadow: "0 20px 50px rgba(15,23,42,0.06)",
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
    flex: 2,
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
  btnSecondary: {
    flex: 1,
    padding: "16px",
    borderRadius: "16px",
    background: "#fff",
    color: "#64748b",
    fontSize: "1rem",
    fontWeight: "700",
    border: "1.5px solid #e2e8f0",
    cursor: "pointer",
    transition: "all .2s",
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

function EditProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification();
  
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    total: "",
    current: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const roleString = (localStorage.getItem("role") || "Staff").trim();
  const role = roleString.toLowerCase();

  useEffect(() => {
    // 🛡️ User Authority Validation
    if (role === "staff") {
      alert("⚠️ ACCESS DENIED: You lack authorization to modify the Inventory Vault.");
      navigate("/dashboard");
      return;
    }

    if (id) {
      fetchProduct();
    }
  }, [id, role, navigate]);

  const fetchProduct = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const response = await axios.get(`http://127.0.0.1:5000/api/products/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const item = response.data;
      setForm({
        name: item.name,
        category: item.category,
        price: item.price,
        total: item.total.toString(),
        current: item.current.toString(),
      });
    } catch (err) {
      console.error("Load failed", err);
      setError("Failed to load asset blueprint from vault.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleMenuClick = (menu) => {
    if (menu === "Dashboard") navigate("/dashboard");
    if (menu === "Manage Products" || menu === "Product Search") navigate("/products");
    if (menu === "Stock Orders") navigate("/orders");
    if (menu === "Inventory Reports" || menu === "Transaction History") navigate("/transactions");
    if (menu === "Reports") navigate("/reports");
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
    
    const productData = {
      product_id: id,
      name: form.name,
      category: form.category,
      price: form.price.startsWith("$") ? form.price : `$${form.price}`,
      total: parseInt(form.total),
      current: parseInt(form.current),
    };

    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`http://127.0.0.1:5000/api/products/${id}`, productData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      showNotification(`Asset ${form.name} updated successfully!`);
      navigate("/products");
    } catch (err) {
      console.error("Save failed", err);
      setError("Synchronization failed. Check network or authority.");
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
            <h2 style={S.h2}>Modify Asset</h2>
            <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "0.95rem" }}>
              Updating specifications for Asset ID: <strong style={{color: "#1d4ed8"}}>{id}</strong>
            </p>

            {error && <div style={S.error}>{error}</div>}

            <form onSubmit={handleSubmit}>
              <label style={S.label}>Product Display Name</label>
              <input
                style={S.input}
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="e.g. MacBook Pro M3 Max"
                required
              />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={S.label}>Category</label>
                  <input
                    style={S.input}
                    name="category"
                    value={form.category}
                    onChange={handleChange}
                    placeholder="Hardware"
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Unit Price ($)</label>
                  <input
                    style={S.input}
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    placeholder="$0.00"
                    required
                  />
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
                <div>
                  <label style={S.label}>Total Capacity</label>
                  <input
                    style={S.input}
                    name="total"
                    value={form.total}
                    onChange={handleChange}
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
                <div>
                  <label style={S.label}>Current On-Hand</label>
                  <input
                    style={S.input}
                    name="current"
                    value={form.current}
                    onChange={handleChange}
                    type="number"
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div style={{ display: "flex", gap: "16px", marginTop: "16px" }}>
                <button 
                  type="button" 
                  style={S.btnSecondary} 
                  onClick={() => navigate("/products")}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  style={S.btnPrimary}
                  disabled={loading}
                >
                  {loading ? "COMMITTING CHANGES..." : "COMMIT CHANGES"}
                </button>
              </div>
            </form>

            <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94a3b8", marginTop: "40px" }}>
               🔒 Secure Administrative Session | Authorized Profile: <strong>{role.toUpperCase()}</strong>
            </p>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default EditProduct;
