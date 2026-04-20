import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";

/* ─── Inline Styles (Sapphire & Slate Design System) ─────── */
const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    color: "#0f172a",
    overflowX: "hidden",
  },
  
  /* ── Header ── */
  header: {
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
  },
  logoBox: { display: "flex", alignItems: "center", gap: "16px", cursor: "pointer" },
  logoImg: { width: "64px", height: "64px", objectFit: "contain" },
  logoName: { fontSize: "1.6rem", fontWeight: "950", color: "#1e3a8a", letterSpacing: "-1px" },
  
  headerLeft: { display: "flex", flexDirection: "column", gap: "6px" },
  breadcrumb: {
    display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem",
    fontWeight: "700", color: "#94a3b8", cursor: "pointer",
  },
  h1: { fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-1px" },
  
  navBtns: { display: "flex", gap: "24px", alignItems: "center" },
  navLink: { 
    fontSize: "0.85rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", 
    letterSpacing: "1px", cursor: "pointer", transition: "all .2s", padding: "8px 4px",
    background: "none", border: "none"
  },
  activeLink: { color: "#2563eb", borderBottom: "2px solid #2563eb" },
  btnPrimary: {
    padding: "12px 28px", borderRadius: "16px",
    background: "linear-gradient(135deg,#1d4ed8,#3b82f6)",
    color: "#fff", fontWeight: "800", border: "none", cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)"
  },

  /* ── Container & Grid ── */
  container: { maxWidth: "1400px", margin: "0 auto", padding: "40px 5% 100px" },
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
  
  // 📦 Load from Storage or Fallback
  const [transactions, setTransactions] = useState(() => {
    const saved = localStorage.getItem("inventrack_transactions");
    return saved ? JSON.parse(saved) : INITIAL_TRANSACTIONS;
  });
  
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newTxn, setNewTxn] = useState({
    product: OFFICIAL_PRODUCTS[0],
    type: "IN",
    quantity: 1
  });
  
  useEffect(() => {
    /* Inject Fonts & Animations */
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
          from { transform: translateX(100%); opacity: 0.5; }
          to { transform: translateX(0); opacity: 1; }
        }
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .it-slide-in { animation: itSlideIn 0.5s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const stockInCount = transactions.filter(item => item.type === "IN").length;
  const stockOutCount = transactions.filter(item => item.type === "OUT").length;

  const handleCommit = () => {
    const freshTxn = {
      id: `TXN-00${transactions.length + 1}`,
      product: newTxn.product,
      type: newTxn.type,
      quantity: parseInt(newTxn.quantity),
      date: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }),
      status: "Completed"
    };

    const updated = [freshTxn, ...transactions];
    setTransactions(updated);
    localStorage.setItem("inventrack_transactions", JSON.stringify(updated));
    
    setIsDrawerOpen(false);
    setNewTxn({ product: OFFICIAL_PRODUCTS[0], type: "IN", quantity: 1 });
  };

  return (
    <div style={S.root}>
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
                  value={newTxn.product}
                  onChange={(e) => setNewTxn({ ...newTxn, product: e.target.value })}
                >
                  {OFFICIAL_PRODUCTS.map(p => <option key={p} value={p}>{p}</option>)}
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
      {/* ── Unified Sapphire Header ── */}
      <header style={{ ...S.header, padding: "20px 5%", position: "sticky", top: 0, zIndex: 1000, background: "rgba(255,255,255,0.9)", backdropFilter: "blur(20px)" }}>
        <div style={S.logoBox} onClick={() => navigate("/")}>
          <img src={logo} alt="IT" style={S.logoImg} />
          <span style={S.logoName}>InvenTrack</span>
        </div>
        
        <div style={S.navBtns}>
          <button style={location.pathname === "/products" ? { ...S.navLink, ...S.activeLink } : S.navLink} onClick={() => navigate("/products")}>Products</button>
          <button style={location.pathname === "/transactions" ? { ...S.navLink, ...S.activeLink } : S.navLink} onClick={() => navigate("/transactions")}>Transactions</button>
          <button style={location.pathname === "/reports" ? { ...S.navLink, ...S.activeLink } : S.navLink} onClick={() => navigate("/reports")}>Reports</button>
          
          <div style={{ paddingLeft: "16px", borderLeft: "2px solid #e2e8f0", display: "flex", gap: "16px", alignItems: "center" }}>
             <span style={{ fontSize: "0.85rem", fontWeight: "700", color: "#64748b" }}>👤 {isManager ? "MANAGER" : "STAFF"}</span>
             <button style={{ ...S.btnPrimary, background: "#ef4444", boxShadow: "0 8px 20px rgba(239,68,68,0.2)" }} onClick={() => { localStorage.removeItem("role"); navigate("/"); }}>Logout</button>
          </div>
        </div>
      </header>

      <div className="it-fade-up">
        {/* ── Page Title ── */}
        <div style={{ padding: "40px 5%", background: "#fff", borderBottom: "1.5px solid #e2e8f0" }}>
        <div style={S.headerLeft}>
          <span style={S.breadcrumb} onClick={() => navigate("/dashboard")}>← Return to Dashboard</span>
          <h1 style={S.h1}>Transaction Core</h1>
        </div>
      </div>

      <main style={S.container}>
        
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
                {transactions.map((item) => (
                  <tr key={item.id} style={S.tr} onMouseEnter={(e) => { e.currentTarget.style.background = "#f8fafc"; }} onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}>
                    <td style={{ ...S.td, color: "#2563eb", fontWeight: "800" }}>{item.id}</td>
                    <td style={S.td}>{item.product}</td>
                    <td style={S.td}>
                      <span style={{ 
                        ...S.statusBadge, 
                        background: item.type === "IN" ? "#dcfce7" : "#fee2e2", 
                        color: item.type === "IN" ? "#166534" : "#991b1b" 
                      }}>
                        {item.type === "IN" ? "⬇ STOCK IN" : "⬆ STOCK OUT"}
                      </span>
                    </td>
                    <td style={{ ...S.td, fontWeight: "800" }}>{item.quantity} Units</td>
                    <td style={{ ...S.td, color: "#64748b" }}>{item.date}</td>
                    <td style={S.td}>
                      <span style={{ 
                         ...S.statusBadge, 
                         background: item.status === "Completed" ? "#dbeafe" : "#fef9c3", 
                         color: item.status === "Completed" ? "#1e40af" : "#a16207" 
                      }}>
                        {item.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </main>
    </div>
  </div>
);
}

export default Transactions;