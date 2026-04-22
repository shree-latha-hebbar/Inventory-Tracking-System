import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

// Assets imports
import logo from "../assets/logo.png";

const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    display: "flex",
    flexDirection: "column",
    paddingBottom: "60px",
  },
  /* ── Header ── */
  topHeader: {
    padding: "20px 5%",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    background: "rgba(255,255,255,0.7)",
    backdropFilter: "blur(20px)",
    borderBottom: "1.5px solid rgba(226, 232, 240, 0.4)",
    position: "sticky",
    top: 0,
    zIndex: 1000,
    marginBottom: "40px",
    width: "100%",
  },
  logoBox: { display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" },
  logoImg: { width: "64px", height: "64px", objectFit: "contain" },
  logoName: { fontSize: "1.6rem", fontWeight: "950", color: "#1e3a8a", letterSpacing: "-1px" },
  
  card: {
    width: "100%",
    maxWidth: "680px",
    margin: "0 auto",
    background: "#fff",
    borderRadius: "32px",
    padding: "50px",
    boxShadow: "0 20px 50px rgba(15,23,42,0.06)",
    border: "1.5px solid #e2e8f0",
    position: "relative",
    overflow: "hidden",
  },
  brandName: {
    fontSize: "1.4rem",
    fontWeight: "900",
    color: "#1e3a8a",
    letterSpacing: "-0.5px",
  },
  header: {
    textAlign: "center",
    marginBottom: "40px",
  },
  h2: {
    fontSize: "2rem",
    fontWeight: "900",
    color: "#0f172a",
    letterSpacing: "-0.8px",
  },
  sub: {
    color: "#64748b",
    fontSize: "1rem",
    marginTop: "8px",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "24px",
  },
  field: {
    display: "flex",
    flexDirection: "column",
    gap: "8px",
  },
  label: {
    fontSize: "0.85rem",
    fontWeight: "700",
    color: "#475569",
    letterSpacing: "0.3px",
    textTransform: "uppercase",
  },
  input: {
    width: "100%",
    height: "54px",
    padding: "0 18px",
    borderRadius: "16px",
    border: "1.5px solid #e2e8f0",
    fontSize: "1rem",
    color: "#0f172a",
    transition: "all .2s",
    outline: "none",
    background: "#f8fafc",
  },
  inputFocus: {
    borderColor: "#2563eb",
    background: "#fff",
    boxShadow: "0 0 0 4px rgba(37,99,235,0.06)",
  },
  btnRow: {
    display: "flex",
    gap: "16px",
    marginTop: "16px",
  },
  btnPrimary: {
    flex: 2,
    height: "56px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "800",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
  },
  btnSecondary: {
    flex: 1,
    height: "56px",
    borderRadius: "16px",
    background: "#fff",
    color: "#64748b",
    fontSize: "1rem",
    fontWeight: "700",
    border: "1.5px solid #e2e8f0",
    cursor: "pointer",
    transition: "all .2s",
  },
};

const INITIAL_PRODUCTS = [
  { id: "PRD-2031", name: "Corporate Workstation", category: "Hardware", total: 45, current: 38, price: "$2,400" },
  { id: "PRD-2032", name: "UltraSharp Display 32\"", category: "Monitor", total: 20, current: 4, price: "$899" },
  { id: "PRD-2033", name: "Logitech MX Master 3S", category: "Peripheral", total: 100, current: 85, price: "$99" },
  { id: "PRD-2034", name: "Steelcase Gesture Chair", category: "Furniture", total: 12, current: 2, price: "$1,300" },
  { id: "PRD-2035", name: "MacBook Pro M3 Max", category: "Laptops", total: 15, current: 15, price: "$3,499" },
  { id: "PRD-2036", name: "Dell Precision Tower", category: "Hardware", total: 8, current: 0, price: "$4,200" },
  { id: "PRD-2037", name: "Sony WH-1000XM5", category: "Audio", total: 30, current: 22, price: "$399" },
  { id: "PRD-2038", name: "iPad Pro 12.9\"", category: "Tablets", total: 25, current: 10, price: "$1,099" },
  { id: "PRD-2039", name: "Herman Miller Aeron", category: "Furniture", total: 10, current: 8, price: "$1,500" },
  { id: "PRD-2040", name: "Samsung Odyssey G9", category: "Monitor", total: 5, current: 1, price: "$1,299" },
];

function EditProduct({ isNew = false }) {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [form, setForm] = useState({
    name: "",
    category: "",
    price: "",
    total: "",
    current: "",
  });

  const [focusedField, setFocusedField] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // 🛡️ User Authority Validation
    const userRole = localStorage.getItem("role") || "staff";
    if (userRole.toLowerCase() === "staff") {
      alert("⚠️ ACCESS DENIED: You lack authorization to modify the Inventory Vault.");
      navigate("/dashboard");
      return;
    }

    if (!isNew && id) {
      fetchProduct();
    }

    /* Inject UI Enhancements */
    if (!document.getElementById("it-fonts")) {
      const style = document.createElement("style");
      style.id = "it-fonts";
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        @keyframes itFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `;
      document.head.appendChild(style);
    }
  }, [id, isNew, navigate]);

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
      alert("Failed to load asset blueprint from vault.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const productData = {
      product_id: isNew ? `PRD-${Date.now().toString().slice(-4)}` : id,
      name: form.name,
      category: form.category,
      price: form.price.startsWith("$") ? form.price : `$${form.price}`,
      total: parseInt(form.total),
      current: parseInt(form.current),
    };

    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      if (isNew) {
        await axios.post("http://127.0.0.1:5000/api/products/", productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      } else {
        await axios.put(`http://127.0.0.1:5000/api/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
      }
      navigate("/products");
    } catch (err) {
      console.error("Save failed", err);
      alert("Synchronization failed. Check network or authority.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = (name) => ({
    ...S.input,
    ...(focusedField === name ? S.inputFocus : {})
  });

  return (
    <div style={S.root}>
      {/* ── Unified Sapphire Header ── */}
      <header style={S.topHeader}>
        <div style={S.logoBox} onClick={() => navigate("/")}>
          <img src={logo} alt="IT" style={S.logoImg} />
          <span style={S.logoName}>InvenTrack</span>
        </div>
        <div />
      </header>

      <div className="it-fade-up" style={{ width: "100%" }}>
        <div style={S.card}>
          <div style={S.header}>
            <h2 style={S.h2}>{id ? "Modify Inventory Asset" : "New Asset Registration"}</h2>
            <p style={S.sub}>
              {id ? `Updating specifications for Asset ID: ${id}` : "Register a new manufacturing asset into the global vault."}
            </p>
          </div>

        <form style={S.form} onSubmit={handleSubmit}>
          <div style={S.field}>
            <label style={S.label}>Product Display Name</label>
            <input
              style={inputStyle("name")}
              name="name"
              value={form.name}
              onChange={handleChange}
              onFocus={() => setFocusedField("name")}
              onBlur={() => setFocusedField(null)}
              placeholder="e.g. MacBook Pro M3 Max"
              required
            />
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={S.field}>
              <label style={S.label}>Category</label>
              <input
                style={inputStyle("category")}
                name="category"
                value={form.category}
                onChange={handleChange}
                onFocus={() => setFocusedField("category")}
                onBlur={() => setFocusedField(null)}
                placeholder="Hardware"
                required
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Unit Price ($)</label>
              <input
                style={inputStyle("price")}
                name="price"
                value={form.price}
                onChange={handleChange}
                onFocus={() => setFocusedField("price")}
                onBlur={() => setFocusedField(null)}
                placeholder="$0.00"
                required
              />
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "20px" }}>
            <div style={S.field}>
              <label style={S.label}>Total Capacity</label>
              <input
                style={inputStyle("total")}
                name="total"
                value={form.total}
                onChange={handleChange}
                onFocus={() => setFocusedField("total")}
                onBlur={() => setFocusedField(null)}
                type="number"
                placeholder="0"
                required
              />
            </div>
            <div style={S.field}>
              <label style={S.label}>Current On-Hand</label>
              <input
                style={inputStyle("current")}
                name="current"
                value={form.current}
                onChange={handleChange}
                onFocus={() => setFocusedField("current")}
                onBlur={() => setFocusedField(null)}
                type="number"
                placeholder="0"
                required
              />
            </div>
          </div>

          <div style={S.btnRow}>
            <button 
              type="button" 
              style={S.btnSecondary} 
              onClick={() => navigate("/products")}
              onMouseEnter={(e) => e.target.style.background = "#f1f5f9"}
              onMouseLeave={(e) => e.target.style.background = "#fff"}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              style={S.btnPrimary}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 14px 30px rgba(37,99,235,0.4)"; }}
              onMouseLeave={(e) => { e.target.style.transform = ""; e.target.style.boxShadow = S.btnPrimary.boxShadow; }}
            >
              {loading ? "PROCESSING..." : (isNew ? "Register Asset" : "Commit Changes")}
            </button>
          </div>
        </form>

        <p style={{ textAlign: "center", fontSize: "0.75rem", color: "#94a3b8", marginTop: "40px" }}>
           🔒 Secure Administrative Session | Authorized Profile: <strong>{localStorage.getItem("role")}</strong>
        </p>
        </div>
      </div>
    </div>
  );
}

export default EditProduct;