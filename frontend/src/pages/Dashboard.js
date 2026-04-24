import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    color: "#0f172a",
  },

  /* ── Main Dashboard UI ── */
  main: {
    flex: 1,
    padding: "32px 40px",
    background: "#f8faff",
    overflowY: "auto",
    maxHeight: "100vh",
  },
  topBar: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "32px",
    background: "#fff",
    padding: "16px 24px",
    borderRadius: "20px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
    border: "1.5px solid #f1f5f9",
  },

  /* KPI Cards */
  kpiGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    marginBottom: "32px",
  },
  kpiCard: (color) => ({
    background: `${color}06`,
    padding: "24px",
    borderRadius: "24px",
    border: `1.5px solid ${color}15`,
    borderLeft: `5px solid ${color}`,
    display: "flex",
    flexDirection: "column",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
    transition: "transform .2s",
  }),
  kpiLabel: { fontSize: "0.82rem", fontWeight: "700", color: "#64748b" },
  kpiValue: { fontSize: "1.8rem", fontWeight: "950", color: "#0f172a", letterSpacing: "-1px" },
  kpiTrend: (up) => ({
    fontSize: "0.75rem",
    fontWeight: "800",
    color: up ? "#10b981" : "#ef4444",
    background: up ? "rgba(16,185,129,0.1)" : "rgba(239,68,68,0.1)",
    padding: "4px 8px",
    borderRadius: "8px",
    width: "fit-content",
  }),

  /* Layout Grids */
  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1.2fr",
    gap: "24px",
    marginBottom: "24px",
  },
  standardCard: (accentColor) => ({
    background: "#fff",
    padding: "24px",
    borderRadius: "24px",
    border: "1.5px solid #f1f5f9",
    borderTop: accentColor ? `4px solid ${accentColor}` : "1.5px solid #f1f5f9",
    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
  }),
  cardTitle: { fontSize: "1.05rem", fontWeight: "900", color: "#0f172a", marginBottom: "20px" },

  /* Generic Table */
  table: { width: "100%", borderCollapse: "collapse" },
  th: { textAlign: "left", fontSize: "0.74rem", color: "#64748b", background: "#f8faff", textTransform: "uppercase", padding: "12px 16px", borderBottom: "1.5px solid #f1f5f9", fontWeight: "900", letterSpacing: "0.5px" },
  td: { padding: "14px 16px", fontSize: "0.86rem", color: "#475569", borderBottom: "1.5px solid #f8fafc", fontWeight: "600" },
  statusPip: (color) => ({
    width: "10px",
    height: "10px",
    borderRadius: "50%",
    background: color,
    display: "inline-block",
    marginRight: "8px",
  }),
  activitySection: {
    background: "#fff",
    padding: "24px",
    borderRadius: "24px",
    border: "1.5px solid #f1f5f9",
    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
    marginBottom: "24px",
  },
  sectionHeading: {
    fontSize: "1.1rem",
    fontWeight: "900",
    color: "#1e3a8a",
    marginBottom: "20px",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  tr: {
    transition: "all .2s",
  },
  badge: {
    padding: "4px 10px",
    borderRadius: "8px",
    fontSize: "0.72rem",
    fontWeight: "800",
  },
  btnPrimary: {
    background: "#2563eb",
    color: "#fff",
    border: "none",
    padding: "12px 24px",
    borderRadius: "14px",
    fontWeight: "900",
    fontSize: "0.9rem",
    cursor: "pointer",
    transition: "all .3s",
    boxShadow: "0 10px 20px rgba(37,99,235,0.2)",
  },
};

/* ─── CUSTOM CHART COMPONENTS ────────────────────────── */

const SapphireLineChart = ({ data = [] }) => {
  if (!data || data.length === 0) {
    return (
      <div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "#64748b", fontSize: "0.8rem" }}>
        No activity data available
      </div>
    );
  }

  const maxValue = Math.max(...data.map(d => d.value), 100);
  const width = 500;
  const height = 150;
  const padding = 20;

  // Generate points
  const points = data.map((d, i) => {
    const x = (i / (data.length - 1)) * (width - 2 * padding) + padding;
    const y = height - ((d.value / maxValue) * (height - 2 * padding) + padding);
    return { x, y, value: d.value };
  });

  // Create SVG path
  let pathD = `M ${points[0].x} ${points[0].y}`;
  for (let i = 0; i < points.length - 1; i++) {
    const curr = points[i];
    const next = points[i + 1];
    const cp1x = curr.x + (next.x - curr.x) / 2;
    pathD += ` C ${cp1x} ${curr.y}, ${cp1x} ${next.y}, ${next.x} ${next.y}`;
  }

  const fillPathD = `${pathD} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`;

  return (
    <svg viewBox={`0 0 ${width} ${height}`} style={{ width: "100%", height: "100%", overflow: "visible" }}>
      <defs>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#2563eb" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563eb" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={fillPathD} fill="url(#lineGrad)" stroke="none" />
      <path d={pathD} fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" />
      {points.map((p, i) => (
        <g key={i}>
          <circle cx={p.x} cy={p.y} r="3" fill="#fff" stroke="#2563eb" strokeWidth="1.5" />
          {i === points.length - 1 && (
            <>
              <text x={p.x - 20} y={p.y - 15} fontSize="12" fontWeight="950" fill="#1e3a8a">
                {p.value.toLocaleString()} Units
              </text>
            </>
          )}
        </g>
      ))}
    </svg>
  );
};

const SapphireHorizontalBar = ({ name, value, color, maxValue = 100, labelSuffix = "" }) => (
  <div style={{ marginBottom: "16px" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
      <span style={{ fontSize: "0.8rem", fontWeight: "800", color: "#64748b" }}>{name}</span>
      <span style={{ fontSize: "0.8rem", fontWeight: "950", color: "#0f172a" }}>{value}{labelSuffix}</span>
    </div>
    <div style={{ height: "10px", width: "100%", background: "#f1f5f9", borderRadius: "10px", overflow: "hidden" }}>
      <div style={{ height: "100%", width: `${(value / maxValue) * 100}%`, background: color, borderRadius: "10px", transition: "width 1s ease" }} />
    </div>
  </div>
);

const SapphireDonut = ({ data, centerValue }) => {
  const total = data.reduce((a, b) => a + b.val, 0);
  let cum = 0;
  return (
    <div style={{ position: "relative", width: "150px", height: "150px", margin: "0 auto" }}>
      <svg viewBox="0 0 40 40" style={{ width: "100%", height: "100%", transform: "rotate(-90deg)" }}>
        {data.map((item, i) => {
          const per = (item.val / total) * 100;
          const offset = 100 - cum;
          cum += per;
          return (
            <circle key={i} cx="20" cy="20" r="15.915" fill="none" stroke={item.color} strokeWidth="6" strokeDasharray={`${per} ${100-per}`} strokeDashoffset={offset} />
          );
        })}
      </svg>
      <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", textAlign: "center" }}>
        <span style={{ fontSize: "1.2rem", fontWeight: "950", color: "#0f172a" }}>{centerValue || (total + "%")}</span>
      </div>
    </div>
  );
};

function Dashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const [role, setRole] = useState("");
  const [activeItem, setActiveItem] = useState("Dashboard");
  const [refreshToggle, setRefreshToggle] = useState(0);
  
  // 📦 Load Real Data from Backend
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    total_assets: 0,
    total_value: 0,
    critical_stock: 0,
    movement_flow: 0
  });
  const [topSelling, setTopSelling] = useState([]);
  const [criticalList, setCriticalList] = useState([]);
  const [salesTrend, setSalesTrend] = useState([]);
  const [categoryDist, setCategoryDist] = useState([]);
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [stockItems, setStockItems] = useState([]);

  useEffect(() => {
    // 🛡️ Role Guard
    const savedRole = localStorage.getItem("role");
    if (!savedRole) {
      navigate("/");
    } else {
      setRole(savedRole);
    }

    // 🚀 Handle navigation state from other pages
    if (location.state?.activeItem) {
      setActiveItem(location.state.activeItem);
    }

    const fetchData = async () => {
      // 🚀 Allow fetching if we are on Dashboard or Update Stock
      const viewsNeedingData = ["Dashboard", "Update Stock"];
      if (!viewsNeedingData.includes(activeItem)) return;
      
      try {
        setLoading(true);
        const token = localStorage.getItem("access_token");
        const headers = { Authorization: `Bearer ${token}` };
        
        // 🔍 Run System Audit (one-time check on load)
        axios.post("http://127.0.0.1:5000/api/notifications/audit", {}, { headers }).catch(() => {});

        const fetchWithCatch = async (url) => {
          try {
            // 🚀 Add cache-busting timestamp to every request
            const separator = url.includes("?") ? "&" : "?";
            const cacheBustedUrl = `${url}${separator}t=${Date.now()}`;
            const res = await axios.get(cacheBustedUrl, { headers });
            return res.data;
          } catch (e) {
            console.error(`Failed to fetch ${url}:`, e);
            return null;
          }
        };

        const [prodData, orderData, txnData, sumData, velocityData, criticalData, trendData, catData, suppData] = await Promise.all([
          fetchWithCatch("http://127.0.0.1:5000/api/products/"),
          fetchWithCatch("http://127.0.0.1:5000/api/orders/"),
          fetchWithCatch("http://127.0.0.1:5000/api/transactions/"),
          fetchWithCatch("http://127.0.0.1:5000/api/reports/summary"),
          fetchWithCatch("http://127.0.0.1:5000/api/reports/velocity"),
          fetchWithCatch("http://127.0.0.1:5000/api/reports/critical-list"),
          fetchWithCatch("http://127.0.0.1:5000/api/reports/sales-trend"),
          fetchWithCatch("http://127.0.0.1:5000/api/reports/category-distribution"),
          fetchWithCatch("http://127.0.0.1:5000/api/suppliers/")
        ]);

        if (prodData) {
          setProducts(prodData);
          // 📦 Map real products to the Stock Adjustment table
          setStockItems(prodData.map(p => ({
            id: p.id,
            name: p.name,
            stock: p.current,
            total: p.total,
            sec: p.category || "General", // Using category as the warehouse section
            adjustment: 0
          })));
        }
        if (orderData) setOrders(orderData);
        if (txnData) setTransactions(txnData);
        if (sumData) setSummary(sumData);
        if (velocityData) setTopSelling(velocityData);
        if (criticalData) setCriticalList(criticalData);
        if (trendData) setSalesTrend(trendData);
        if (catData) setCategoryDist(catData);
        if (suppData) setSuppliers(suppData);
      } catch (err) {
        console.error("Dashboard global fetch failed:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();

    /* Inject Design Assets */
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
  }, [navigate, activeItem, refreshToggle]);

  const handleLogout = () => {
    localStorage.removeItem("role");
    navigate("/");
  };

  const roleConfigs = {
    admin: {
      color: "#6366f1",
      icon: "🛡️",
      label: "System Administrator",
      menu: ["Dashboard", "Manage Products", "User Roles", "Audit Logs", "System Config", "Update Stock", "Transaction History"]
    },
    manager: {
      color: "#2563eb",
      icon: "📦",
      label: "Operations Manager",
      menu: ["Dashboard", "Manage Products", "Stock Orders", "Inventory Reports", "Suppliers", "Update Stock", "Transaction History"]
    },
    staff: {
      color: "#0ea5e9",
      icon: "🧑‍💼",
      label: "Inventory Staff",
      menu: ["Dashboard", "Product Search", "Update Stock", "Transaction History"]
    }
  };

  const handleMenuClick = (m) => {
    // 🔄 Force a data refresh every time a menu item is clicked
    setRefreshToggle(prev => prev + 1);

    if (m === "Manage Products" || m === "Product Search") {
      navigate("/products");
    }
    if (m === "Stock Orders") {
      navigate("/orders");
    }
    if (m === "Inventory Reports") {
      navigate("/reports");
    }
    if (m === "Transaction History") {
      navigate("/transactions");
    }
    if (m === "Suppliers") {
      navigate("/dashboard", { state: { activeItem: "Suppliers" } });
    }

    const dashboardItems = ["Dashboard", "Update Stock", "User Roles", "Audit Logs", "System Config"];
    if (dashboardItems.includes(m)) {
      setActiveItem(m);
    }
  };

  const current = roleConfigs[role?.toLowerCase()] || roleConfigs.staff;

  const activities = [
    { id: "TX-9012", item: "Corporate Workstation", type: "Received", count: "14 Units", user: "John (Staff)", date: "2 mins ago", status: "Success" },
    { id: "TX-9011", item: "Logitech MX Master 3S", type: "Dispatch", count: "02 Units", user: "System", date: "15 mins ago", status: "Success" },
    { id: "TX-9010", item: "MacBook Pro M3 Max", type: "Stock Adj.", count: "01 Unit", user: "Sarah (Mgr)", date: "1 hour ago", status: "Flagged" },
    { id: "TX-9009", item: "UltraSharp Display 32\"", type: "Received", count: "08 Units", user: "John (Staff)", date: "3 hours ago", status: "Success" },
  ];

  const renderGlobalHeader = () => (
    <Navbar role={role} />
  );

  const renderDashboard = () => {
    return (
      <>
        <div style={S.kpiGrid} className="it-fade-up">
          {/* Total Assets Value */}
          <div style={S.kpiCard("#2563eb")}>
            <span style={S.kpiLabel}>Inventory Value</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#1e40af" }}>${summary.total_value.toLocaleString()}</h2>
              <span style={S.kpiTrend(true)}>↑ 100%</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>Live Global Valuation</p>
          </div>
          {/* Total Assets Count */}
          <div style={S.kpiCard("#10b981")}>
            <span style={S.kpiLabel}>Operational Assets</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#065f46" }}>{summary.total_assets}</h2>
              <span style={S.kpiTrend(true)}>Active</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>Units in Vault</p>
          </div>
          {/* Critical Items */}
          <div style={S.kpiCard("#ef4444")}>
            <span style={S.kpiLabel}>Critical Stock</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#991b1b" }}>{summary.critical_stock}</h2>
              <span style={S.kpiTrend(false)}>Alert</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>Below Reorder Point</p>
          </div>
          {/* Movement Flow */}
          <div style={S.kpiCard("#f59e0b")}>
            <span style={S.kpiLabel}>Recent In-Flows</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#92400e" }}>{summary.movement_flow}</h2>
              <span style={S.kpiTrend(true)}>↑</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>Transactions (7d)</p>
          </div>
        </div>

        <div style={S.analyticsGrid} className="it-fade-up it-delay-1">
          <div style={S.standardCard("#2563eb")}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "26px" }}>
              <div>
                <h3 style={{ ...S.cardTitle, marginBottom: "4px" }}>Inventory Activity Trend</h3>
                <h1 style={{ fontSize: "1.85rem", fontWeight: "950", color: "#1e3a8a", letterSpacing: "-1px" }}>
                  {salesTrend.reduce((acc, curr) => acc + curr.value, 0).toLocaleString()} <span style={{ fontSize: "0.9rem", color: "#64748b" }}>Units Moved</span>
                </h1>
              </div>
              <select style={{ padding: "10px 14px", borderRadius: "12px", border: "1.5px solid #f1f5f9", fontSize: "0.8rem", fontWeight: "800", outline: "none", color: "#475569" }}>
                <option>Last 7 Days</option>
              </select>
            </div>
            <div style={{ height: "220px", width: "100%" }}>
              <SapphireLineChart data={salesTrend} />
            </div>
          </div>

          <div style={S.standardCard("#3b82f6")}>
             <h3 style={S.cardTitle}>Top Moving Products</h3>
             <div style={{ paddingTop: "8px" }}>
               {topSelling.length > 0 ? (
                 topSelling.map((item, i) => (
                   <SapphireHorizontalBar 
                     key={i} 
                     name={item.name} 
                     value={item.count} 
                     maxValue={Math.max(...topSelling.map(t => t.count), 1)} 
                     color={["#2563eb", "#3b82f6", "#60a5fa", "#93c5fd", "#bfdbfe"][i % 5]} 
                     labelSuffix=" mvmt"
                   />
                 ))
               ) : (
                 <p style={{ color: "#64748b", fontSize: "0.85rem" }}>No movement data</p>
               )}
             </div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr", gap: "24px" }} className="it-fade-up it-delay-2">
            {/* Replenishment Alerts */}
            <div style={S.standardCard("#ef4444")}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
                <h3 style={S.cardTitle}>Replenishment Alerts</h3>
                <button style={{ background: "rgba(37,99,235,0.08)", border: "none", color: "#2563eb", fontWeight: "900", fontSize: "0.78rem", cursor: "pointer", padding: "6px 14px", borderRadius: "10px" }} onClick={() => navigate("/products")}>View Inventory</button>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                {criticalList.length > 0 ? criticalList.map((row, i) => (
                  <div key={i} style={{ padding: "18px", borderRadius: "18px", background: "rgba(239, 68, 68, 0.03)", border: "1.5px solid rgba(239, 68, 68, 0.1)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                      <div style={{ width: "12px", height: "12px", borderRadius: "4px", background: "#ef4444", boxShadow: "0 0 10px rgba(239,68,68,0.4)" }} />
                      <div>
                        <p style={{ fontWeight: 800, fontSize: "0.95rem", color: "#1e293b", margin: 0 }}>{row.name}</p>
                        <p style={{ fontSize: "0.75rem", fontWeight: 700, color: "#64748b", margin: "2px 0 0" }}>Threshold: 5 Units</p>
                      </div>
                    </div>
                    <div style={{ textAlign: "right" }}>
                      <p style={{ fontSize: "0.82rem", fontWeight: 950, color: "#ef4444", margin: 0 }}>{row.qty} LEFT</p>
                      <button 
                        onClick={() => navigate("/orders", { state: { preSelectedProduct: row.sku } })}
                        style={{ background: "none", border: "none", padding: 0, color: "#dc2626", fontSize: "0.75rem", fontWeight: "900", textDecoration: "underline", cursor: "pointer", marginTop: "4px" }}
                      >
                        ORDER NOW
                      </button>
                    </div>
                  </div>
                )) : (
                  <div style={{ padding: "40px", textAlign: "center", color: "#94a3b8", fontWeight: 800 }}>
                    ✅ ALL STOCK LEVELS HEALTHY
                  </div>
                )}
              </div>
            </div>

           {/* Stats Donut 1 */}
           <div style={S.standardCard("#f59e0b")}>
             <h3 style={S.cardTitle}>Category Distribution</h3>
             <div style={{ padding: "10px 0" }}>
              <SapphireDonut 
                data={categoryDist.length > 0 ? categoryDist : [{val: 100, color: "#f1f5f9"}]} 
              />
             </div>
             <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr", gap: "10px", maxHeight: "100px", overflowY: "auto" }}>
                {categoryDist.map((cat, i) => (
                  <div key={i} style={{ fontSize: "0.78rem", color: "#475569", fontWeight: "850", display: "flex", alignItems: "center", gap: "8px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: cat.color }} /> {cat.name} ({Math.round((cat.val / categoryDist.reduce((a,b)=>a+b.val, 0)) * 100)}%)
                  </div>
                ))}
             </div>
           </div>

           {/* Stats Donut 2 */}
           <div style={S.standardCard("#10b981")}>
             <h3 style={S.cardTitle}>Recent Activity</h3>
             <div style={{ padding: "10px 0" }}>
              <SapphireDonut 
                centerValue={transactions.length.toString()}
                data={[
                  {val: transactions.filter(t => t.transaction_type === 'SALE').length, color: "#10b981"},
                  {val: transactions.filter(t => t.transaction_type === 'RESTOCK').length, color: "#2563eb"},
                  {val: transactions.filter(t => t.transaction_type !== 'SALE' && t.transaction_type !== 'RESTOCK').length, color: "#6366f1"}
                ]} 
              />
             </div>
             <div style={{ marginTop: "12px", display: "grid", gridTemplateColumns: "1fr", gap: "10px" }}>
                <div style={{ fontSize: "0.78rem", color: "#475569", fontWeight: "850", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} /> Sales
                </div>
                <div style={{ fontSize: "0.78rem", color: "#475569", fontWeight: "850", display: "flex", alignItems: "center", gap: "8px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#2563eb" }} /> Restocks
                </div>
             </div>
           </div>
        </div>
      </>
    );
  };

  const renderStaffDashboard = () => {
    return (
      <div className="it-fade-up">
        <div style={S.kpiGrid}>
          <div style={S.kpiCard("#10b981")}>
            <span style={S.kpiLabel}>Total Assets</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#065f46" }}>{summary.total_assets}</h2>
              <span style={S.kpiTrend(true)}>Live</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>In central database</p>
          </div>

          <div style={S.kpiCard("#f59e0b")}>
            <span style={S.kpiLabel}>Critical Stock</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#92400e" }}>{summary.critical_stock}</h2>
              <span style={S.kpiTrend(summary.critical_stock > 0)}>Alert</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>Items below threshold (5)</p>
          </div>

          <div style={S.kpiCard("#2563eb")}>
            <span style={S.kpiLabel}>Verified Orders</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#1e40af" }}>{orders.length}</h2>
              <span style={S.kpiTrend(true)}>Active</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>System authenticated</p>
          </div>

          <div style={S.kpiCard("#6366f1")}>
            <span style={S.kpiLabel}>Total Movements</span>
            <div style={{ display: "flex", alignItems: "baseline", gap: "12px" }}>
              <h2 style={{ ...S.kpiValue, color: "#3730a3" }}>{summary.movement_flow}</h2>
              <span style={{ ...S.kpiTrend(true), background: "rgba(99,102,241,0.1)", color: "#6366f1" }}>7 Days</span>
            </div>
            <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: "700" }}>Global activity flow</p>
          </div>
        </div>

        <div style={S.analyticsGrid} className="it-delay-1">
          <div style={S.standardCard("#2563eb")}>
            <h3 style={S.cardTitle}>Daily Distribution Trend</h3>
            <div style={{ height: "220px" }}>
              <SapphireLineChart data={salesTrend} />
            </div>
          </div>
          <div style={S.standardCard("#10b981")}>
          <h3 style={S.cardTitle}>Recent Status</h3>
          <div style={{ padding: "10px 0" }}>
            <SapphireDonut 
              centerValue="100%"
              data={[
                {val: transactions.length, color: "#10b981"},
                {val: criticalList.length, color: "#ef4444"}
              ]} 
            />
          </div>
          <div style={{ marginTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={{ fontSize: "0.78rem", color: "#475569", fontWeight: "850", display: "flex", alignItems: "center", gap: "8px" }}>
               <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#10b981" }} /> Total Transactions ({transactions.length})
            </div>
            <div style={{ fontSize: "0.78rem", color: "#475569", fontWeight: "850", display: "flex", alignItems: "center", gap: "8px" }}>
               <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#ef4444" }} /> Critical Items ({criticalList.length})
            </div>
          </div>
        </div>
      </div>

      <div style={S.standardCard("#6366f1")} className="it-delay-2">
         <h3 style={S.cardTitle}>Your Recent Activity Trail</h3>
         <table style={S.table}>
           <thead>
             <tr>
               <th style={S.th}>ID</th>
               <th style={S.th}>Asset</th>
               <th style={S.th}>Type</th>
               <th style={S.th}>Qty</th>
               <th style={S.th}>Timestamp</th>
             </tr>
           </thead>
           <tbody>
             {transactions.slice(0, 5).map((row, i) => (
               <tr key={i}>
                 <td style={S.td}>{row.id}</td>
                 <td style={S.td}>{row.product?.name || `Product #${row.product_id}`}</td>
                 <td style={S.td}>
                   <span style={{ 
                     padding: "4px 8px", 
                     background: row.transaction_type === 'SALE' ? "#dcfce7" : "#f1f5f9", 
                     color: row.transaction_type === 'SALE' ? "#166534" : "#475569",
                     borderRadius: "8px", 
                     fontSize: "0.7rem", 
                     fontWeight: "900" 
                   }}>
                     {row.transaction_type}
                   </span>
                 </td>
                 <td style={S.td}>{row.quantity}</td>
                 <td style={S.td}>{new Date(row.timestamp).toLocaleString()}</td>
               </tr>
             ))}
           </tbody>
         </table>
      </div>
    </div>
  );
};


  const renderUserRoles = () => (
    <div style={S.activitySection}>
      <div style={S.sectionHeading}>👥 Team Roles & Permissions</div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>User</th>
            <th style={S.th}>Email</th>
            <th style={S.th}>Role</th>
            <th style={S.th}>Access Level</th>
            <th style={S.th}>Status</th>
            <th style={S.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {[
            { name: "John Doe", email: "john@inventrack.com", role: "Manager", access: "Operations", status: "Active", color: "#2563eb" },
            { name: "Sarah Smith", email: "sarah@inventrack.com", role: "Admin", access: "Full Control", status: "Active", color: "#6366f1" },
            { name: "Mike Ross", email: "mike@inventrack.com", role: "Staff", access: "Restricted", status: "Away", color: "#0ea5e9" },
          ].map((u, i) => (
            <tr key={i} style={S.tr}>
              <td style={{ ...S.td, borderRadius: "12px 0 0 12px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                  <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: u.color, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>
                    {u.name.split(" ").map(n => n[0]).join("")}
                  </div>
                  {u.name}
                </div>
              </td>
              <td style={S.td}>{u.email}</td>
              <td style={S.td}>
                <span style={{ ...S.badge, background: u.color + "20", color: u.color }}>{u.role}</span>
              </td>
              <td style={S.td}>{u.access}</td>
              <td style={S.td}>
                <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                  <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: u.status === "Active" ? "#10b981" : "#94a3b8" }} />
                  {u.status}
                </div>
              </td>
              <td style={{ ...S.td, borderRadius: "0 12px 12px 0" }}>
                <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}>Edit Access</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderAuditLogs = () => (
    <div style={S.activitySection}>
      <div style={S.sectionHeading}>📜 System Audit Trail</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          { icon: "🔐", title: "Security Login", desc: "Admin Sarah logged in from IP 192.168.1.45", time: "Just now", color: "#6366f1" },
          { icon: "📝", title: "Asset Modified", desc: "Manager John updated stock for Nvidia RTX 4090", time: "12 mins ago", color: "#2563eb" },
          { icon: "⚙️", title: "Global Config", desc: "System updated LIFO valuation method", time: "1 hour ago", color: "#475569" },
          { icon: "🚢", title: "Shipment Dispatched", desc: "Batch #TX-9011 cleared for regional logistics", time: "2 hours ago", color: "#10b981" },
        ].map((l, i) => (
          <div key={i} style={{ display: "flex", gap: "20px", padding: "20px", background: "#f8fafc", borderRadius: "20px", border: "1px solid #e2e8f0" }}>
            <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: l.color + "15", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.2rem", flexShrink: 0 }}>
              {l.icon}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                <span style={{ fontWeight: 800, color: "#1e293b" }}>{l.title}</span>
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8" }}>{l.time}</span>
              </div>
              <p style={{ fontSize: "0.9rem", color: "#64748b" }}>{l.desc}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderSystemConfig = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
      <div style={S.activitySection}>
        <div style={S.sectionHeading}>🔔 Notifications</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          {[
            { label: "Low Stock Emails", desc: "Alert managers when assets hit threshold", active: true },
            { label: "Daily Operations Digest", desc: "Summary of activities at 8:00 AM", active: true },
            { label: "Audit Log Alerts", desc: "Notify on critical system changes", active: false },
          ].map((t, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <p style={{ fontWeight: 800, fontSize: "0.92rem" }}>{t.label}</p>
                <p style={{ fontSize: "0.8rem", color: "#64748b" }}>{t.desc}</p>
              </div>
              <div style={{ width: "44px", height: "24px", borderRadius: "12px", background: t.active ? "#2563eb" : "#cbd5e1", position: "relative", cursor: "pointer" }}>
                <div style={{ width: "18px", height: "18px", borderRadius: "50%", background: "#fff", position: "absolute", top: "3px", left: t.active ? "23px" : "3px", transition: "all .2s" }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div style={S.activitySection}>
        <div style={S.sectionHeading}>📈 Valuation Method</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {["FIFO (First-In, First-Out)", "LIFO (Last-In, First-Out)", "Weighted Average Cost"].map((m, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px", background: i === 0 ? "#eff6ff" : "transparent", borderRadius: "12px", border: i === 0 ? "1.5px solid #2563eb" : "1.5px solid transparent", cursor: "pointer" }}>
              <div style={{ width: "20px", height: "20px", borderRadius: "50%", border: "2px solid #2563eb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                {i === 0 && <div style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#2563eb" }} />}
              </div>
              <span style={{ fontWeight: 700, fontSize: "0.9rem", color: i === 0 ? "#1e40af" : "#64748b" }}>{m}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderStockOrders = () => (
    <div style={S.activitySection}>
      <div style={S.sectionHeading}>📦 Active Purchase Orders</div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Order ID</th>
            <th style={S.th}>Supplier</th>
            <th style={S.th}>Date</th>
            <th style={S.th}>Inventory Value</th>
            <th style={S.th}>Status</th>
            <th style={S.th}>Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o, i) => {
            const statusColors = {
              "Approved": "#2563eb",
              "Pending": "#f59e0b",
              "Received": "#10b981",
              "Cancelled": "#ef4444"
            };
            const color = statusColors[o.status] || "#64748b";
            return (
              <tr key={i} style={S.tr}>
                <td style={{ ...S.td, borderRadius: "12px 0 0 12px", color: "#2563eb" }}>{o.order_id}</td>
                <td style={S.td}>{o.supplier}</td>
                <td style={S.td}>{o.date}</td>
                <td style={S.td}>{o.value}</td>
                <td style={S.td}>
                  <span style={{ ...S.badge, background: color + "20", color: color }}>{o.status}</span>
                </td>
                <td style={{ ...S.td, borderRadius: "0 12px 12px 0" }}>
                  <button style={{ background: "none", border: "none", color: "#2563eb", fontWeight: "700", cursor: "pointer", fontSize: "0.85rem" }}>View Invoice</button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );

  const renderInventoryReports = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "24px" }}>
      <div style={S.activitySection}>
        <div style={S.sectionHeading}>📊 Category Distribution</div>
        <div style={{ height: "240px", display: "flex", alignItems: "flex-end", gap: "24px", padding: "20px 0" }}>
          {[
            { label: "Hardware", value: 85, color: "#6366f1" },
            { label: "Monitors", value: 45, color: "#2563eb" },
            { label: "Peripheral", value: 65, color: "#0ea5e9" },
            { label: "Furniture", value: 30, color: "#94a3b8" },
          ].map((bar, i) => (
            <div key={i} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-end", height: "100%", gap: "12px" }}>
              <div style={{ width: "100%", height: bar.value + "%", background: bar.color, borderRadius: "10px 10px 4px 4px", boxShadow: "0 4px 12px rgba(0,0,0,0.1)" }} />
              <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#94a3b8", textAlign: "center" }}>{bar.label}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={S.activitySection}>
        <div style={S.sectionHeading}>📥 Ready to Export</div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {[
            { title: "Monthly Stock Valuation", date: "Apr 2026", size: "2.4 MB" },
            { title: "Deficit Alert Summary", date: "Today", size: "0.8 MB" },
            { title: "Supplier Lead-Time Report", date: "Mar 2026", size: "1.2 MB" },
          ].map((repo, i) => (
            <div key={i} style={{ display: "flex", alignItems: "center", justifySpace: "space-between", padding: "16px", background: "#f8fafc", borderRadius: "16px", border: "1px solid #e2e8f0" }}>
              <div style={{ flex: 1 }}>
                <p style={{ fontWeight: 800, fontSize: "0.9rem" }}>{repo.title}</p>
                <p style={{ fontSize: "0.75rem", color: "#94a3b8" }}>{repo.date} • {repo.size}</p>
              </div>
              <button style={{ color: "#2563eb", fontWeight: 700, fontSize: "0.8rem", background: "none", border: "none", cursor: "pointer" }}>Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderSuppliers = () => (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "24px" }} className="it-fade-up">
      {suppliers.length > 0 ? suppliers.map((supp, i) => (
        <div key={supp.id || i} style={{ ...S.statCard, padding: "32px", cursor: "pointer" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "0 12px 24px rgba(0,0,0,0.06)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = "none"; }}>
           <div style={{ fontSize: "2rem", marginBottom: "16px" }}>🏢</div>
           <h4 style={{ fontSize: "1.2rem", fontWeight: 800, marginBottom: "4px" }}>{supp.name}</h4>
           <div style={{ display: "flex", gap: "8px", marginBottom: "16px" }}>
             <span style={{ fontSize: "0.75rem", fontWeight: 800, color: "#64748b", background: "#f1f5f9", padding: "4px 8px", borderRadius: "6px" }}>{supp.category}</span>
           </div>
           <div style={{ marginBottom: "16px" }}>
             <p style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 700 }}>{supp.contact_email}</p>
           </div>
           <div style={{ display: "flex", justifyContent: "space-between", borderTop: "1px solid #f1f5f9", paddingTop: "16px" }}>
             <div>
               <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Avg Lead Time</p>
               <p style={{ fontWeight: 800 }}>{supp.lead_time}</p>
             </div>
             <div style={{ textAlign: "right" }}>
               <p style={{ fontSize: "0.7rem", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase" }}>Performance</p>
               <p style={{ fontWeight: 800, color: "#16a34a" }}>⭐ {supp.performance_rating}</p>
             </div>
           </div>
        </div>
      )) : (
        <div style={{ gridColumn: "1 / -1", padding: "100px", textAlign: "center", color: "#94a3b8", fontWeight: 800 }}>
          NO SUPPLIERS REGISTERED IN VAULT
        </div>
      )}
    </div>
  );


  const renderUpdateStock = () => (
    <div style={S.activitySection}>
      <div style={S.sectionHeading}>📦 Rapid Stock Adjustment</div>
      <table style={S.table}>
        <thead>
          <tr>
            <th style={S.th}>Asset Item</th>
            <th style={S.th}>Total Quantity</th>
            <th style={S.th}>Current Stock</th>
            <th style={S.th}>Adjustment</th>
            <th style={S.th}>Warehouse Sec.</th>
            <th style={S.th}>Action</th>
          </tr>
        </thead>
        <tbody>
          {stockItems.map((item, i) => (
            <tr key={item.id} style={S.tr}>
              <td style={{ ...S.td, borderRadius: "12px 0 0 12px", fontWeight: 800 }}>{item.name}</td>
              <td style={{ ...S.td, color: "#64748b" }}>{item.total} Units</td>
              <td style={{ ...S.td, fontWeight: 700, color: "#2563eb" }}>{item.stock} Units</td>
              <td style={S.td}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <button onClick={() => {
                    setStockItems(prev => prev.map(p => p.id === item.id ? { ...p, adjustment: p.adjustment - 1 } : p))
                  }} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #e2e8f0", background: "#fff", cursor: "pointer", fontWeight: 900 }}>-</button>
                  <span style={{ fontWeight: 900, fontSize: "1.1rem", width: "24px", textAlign: "center", color: item.adjustment > 0 ? "#16a34a" : item.adjustment < 0 ? "#dc2626" : "#0f172a" }}>
                    {item.adjustment > 0 ? `+${item.adjustment}` : item.adjustment}
                  </span>
                  <button onClick={() => {
                    setStockItems(prev => prev.map(p => p.id === item.id ? { ...p, adjustment: p.adjustment + 1 } : p))
                  }} style={{ width: "32px", height: "32px", borderRadius: "8px", border: "1.5px solid #2563eb", background: "#eff6ff", cursor: "pointer", color: "#2563eb", fontWeight: 900 }}>+</button>
                </div>
              </td>
              <td style={S.td}>{item.sec}</td>
              <td style={{ ...S.td, borderRadius: "0 12px 12px 0" }}>
                <button onClick={async () => {
                    if (item.adjustment === 0) return;
                    
                    try {
                      const token = localStorage.getItem("access_token");
                      await axios.post("http://127.0.0.1:5000/api/transactions/", {
                        product_id: item.id,
                        quantity: item.adjustment,
                        transaction_type: item.adjustment > 0 ? "RESTOCK" : "ADJUSTMENT",
                        notes: "Rapid stock adjustment from dashboard"
                      }, {
                        headers: { Authorization: `Bearer ${token}` }
                      });
                      
                      // 🔄 Force refresh dashboard data
                      setRefreshToggle(prev => prev + 1);
                      
                      // Clear adjustment in UI
                      setStockItems(prev => prev.map(p => p.id === item.id ? { ...p, stock: p.stock + p.adjustment, adjustment: 0 } : p));
                    } catch (err) {
                      console.error("Failed to commit adjustment:", err);
                      alert("Error updating stock. Check console.");
                    }
                }} style={{ background: item.adjustment === 0 ? "#cbd5e1" : "#0f172a", color: "#fff", padding: "8px 16px", borderRadius: "10px", border: "none", fontWeight: 700, cursor: item.adjustment === 0 ? "not-allowed" : "pointer", fontSize: "0.85rem", transition: "all .2s" }}>
                  Commit
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );

  const renderTransactionHistory = () => (
    <div style={S.activitySection}>
      <div style={S.sectionHeading}>📅 Personal Activity Log</div>
      <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
        {[
          { type: "Sale", msg: "Sold 1x MacBook Pro M3 Max", time: "10 mins ago", value: "-$3,499.00", icon: "💰" },
          { type: "Adjustment", msg: "Inventory Correction (+5 Units)", time: "1 hour ago", value: "+$495.00", icon: "🔄" },
          { type: "Stock Update", msg: "Received Batch #TX-9012 (Peripherals)", time: "3 hours ago", value: "Verified", icon: "📦" },
          { type: "Sale", msg: "Sold 5x MX Master 3S Mouse", time: "Yesterday", value: "-$495.00", icon: "💰" },
        ].map((tx, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: "20px", padding: "18px", background: "#fff", border: "1.5px solid #f1f5f9", borderRadius: "20px" }}>
             <div style={{ fontSize: "1.4rem" }}>{tx.icon}</div>
             <div style={{ flex: 1 }}>
               <p style={{ fontWeight: 800, fontSize: "0.95rem" }}>{tx.msg}</p>
               <p style={{ color: "#94a3b8", fontSize: "0.75rem", fontWeight: 700 }}>{tx.time} • Local Terminal #04</p>
             </div>
             <div style={{ textAlign: "right" }}>
               <p style={{ fontWeight: 900, fontSize: "1rem", color: tx.type === "Sale" ? "#16a34a" : "#2563eb" }}>{tx.value}</p>
               <span style={{ fontSize: "0.7rem", fontWeight: 800, textTransform: "uppercase", letterSpacing: "0.5px", color: "#94a3b8" }}>{tx.type}</span>
             </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderContent = () => {
    // 🛡️ Security Guard: Check if the current role is authorized for the active item
    const isAuthorized = current.menu.includes(activeItem);
    
    if (!isAuthorized) {
      return (
        <div style={{ padding: "40px", textAlign: "center", background: "#fef2f2", borderRadius: "24px", border: "1.5px solid #ef4444" }}>
          <h3 style={{ color: "#991b1b", fontWeight: 800 }}>⚠️ Security Restriction</h3>
          <p style={{ color: "#b91c1c", marginTop: "8px" }}>Your current profile (<strong>{role}</strong>) does not have authorization to access the <strong>{activeItem}</strong> module.</p>
          <button style={{ ...S.btnPrimary, background: "#ef4444", marginTop: "20px" }} onClick={() => setActiveItem("Dashboard")}>Return to Safe Zone</button>
        </div>
      );
    }

    if (activeItem === "Dashboard") {
      return role === "staff" ? renderStaffDashboard() : renderDashboard();
    }
    
    if (activeItem === "User Roles") return renderUserRoles();
    if (activeItem === "Audit Logs") return renderAuditLogs();
    if (activeItem === "System Config") return renderSystemConfig();
    
    // Manager Views
    if (activeItem === "Stock Orders") return renderStockOrders();
    if (activeItem === "Inventory Reports") return renderInventoryReports();
    if (activeItem === "Suppliers") return renderSuppliers();

    // Staff Views

    if (activeItem === "Update Stock") return renderUpdateStock();
    if (activeItem === "Transaction History") return renderTransactionHistory();

    return (
      <div style={{ 
        display: "flex", flexDirection: "column", alignItems: "center", 
        justifyContent: "center", height: "60vh", background: "#fff", 
        borderRadius: "24px", border: "1.5px dashed #cbd5e1" 
      }}>
        <div style={{ fontSize: "3rem", marginBottom: "20px" }}>🚀</div>
        <h3 style={{ fontSize: "1.5rem", fontWeight: "800", marginBottom: "10px" }}>{activeItem} is Coming Soon</h3>
        <p style={{ color: "#64748b", maxWidth: "400px", textAlign: "center" }}>
          We are currently building the <strong>{activeItem}</strong> module to give you deeper insights into your manufacturing logistics. 
        </p>
      </div>
    );
  };

  return (
    <div style={S.root}>
      {/* ── Sidebar ── */}
      <Sidebar 
        role={role} 
        activeItem={activeItem} 
        onMenuClick={handleMenuClick} 
        onLogout={handleLogout} 
      />

      {/* ── Main ── */}
      <main style={S.main}>
        {renderGlobalHeader()}
        {renderContent()}
        <Footer />
      </main>
    </div>
  );
}

export default Dashboard;