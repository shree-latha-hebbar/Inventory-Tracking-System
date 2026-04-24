import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

/* ─── Inline Styles (Analytics & Insights Theme) ────────── */
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

  container: { width: "100%" },
  grid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))",
    gap: "32px", marginBottom: "40px"
  },
  card: {
    padding: "32px", borderRadius: "28px", background: "#fff", border: "1.5px solid #e2e8f0",
    display: "flex", flexDirection: "column", gap: "24px", boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
  },
  cardHeader: { display: "flex", justifyContent: "space-between", alignItems: "center" },
  cardTitle: { fontSize: "1.1rem", fontWeight: "900", color: "#1e293b", letterSpacing: "-0.3px" },

  /* ── Velocity List ── */
  item: {
    display: "flex", alignItems: "center", justifyContent: "space-between",
    padding: "16px", borderRadius: "16px", background: "#f8fafc", border: "1px solid #f1f5f9"
  },
  itemName: { fontWeight: "800", color: "#334155", fontSize: "0.9rem" },
  itemMeta: { fontSize: "0.75rem", color: "#94a3b8", fontWeight: "700", textTransform: "uppercase" },
  itemValue: { fontWeight: "950", color: "#2563eb", fontSize: "1.1rem" },

  /* ── Critical Alerts ── */
  criticalItem: {
    display: "flex", alignItems: "center", gap: "16px", padding: "16px",
    borderRadius: "16px", background: "#fef2f2", border: "1.5px solid #fee2e2"
  },
  criticalName: { fontWeight: "800", color: "#991b1b", fontSize: "0.9rem" },
  criticalStock: { fontWeight: "950", color: "#dc2626" }
};

function Reports() {
  const navigate = useNavigate();
  const location = useLocation();
  const [summary, setSummary] = useState({
    total_assets: 0,
    total_value: 0,
    critical_stock: 0,
    movement_flow: 0,
    system_health: 100
  });
  const [velocity, setVelocity] = useState([]);
  const [criticalList, setCriticalList] = useState([]);
  const [loading, setLoading] = useState(true);

  const roleString = (localStorage.getItem("role") || "Staff").trim();
  const role = roleString.toLowerCase();

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem("access_token");
      const headers = { Authorization: `Bearer ${token}` };

      const [sumRes, velRes, critRes] = await Promise.all([
        axios.get("http://127.0.0.1:5001/api/reports/summary", { headers }),
        axios.get("http://127.0.0.1:5001/api/reports/velocity", { headers }),
        axios.get("http://127.0.0.1:5001/api/reports/critical-list", { headers })
      ]);

      setSummary(sumRes.data);
      setVelocity(velRes.data);
      setCriticalList(critRes.data);
    } catch (err) {
      console.error("Fetch reports failed:", err);
    } finally {
      setLoading(false);
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
        activeItem="Inventory Reports" 
        onMenuClick={handleMenuClick} 
        onLogout={handleLogout} 
      />

      <main style={S.main}>
        <Navbar role={role} />

        <div className="it-fade-up">
          <div style={S.headerLeft}>
            <button style={S.breadcrumb} onClick={() => navigate("/dashboard")}>← Return to Dashboard</button>
            <h1 style={S.h1}>Intelligence Hub</h1>
          </div>

          <div style={S.container}>
            {/* ── Key Metrics ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr 1fr", gap: "24px", marginBottom: "40px" }}>
              {[
                { label: "Total Valuation", val: `$${summary.total_value.toLocaleString()}`, icon: "💎", color: "#2563eb" },
                { label: "Critical Stock", val: summary.critical_stock, icon: "🚨", color: "#ef4444" },
                { label: "Movement Flow", val: summary.movement_flow, icon: "📊", color: "#10b981" },
                { label: "Operational Assets", val: summary.total_assets, icon: "🛡️", color: "#1e293b" }
              ].map((m, i) => (
                <div key={i} style={{ background: "#fff", padding: "24px", borderRadius: "24px", border: "1.5px solid #e2e8f0", display: "flex", alignItems: "center", gap: "20px" }}>
                  <div style={{ width: "54px", height: "54px", borderRadius: "16px", background: `${m.color}10`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>{m.icon}</div>
                  <div>
                    <p style={{ fontSize: "0.75rem", fontWeight: 800, color: "#94a3b8", textTransform: "uppercase", marginBottom: "4px" }}>{m.label}</p>
                    <p style={{ fontSize: "1.5rem", fontWeight: 950, color: m.color, letterSpacing: "-1px" }}>{m.val}</p>
                  </div>
                </div>
              ))}
            </div>

            <div style={S.grid}>
              {/* ── VELOCITY ── */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h3 style={S.cardTitle}>Top Velocity Assets</h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#16a34a", background: "#dcfce7", padding: "6px 12px", borderRadius: "10px" }}>LAST 30 DAYS</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {velocity.length > 0 ? velocity.map((item, i) => (
                    <div key={i} style={S.item}>
                      <div>
                        <p style={S.itemName}>{item.name}</p>
                        <p style={S.itemMeta}>{item.category}</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={S.itemValue}>{item.val}</p>
                        <p style={{ fontSize: "0.7rem", fontWeight: 800, color: "#94a3b8" }}>TURNOVER</p>
                      </div>
                    </div>
                  )) : <p style={{color: "#94a3b8", fontSize: "0.9rem"}}>No recent movements tracked.</p>}
                </div>
              </div>

              {/* ── CRITICAL REPLENISHMENT ── */}
              <div style={S.card}>
                <div style={S.cardHeader}>
                  <h3 style={S.cardTitle}>Critical Replenishment</h3>
                  <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#ef4444", background: "#fee2e2", padding: "6px 12px", borderRadius: "10px" }}>URGENT</span>
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                  {criticalList.length > 0 ? criticalList.map((item, i) => (
                    <div key={i} style={S.criticalItem}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "4px", background: item.color }} />
                      <div style={{ flex: 1 }}>
                        <p style={S.criticalName}>{item.name}</p>
                        <p style={{ fontSize: "0.75rem", color: "#b91c1c", fontWeight: "700" }}>Threshold: 5 Units</p>
                      </div>
                      <div style={{ textAlign: "right" }}>
                        <p style={S.criticalStock}>{item.val} LEFT</p>
                        <button style={{ border: "none", background: "none", color: "#dc2626", fontSize: "0.75rem", fontWeight: "900", textDecoration: "underline", cursor: "pointer" }}>ORDER NOW</button>
                      </div>
                    </div>
                  )) : <p style={{color: "#16a34a", fontSize: "0.9rem"}}>All assets healthy.</p>}
                </div>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Reports;
