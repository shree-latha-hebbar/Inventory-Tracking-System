import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import Toast from "../components/Toast";

/* ─── Inline Styles (Sapphire & Slate Design System) ─────── */
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
  
  headerLeft: { display: "flex", flexDirection: "column", gap: "6px" },
  breadcrumb: {
    display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem",
    fontWeight: "700", color: "#94a3b8", cursor: "pointer",
    background: "none", border: "none", padding: 0,
  },
  h1: { fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-1px" },
  
  btnPrimary: {
    padding: "12px 28px", borderRadius: "16px",
    background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    color: "#fff", fontWeight: "800", border: "none", cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)"
  },

  /* ── Container & Grid ── */
  container: { width: "100%" },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
    gap: "24px", marginBottom: "40px"
  },
  statCard: {
    padding: "24px", borderRadius: "24px", background: "#fff", border: "1.5px solid #e2e8f0",
    display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
  },
  statLabel: { fontSize: "0.82rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" },
  statValue: { fontSize: "2.6rem", fontWeight: "950", letterSpacing: "-1px" },

  /* ── Table Layout ── */
  tableContainer: {
    background: "#fff", borderRadius: "24px", border: "1.5px solid #e2e8f0", overflow: "hidden",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)"
  },
  table: { width: "100%", borderCollapse: "collapse", textAlign: "left" },
  th: {
    padding: "24px", background: "#f8fafc", fontSize: "0.8rem", fontWeight: "800", color: "#94a3b8",
    textTransform: "uppercase", letterSpacing: "0.5px", borderBottom: "1.5px solid #e2e8f0"
  },
  td: { padding: "20px 24px", borderBottom: "1px solid #f1f5f9", fontSize: "0.92rem", fontWeight: "600", color: "#334155" },
  tr: { transition: "background .2s" },

  statusBadge: { padding: "6px 14px", borderRadius: "10px", fontSize: "0.8rem", fontWeight: "800", textTransform: "uppercase", whiteSpace: "nowrap" }
};

const INITIAL_TRANSACTIONS = [
  { id: "TXN-001", product: "Corporate Workstation", type: "IN", quantity: 15, date: "18 Apr 2026", status: "Completed" },
  { id: "TXN-002", product: "MacBook Pro M3 Max", type: "OUT", quantity: 5, date: "18 Apr 2026", status: "Completed" },
  { id: "TXN-003", product: "Logitech MX Master 3S", type: "OUT", quantity: 3, date: "17 Apr 2026", status: "Completed" },
  { id: "TXN-004", product: "UltraSharp Display 32\"", type: "IN", quantity: 20, date: "17 Apr 2026", status: "Completed" },
  { id: "TXN-005", product: "Steelcase Gesture Chair", type: "OUT", quantity: 2, date: "16 Apr 2026", status: "Pending" },
];

const OFFICIAL_PRODUCTS = [
  "Corporate Workstation",
  "UltraSharp Display 32\"",
  "Logitech MX Master 3S",
  "Steelcase Gesture Chair",
  "MacBook Pro M3 Max",
  "Dell Precision Tower"
];

function Transactions() {
  const navigate = useNavigate();
  const location = useLocation();
  const role = (localStorage.getItem("role") || "").trim().toLowerCase();
  const isManager = role === "manager";
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTxn, setNewTxn] = useState({
    product_id: "",
    type: "IN",
    quantity: 1,
    notes: ""
  });
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  
  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };
      
      const [txnRes, prodRes] = await Promise.all([
        axios.get("http://127.0.0.1:5001/api/transactions/", { headers }),
        axios.get("http://127.0.0.1:5001/api/products/", { headers })
      ]);
      
      setTransactions(txnRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Fetch transactions failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const stockInCount = transactions.filter(item => item.transaction_type === "IN" || item.transaction_type === "RESTOCK").length;
  const stockOutCount = transactions.filter(item => item.transaction_type === "OUT" || item.transaction_type === "SALE").length;

  const handleCommit = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const payload = {
        product_id: parseInt(newTxn.product_id), // Assuming ID is used
        quantity: newTxn.type === "IN" ? parseInt(newTxn.quantity) : -Math.abs(parseInt(newTxn.quantity)),
        transaction_type: newTxn.type,
        notes: newTxn.notes
      };

      await axios.post("http://127.0.0.1:5001/api/transactions/", payload, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setIsDrawerOpen(false);
      setToast({ show: true, message: "Transaction logged successfully!", type: "success" });
      fetchTransactions();
    } catch (err) {
      console.error("Log transaction failed:", err);
      alert("Failed to log transaction. Check console for details.");
    }
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

  return (
    <div style={S.root}>
      <Sidebar 
        role={role} 
        activeItem="Transaction History" 
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

        {/* ── Add Transaction Drawer ── */}
        {isDrawerOpen && (
          <div style={{ position: "fixed", top: 0, right: 0, width: "100%", height: "100%", zIndex: 2000, display: "flex" }}>
            <div style={{ flex: 1, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(8px)" }} onClick={() => setIsDrawerOpen(false)} />
            <div className="it-slide-in" style={{ 
              width: "500px", background: "#fff", height: "100%", boxShadow: "-20px 0 60px rgba(0,0,0,0.15)",
              padding: "48px", overflowY: "auto", position: "relative" 
            }}>
              <h2 style={{ fontSize: "1.75rem", fontWeight: "950", marginBottom: "8px", letterSpacing: "-0.5px" }}>Log Movement</h2>
              <p style={{ color: "#64748b", marginBottom: "32px", fontSize: "0.95rem" }}>Record a new stock inflow or outflow for the system.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                {/* PRODUCT */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Target Product</label>
                  <select 
                    style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "0.95rem", fontWeight: "600", color: "#1e3a8a", outline: "none" }}
                    value={newTxn.product_id}
                    onChange={(e) => setNewTxn({ ...newTxn, product_id: e.target.value })}
                  >
                    <option value="">Select a Product</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name} ({p.product_id})</option>)}
                  </select>
                </div>

                {/* TYPE TOGGLE */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Movement Type</label>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
                    <button 
                      onClick={() => setNewTxn({ ...newTxn, type: "IN" })}
                      style={{ 
                        padding: "14px", borderRadius: "12px", fontWeight: "800", transition: "all .2s", border: "1.5px solid",
                        background: newTxn.type === "IN" ? "#dcfce7" : "#fff",
                        color: newTxn.type === "IN" ? "#166534" : "#94a3b8",
                        borderColor: newTxn.type === "IN" ? "#166534" : "#e2e8f0"
                      }}
                    >⬇ STOCK IN</button>
                    <button 
                      onClick={() => setNewTxn({ ...newTxn, type: "OUT" })}
                      style={{ 
                        padding: "14px", borderRadius: "12px", fontWeight: "800", transition: "all .2s", border: "1.5px solid",
                        background: newTxn.type === "OUT" ? "#fee2e2" : "#fff",
                        color: newTxn.type === "OUT" ? "#991b1b" : "#94a3b8",
                        borderColor: newTxn.type === "OUT" ? "#991b1b" : "#e2e8f0"
                      }}
                    >⬆ STOCK OUT</button>
                  </div>
                </div>

                {/* QUANTITY */}
                <div>
                  <label style={{ display: "block", fontSize: "0.85rem", fontWeight: "800", color: "#94a3b8", textTransform: "uppercase", marginBottom: "8px" }}>Quantity Units</label>
                  <input 
                    type="number" min="1"
                    style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc", fontSize: "1.1rem", fontWeight: "800", outline: "none" }}
                    value={newTxn.quantity}
                    onChange={(e) => setNewTxn({ ...newTxn, quantity: e.target.value })}
                  />
                </div>

                <div style={{ marginTop: "24px", display: "flex", gap: "12px" }}>
                  <button 
                    onClick={() => setIsDrawerOpen(false)}
                    style={{ flex: 1, padding: "16px", borderRadius: "14px", border: "1.5px solid #e2e8f0", background: "#fff", color: "#64748b", fontWeight: "700", cursor: "pointer" }}
                  >Cancel</button>
                  <button 
                    onClick={handleCommit}
                    style={{ ...S.btnPrimary, flex: 2, padding: "16px" }}
                  >Commit Transaction</button>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="it-fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={S.headerLeft}>
              <button style={S.breadcrumb} onClick={() => navigate("/dashboard")}>← Return to Dashboard</button>
              <h1 style={S.h1}>Transaction Core</h1>
            </div>
          </div>

          <div style={S.container}>
            {/* ── Stats Grill ── */}
            <div style={S.statsGrid}>
              <div style={S.statCard}>
                <p style={S.statLabel}>Total Transactions</p>
                <h2 style={{ ...S.statValue, color: "#1e3a8a" }}>{transactions.length}</h2>
              </div>
              <div style={S.statCard}>
                <p style={S.statLabel}>Stock In Flows</p>
                <h2 style={{ ...S.statValue, color: "#16a34a" }}>{stockInCount}</h2>
              </div>
              <div style={S.statCard}>
                <p style={S.statLabel}>Stock Out Flows</p>
                <h2 style={{ ...S.statValue, color: "#dc2626" }}>{stockOutCount}</h2>
              </div>
            </div>

            {/* ── Main Table ── */}
            <div style={S.tableContainer}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "24px", borderBottom: "1.5px solid #e2e8f0" }}>
                <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#0f172a" }}>Recent Movements</h3>
                {isManager && (
                  <button style={{ ...S.btnPrimary, padding: "10px 20px", fontSize: "0.85rem" }} onClick={() => setIsDrawerOpen(true)}>
                    + Add Transaction
                  </button>
                )}
              </div>
              
              <div style={{ overflowX: "auto" }}>
                <table style={S.table}>
                  <thead>
                    <tr>
                      <th style={S.th}>Transaction ID</th>
                      <th style={S.th}>Product Details</th>
                      <th style={S.th}>Flow Type</th>
                      <th style={S.th}>Quantity</th>
                      <th style={S.th}>Date Logged</th>
                      <th style={S.th}>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                        {transactions.map((item) => {
                          const isIncoming = item.transaction_type === "IN" || item.transaction_type === "RESTOCK" || item.transaction_type === "RESTOCK";
                          const product = products.find(p => p.id === item.product_id);
                          const productName = product ? product.name : (item.product?.name || `Product #${item.product_id}`);
                          
                          return (
                            <tr key={item.id} style={S.tr} onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                              <td style={{ ...S.td, color: "#2563eb", fontWeight: "800" }}>TXN-{item.id.toString().padStart(3, '0')}</td>
                              <td style={S.td}>
                                <div style={{ fontWeight: 800, color: "#1e293b" }}>{productName}</div>
                                <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>
                                  ID: {product?.product_id || `#${item.product_id}`}
                                </div>
                              </td>
                          <td style={S.td}>
                            <span style={{ 
                              ...S.statusBadge, 
                              background: isIncoming ? "#dcfce7" : "#fee2e2", 
                              color: isIncoming ? "#166534" : "#991b1b" 
                            }}>
                              {isIncoming ? "⬇ STOCK IN" : "⬆ STOCK OUT"}
                            </span>
                          </td>
                          <td style={{ ...S.td, fontWeight: "800" }}>{Math.abs(item.quantity)} Units</td>
                          <td style={{ ...S.td, color: "#64748b" }}>{item.timestamp}</td>
                          <td style={S.td}>
                            <span style={{ 
                              ...S.statusBadge, 
                              background: "#dbeafe", 
                              color: "#1e40af" 
                            }}>
                              Completed
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Transactions;