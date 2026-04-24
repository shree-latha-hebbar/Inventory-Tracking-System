import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

/* ─── Inline Styles ─────────────────────────────────────── */
const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    color: "#0f172a",
    display: "flex",
  },
  
  /* ── Main ── */
  main: {
    flex: 1,
    padding: "32px",
    display: "flex",
    flexDirection: "column",
    gap: "32px",
    maxWidth: "calc(100vw - 280px)",
  },
  
  headerLeft: {
    display: "flex",
    flexDirection: "column",
    gap: "6px",
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
  h1: {
    fontSize: "2.25rem",
    fontWeight: "900",
    letterSpacing: "-1px",
  },
  btnPrimary: {
    padding: "12px 28px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff",
    fontSize: "0.95rem",
    fontWeight: "800",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  /* ── Stats Area ── */
  container: {
    width: "100%",
  },
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px",
    marginBottom: "40px",
  },
  statCard: {
    padding: "24px",
    borderRadius: "24px",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 2px 8px rgba(0,0,0,0.02)",
  },
  statLabel: {
    fontSize: "0.82rem",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
  },
  statValue: {
    fontSize: "2.4rem",
    fontWeight: "900",
  },

  /* ── Filters ── */
  filterBar: {
    display: "flex",
    gap: "16px",
    marginBottom: "24px",
    alignItems: "center",
  },
  searchBox: {
    flex: 1,
    position: "relative",
  },
  input: {
    width: "100%",
    height: "54px",
    padding: "0 16px 0 48px",
    borderRadius: "16px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    fontSize: "0.95rem",
    outline: "none",
    transition: "all .2s",
    boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
  },
  select: {
    height: "54px",
    padding: "0 40px 0 16px",
    borderRadius: "16px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    fontSize: "0.9rem",
    fontWeight: "600",
    outline: "none",
    cursor: "pointer",
    appearance: "none",
    backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24' fill='none' stroke='%2364748b' stroke-width='2.5' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E")`,
    backgroundRepeat: "no-repeat",
    backgroundPosition: "right 12px center",
  },

  /* ── Table ── */
  tableContainer: {
    background: "#fff",
    borderRadius: "24px",
    border: "1.5px solid #e2e8f0",
    overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
  },
  th: {
    textAlign: "left",
    padding: "20px 24px",
    background: "#f8fafc",
    fontSize: "0.78rem",
    fontWeight: "700",
    color: "#94a3b8",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1.5px solid #e2e8f0",
  },
  td: {
    padding: "20px 24px",
    borderBottom: "1px solid #f1f5f9",
    fontSize: "0.92rem",
    fontWeight: "600",
    color: "#334155",
  },
  statusBadge: {
    padding: "6px 14px",
    borderRadius: "10px",
    fontSize: "0.8rem",
    fontWeight: "800",
    textTransform: "uppercase",
  },
  actionBtn: {
    padding: "8px 12px",
    borderRadius: "8px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: "700",
    cursor: "pointer",
    marginRight: "8px",
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
  { id: "PRD-2041", name: "Blue Yeti Microphone", category: "Audio", total: 15, current: 12, price: "$129" },
  { id: "PRD-2042", name: "Keychron K2 Keyboard", category: "Peripheral", total: 40, current: 35, price: "$89" },
  { id: "PRD-2043", name: "Steelcase Leap V2", category: "Furniture", total: 8, current: 5, price: "$1,100" },
  { id: "PRD-2044", name: "Dell UltraSharp 27\"", category: "Monitor", total: 15, current: 10, price: "$499" },
];

function Products() {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All Categories");
  
  // 📦 Load from Storage or Fallback to INITIAL_PRODUCTS
  const [products, setProducts] = useState([]);
  const [activeProductsForStats, setActiveProductsForStats] = useState([]);
  const [archivedCount, setArchivedCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [role, setRole] = useState("staff");
  const [viewingAsset, setViewingAsset] = useState(null);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [viewMode, setViewMode] = useState("active"); // "active" or "archived"
  
  // 🗑️ Delete Modal State
  const [deleteModal, setDeleteModal] = useState({ show: false, id: null, name: null, reason: "Damaged" });

  useEffect(() => {
    const savedRole = localStorage.getItem("role") || "staff";
    setRole(savedRole);
    fetchProducts();

    // 🚀 Handle toast from redirect (e.g. from AddProduct)
    if (location.state?.toast) {
      setToast({ show: true, message: location.state.toast, type: "success" });
      // We clear the state in a small timeout to ensure the toast has time to mount
      setTimeout(() => {
        window.history.replaceState({}, document.title);
      }, 100);
    }

    // 🚀 Global Style Injection
    if (!document.getElementById("it-fonts")) {
      const style = document.createElement("style");
      style.id = "it-fonts";
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        @keyframes itFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes itSlideIn {
          from { transform: translateX(100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .it-slide-in { animation: itSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `;
      document.head.appendChild(style);
    }
  }, [location.state]);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      
      // 1. Fetch current view products
      const url = viewMode === "archived" 
        ? "http://127.0.0.1:5001/api/products/archived" 
        : "http://127.0.0.1:5001/api/products/";
        
      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProducts(response.data);

      // 2. Fetch active products for global stats (always needed)
      const activeRes = await axios.get("http://127.0.0.1:5001/api/products/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setActiveProductsForStats(activeRes.data);

      // 3. Fetch archived count for the button label
      const archivedRes = await axios.get("http://127.0.0.1:5001/api/products/archived", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setArchivedCount(archivedRes.data.length);

      setError(null);
    } catch (err) {
      console.error("Fetch products failed", err);
      setError("Failed to synchronize with central inventory.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [viewMode]);

  const isStaff = role.toLowerCase() === "staff";
  const isAdminOrManager = role.toLowerCase() === "admin" || role.toLowerCase() === "manager";

  const handleDelete = (id, name) => {
    setDeleteModal({ show: true, id, name, reason: "Damaged" });
  };

  const handlePerformDelete = async (mode) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.delete(`http://127.0.0.1:5001/api/products/${deleteModal.id}?mode=${mode}`, {
        headers: { Authorization: `Bearer ${token}` },
        data: { reason: deleteModal.reason }
      });
      setToast({ 
        show: true, 
        message: mode === 'permanent' ? "Asset purged permanently." : `Asset archived as ${deleteModal.reason}.`, 
        type: mode === 'permanent' ? "error" : "success" 
      });
      setDeleteModal({ show: false, id: null, name: null, reason: "Damaged" });
      fetchProducts();
    } catch (err) {
      alert("Delete failed. Unauthorized or Network Error.");
    }
  };

  const handleRestore = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.post(`http://127.0.0.1:5001/api/products/${id}/restore`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setToast({ show: true, message: "Asset restored to active inventory!", type: "success" });
      fetchProducts();
    } catch (err) {
      alert("Restore failed. Unauthorized or Network Error.");
    }
  };

  const handleStockUpdate = async (id, currentVal) => {
    const newVal = window.prompt("Enter new Stock Counter (Current Quantity):", currentVal);
    if (newVal !== null && !isNaN(newVal)) {
      try {
        const token = localStorage.getItem("access_token");
        await axios.put(`http://127.0.0.1:5001/api/products/${id}`, 
          { current: parseInt(newVal) },
          { headers: { Authorization: `Bearer ${token}` } }
        );
        fetchProducts();
        setToast({ show: true, message: "Stock updated successfully!", type: "success" });
      } catch (err) {
        alert("Update failed. Unauthorized or Network Error.");
      }
    }
  };

  const filteredProducts = products.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.product_id.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === "All Categories" ||
      item.category.toLowerCase() === selectedCategory.toLowerCase();

    return matchesSearch && matchesCategory;
  });

  const totalValue = activeProductsForStats.reduce((acc, p) => {
    const priceNum = parseInt(p.price.replace(/[^0-9]/g, ""));
    return acc + (priceNum * p.current);
  }, 0);

  const lowStockCount = activeProductsForStats.filter((item) => item.current > 0 && item.current <= 5).length;
  const availableCount = activeProductsForStats.filter((item) => item.current > 5).length;

  const handleMenuClick = (menu) => {
    if (menu === "Dashboard") navigate("/dashboard");
    if (menu === "Manage Products" || menu === "Product Search") navigate("/products");
    if (menu === "Stock Orders") navigate("/orders");
    if (menu === "Inventory Reports" || menu === "Transaction History") navigate("/transactions");
    if (menu === "Reports") navigate("/reports");

    // 🛡️ Admin/Manager Navigation back to Dashboard
    const dashboardItems = ["User Roles", "Audit Logs", "System Config"];
    if (dashboardItems.includes(menu)) {
      navigate("/dashboard", { state: { activeItem: menu } });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("role");
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <div style={S.root}>
      <Sidebar 
        role={role} 
        activeItem={isAdminOrManager ? "Manage Products" : "Product Search"} 
        onMenuClick={handleMenuClick} 
        onLogout={handleLogout} 
      />

      <main style={S.main}>
        <Navbar role={role} />

        {toast.show && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast({ ...toast, show: false })} 
          />
        )}

        {/* ── Asset Deep Dive Drawer ── */}
        {viewingAsset && (
          <div style={{ position: "fixed", top: 0, right: 0, width: "100%", height: "100%", zIndex: 2000, display: "flex" }}>
            <div style={{ flex: 1, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(8px)" }} onClick={() => setViewingAsset(null)} />
            <div className="it-slide-in" style={{ 
              width: "550px", background: "#fff", height: "100%", boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
              padding: "50px", overflowY: "auto", position: "relative" 
            }}>
              <div style={{ marginBottom: "32px" }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 800, color: "#2563eb", background: "#eff6ff", padding: "6px 14px", borderRadius: "10px", marginBottom: "16px", display: "inline-block" }}>
                  ASSET PROFILE
                </span>
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                  <h2 style={{ fontSize: "2rem", fontWeight: 900, letterSpacing: "-0.5px", margin: 0 }}>{viewingAsset.name}</h2>
                  <button 
                    onClick={() => setViewingAsset(null)}
                    style={{ 
                      background: "#f1f5f9", border: "none", color: "#64748b",
                      padding: "8px 16px", borderRadius: "12px", cursor: "pointer", 
                      fontWeight: "800", fontSize: "0.8rem", display: "flex",
                      alignItems: "center", gap: "6px",
                      transition: "all .2s"
                    }}
                  >
                    ← BACK
                  </button>
                </div>
                <p style={{ color: "#64748b", marginTop: "8px", fontWeight: "700" }}>ASSET ID: {viewingAsset.product_id}</p>
              </div>

              <div style={{ background: "#f8fafc", padding: "32px", borderRadius: "24px", border: "1.5px solid #e2e8f0", marginBottom: "32px" }}>
                <div style={{ display: "flex", justifyContent: "space-between" }}>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Unit Valuation</p>
                    <p style={{ fontWeight: 800, fontSize: "1.2rem" }}>{viewingAsset.price}</p>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Category</p>
                    <p style={{ fontWeight: 800 }}>{viewingAsset.category}</p>
                  </div>
                </div>
              </div>

              <div style={{ marginBottom: "32px" }}>
                <h4 style={{ fontWeight: 800, marginBottom: "16px" }}>Logistics Blueprint</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {[
                    { label: "Serial Number", val: `SN-IT-${viewingAsset.product_id.split("-")[1]}-002` },
                    { label: "Storage Location", val: viewingAsset.category === "Furniture" ? "Sector B-9" : "High-Security Vault A" },
                    { label: "Operational Status", val: viewingAsset.current > 0 ? "In Stock" : "Backordered" },
                    { label: "Reorder Point", val: "10 Units" },
                  ].map((spec, i) => (
                    <div key={i} style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9", paddingBottom: "8px" }}>
                      <span style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: 600 }}>{spec.label}</span>
                      <span style={{ fontSize: "0.85rem", fontWeight: 800 }}>{spec.val}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 style={{ fontWeight: 800, marginBottom: "16px" }}>Audit Timeline</h4>
                <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                  {[
                    { date: "15 Apr 2026", msg: "Inventory level verified." },
                    { date: "02 Apr 2026", msg: "Received from Global Manufacturing Hub." },
                    { date: "28 Mar 2026", msg: "Purchase Order approved." },
                  ].map((log, i) => (
                    <div key={i} style={{ display: "flex", gap: "16px" }}>
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#cbd5e1", marginTop: "6px" }} />
                      <div>
                        <p style={{ fontSize: "0.85rem", fontWeight: 800 }}>{log.msg}</p>
                        <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{log.date}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="it-fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={S.headerLeft}>
              <button style={S.breadcrumb} onClick={() => navigate("/dashboard")}>← Return to Dashboard</button>
              <h1 style={S.h1}>Inventory Vault</h1>
              {error && <span style={{ color: "#ef4444", fontSize: "0.85rem", fontWeight: "700" }}>⚠️ {error}</span>}
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
          <div style={{ display: "flex", background: "#e2e8f0", padding: "4px", borderRadius: "14px", gap: "4px" }}>
            <button 
              onClick={() => setViewMode("active")}
              style={{ 
                padding: "8px 16px", borderRadius: "10px", border: "none", 
                fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                background: viewMode === "active" ? "#fff" : "transparent",
                color: viewMode === "active" ? "#0f172a" : "#64748b",
                boxShadow: viewMode === "active" ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
              }}
            >
              Active Assets
            </button>
            <button 
              onClick={() => setViewMode("archived")}
              style={{ 
                padding: "8px 16px", borderRadius: "10px", border: "none", 
                fontSize: "0.85rem", fontWeight: 700, cursor: "pointer",
                background: viewMode === "archived" ? "#fff" : "transparent",
                color: viewMode === "archived" ? "#0f172a" : "#64748b",
                boxShadow: viewMode === "archived" ? "0 2px 4px rgba(0,0,0,0.05)" : "none"
              }}
            >
              Archived ({archivedCount})
            </button>
          </div>
          {isAdminOrManager && viewMode === "active" && (
            <button style={S.btnPrimary} onClick={() => navigate("/products/add")}>
              + Register New Asset
            </button>
          )}
        </div>
      </div>

          <div style={S.container}>
            {/* ── Stats ── */}
            <div style={S.statsGrid}>
              <div style={S.statCard}>
                <p style={S.statLabel}>Total Inventory Value</p>
                <h2 style={{ ...S.statValue, color: "#0f172a" }}>
                  ${totalValue.toLocaleString()}
                </h2>
              </div>
              <div style={S.statCard}>
                <p style={S.statLabel}>Priority Restoration (Low Stock)</p>
                <h2 style={{ ...S.statValue, color: "#ea580c" }}>{lowStockCount}</h2>
              </div>
              <div style={S.statCard}>
                <p style={S.statLabel}>Operational Assets</p>
                <h2 style={{ ...S.statValue, color: "#16a34a" }}>{availableCount}</h2>
              </div>
            </div>

            {/* ── Search Bar ── */}
            <div style={S.filterBar}>
              <div style={S.searchBox}>
                <div style={{ position: "absolute", left: "16px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }}>
                  🔍
                </div>
                <input
                  type="text"
                  placeholder="Search by Product Name or Serial ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={S.input}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={S.select}
              >
                <option>All Categories</option>
                <option>Hardware</option>
                <option>Monitor</option>
                <option>Peripheral</option>
                <option>Laptops</option>
                <option>Furniture</option>
              </select>
            </div>

            {/* ── Inventory Table ── */}
            <div style={S.tableContainer}>
              <table style={S.table}>
                <thead>
                  <tr>
                    <th style={S.th}>Asset ID</th>
                    <th style={S.th}>Product Details</th>
                    <th style={S.th}>Category</th>
                    <th style={S.th}>Unit Price</th>
                    <th style={S.th}>Total Quantity</th>
                    <th style={S.th}>Current Quantity</th>
                    <th style={S.th}>{viewMode === 'active' ? 'Status' : 'Disposal Reason'}</th>
                    <th style={S.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {loading ? (
                    <tr><td colSpan="8" style={{ padding: "60px", textAlign: "center", color: "#64748b", fontWeight: "700" }}>SYNCING WITH VAULT...</td></tr>
                  ) : (
                    filteredProducts.map((item) => {
                      const isOutOfStock = item.current === 0;
                      const isLowStock = item.current > 0 && item.current <= 5;

                      return (
                        <tr key={item.product_id} onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                          <td style={{ ...S.td, color: "#2563eb", fontWeight: "800" }}>{item.product_id}</td>
                          <td style={S.td}>{item.name}</td>
                          <td style={S.td}>{item.category}</td>
                          <td style={S.td}>{item.price}</td>
                          <td style={{ ...S.td, color: "#64748b" }}>{item.total} Units</td>
                          <td style={{ ...S.td, color: isOutOfStock ? "#dc2626" : isLowStock ? "#a16207" : "#2563eb", fontWeight: "700" }}>
                            {item.current} Units
                          </td>
                          <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                            {viewMode === 'active' ? (
                              <span style={{ 
                                ...S.statusBadge,
                                background: isOutOfStock ? "#fef2f2" : isLowStock ? "#fef9c3" : "#dcfce7",
                                color: isOutOfStock ? "#dc2626" : isLowStock ? "#a16207" : "#166534",
                                border: isOutOfStock ? "1px solid #fee2e2" : isLowStock ? "1px solid #fef08a" : "1px solid #bbfcda"
                              }}>
                                {isOutOfStock ? "Out of Stock" : isLowStock ? "Low Stock" : "Operational"}
                              </span>
                            ) : (
                              <span style={{ 
                                ...S.statusBadge,
                                background: "#f1f5f9",
                                color: "#64748b",
                                border: "1px solid #e2e8f0"
                              }}>
                                {item.disposal_reason || "Not Specified"}
                              </span>
                            )}
                          </td>
                          <td style={{ ...S.td, whiteSpace: "nowrap" }}>
                            <button style={S.actionBtn} onClick={() => setViewingAsset(item)}>View</button>
                            {viewMode === "active" ? (
                              <>
                                {isAdminOrManager && (
                                  <button style={S.actionBtn} onClick={() => navigate(`/edit-product/${item.product_id}`)}>Edit</button>
                                )}
                                {isStaff && (
                                  <button style={{ ...S.actionBtn, color: "#2563eb", background: "#eff6ff" }} onClick={() => handleStockUpdate(item.product_id, item.current)}>Update Stock</button>
                                )}
                                {isAdminOrManager && (
                                  <button style={{ ...S.actionBtn, color: "#ef4444" }} onClick={() => handleDelete(item.product_id, item.name)}>Delete</button>
                                )}
                              </>
                            ) : (
                              <>
                                {isAdminOrManager && (
                                  <button style={{ ...S.actionBtn, color: "#16a34a", background: "#dcfce7", border: "1.5px solid #bbfcda" }} onClick={() => handleRestore(item.product_id)}>Restore</button>
                                )}
                                {isAdminOrManager && (
                                  <button style={{ ...S.actionBtn, color: "#ef4444" }} onClick={() => handleDelete(item.product_id, item.name)}>Purge</button>
                                )}
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
        {/* ── Delete Confirmation Modal ── */}
        {deleteModal.show && (
          <div style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", zIndex: 3000, display: "flex", alignItems: "center", justifyContent: "center", background: "rgba(15, 23, 42, 0.4)", backdropFilter: "blur(4px)" }}>
            <div className="it-fade-up" style={{ background: "#fff", padding: "40px", borderRadius: "32px", width: "450px", boxShadow: "0 20px 50px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontSize: "1.5rem", fontWeight: 900, marginBottom: "12px" }}>Decommission Asset?</h2>
              <p style={{ color: "#64748b", fontWeight: "600", marginBottom: "32px", lineHeight: "1.6" }}>
                 You are about to remove <strong>{deleteModal.name}</strong>. {viewMode === 'active' ? 'Choose the decommissioning method:' : 'This action is irreversible.'}
               </p>
               
               {viewMode === 'active' && (
                 <div style={{ marginBottom: "24px" }}>
                   <label style={{ fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", display: "block", marginBottom: "8px" }}>
                     Reason for Removal
                   </label>
                   <select 
                     value={deleteModal.reason}
                     onChange={(e) => setDeleteModal({ ...deleteModal, reason: e.target.value })}
                     style={{ ...S.select, width: "100%" }}
                   >
                     <option value="Damaged">Damaged / Broken</option>
                     <option value="Expired">Expired Item</option>
                     <option value="Sold">Sold / Shipped</option>
                     <option value="Donated">Donated</option>
                     <option value="Other">Other Disposal</option>
                   </select>
                 </div>
               )}

               <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {viewMode === 'active' && (
                  <button 
                    onClick={() => handlePerformDelete('temporary')}
                    style={{ ...S.btnPrimary, background: "#f1f5f9", color: "#0f172a", border: "1.5px solid #e2e8f0", boxShadow: "none" }}
                  >
                    Temporary Delete (Move to Archive)
                  </button>
                )}
                <button 
                  onClick={() => handlePerformDelete('permanent')}
                  style={{ ...S.btnPrimary, background: "#fee2e2", color: "#dc2626", border: "1.5px solid #fecaca", boxShadow: "none" }}
                >
                  {viewMode === 'active' ? 'Permanent Delete (Purge)' : 'Confirm Permanent Purge'}
                </button>
                <button 
                  onClick={() => setDeleteModal({ show: false, id: null, name: null })}
                  style={{ background: "transparent", border: "none", color: "#94a3b8", fontWeight: "700", cursor: "pointer", marginTop: "12px" }}
                >
                  Cancel Operation
                </button>
              </div>
            </div>
          </div>
        )}

        <Footer />
      </main>
    </div>
  );
}

export default Products;