import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
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
  headerLeft: { display: "flex", flexDirection: "column", gap: "6px" },
  breadcrumb: {
    display: "flex", alignItems: "center", gap: "8px", fontSize: "0.85rem",
    fontWeight: "700", color: "#94a3b8", cursor: "pointer",
    background: "none", border: "none", padding: 0,
  },
  h1: { fontSize: "2.25rem", fontWeight: "900", letterSpacing: "-1px" },
  btnPrimary: {
    padding: "12px 28px", borderRadius: "16px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff", fontSize: "0.95rem", fontWeight: "800", border: "none",
    cursor: "pointer", boxShadow: "0 10px 30px rgba(37,99,235,0.3)",
    transition: "all .3s",
  },
  statsGrid: {
    display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: "24px", marginBottom: "8px"
  },
  statCard: {
    padding: "24px", borderRadius: "24px", background: "#fff", border: "1.5px solid #e2e8f0",
    display: "flex", flexDirection: "column", gap: "8px", boxShadow: "0 2px 8px rgba(0,0,0,0.02)"
  },
  statLabel: { fontSize: "0.82rem", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase" },
  statValue: { fontSize: "2.2rem", fontWeight: "900" },
  tableContainer: {
    background: "#fff", borderRadius: "24px", border: "1.5px solid #e2e8f0",
    overflow: "hidden", boxShadow: "0 4px 12px rgba(0,0,0,0.02)"
  },
  table: { width: "100%", borderCollapse: "collapse" },
  th: {
    textAlign: "left", padding: "20px 24px", background: "#f8fafc",
    fontSize: "0.78rem", fontWeight: "700", color: "#94a3b8",
    textTransform: "uppercase", borderBottom: "1.5px solid #e2e8f0"
  },
  td: { padding: "20px 24px", borderBottom: "1px solid #f1f5f9", fontSize: "0.92rem", fontWeight: "600" },
  badge: { padding: "6px 12px", borderRadius: "10px", fontSize: "0.75rem", fontWeight: "800", textTransform: "uppercase" },
  actionBtn: {
    padding: "8px 14px", borderRadius: "10px", border: "1.5px solid #e2e8f0",
    background: "#fff", color: "#1d4ed8", fontSize: "0.8rem", fontWeight: "800",
    cursor: "pointer", transition: "all .2s"
  }
};

function Orders() {
  const navigate = useNavigate();
  const location = useLocation();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [products, setProducts] = useState([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [newOrder, setNewOrder] = useState({ supplier: "", product_id: "", quantity: "" });

  const role = (localStorage.getItem("role") || "Staff").toLowerCase();
  const token = localStorage.getItem("access_token");

  useEffect(() => {
    fetchData();
    // 🚀 Handle pre-selected product from Dashboard
    if (location.state?.preSelectedProduct) {
      setNewOrder(prev => ({ ...prev, product_id: location.state.preSelectedProduct }));
    }
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [ordRes, prodRes] = await Promise.all([
        axios.get("http://127.0.0.1:5000/api/orders/", { headers: { Authorization: `Bearer ${token}` } }),
        axios.get("http://127.0.0.1:5000/api/products/", { headers: { Authorization: `Bearer ${token}` } })
      ]);
      setOrders(ordRes.data);
      setProducts(prodRes.data);
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateOrder = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://127.0.0.1:5000/api/orders/", newOrder, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setIsDrawerOpen(false);
      fetchData();
    } catch (err) {
      console.error("Order creation failed:", err);
      const msg = err.response?.data?.message || "Failed to create order";
      alert(msg);
    }
  };

  const handleReceive = async (orderId) => {
    try {
      await axios.put(`http://127.0.0.1:5000/api/orders/${orderId}`, { status: "Received" }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData();
    } catch (err) {
      alert("Failed to update status");
    }
  };

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

  return (
    <div style={S.root}>
      <Sidebar role={role} activeItem="Stock Orders" onMenuClick={handleMenuClick} onLogout={() => { localStorage.clear(); navigate("/"); }} />
      
      <main style={S.main}>
        <Navbar role={role} />

        {/* ── Create Order Drawer ── */}
        {isDrawerOpen && (
          <div style={{ position: "fixed", top: 0, right: 0, width: "100%", height: "100%", zIndex: 2000, display: "flex" }}>
            <div style={{ flex: 1, background: "rgba(15, 23, 42, 0.3)", backdropFilter: "blur(8px)" }} onClick={() => setIsDrawerOpen(false)} />
            <div className="it-slide-in" style={{ width: "500px", background: "#fff", height: "100%", padding: "48px", boxShadow: "-20px 0 60px rgba(0,0,0,0.1)" }}>
              <h2 style={{ fontWeight: 950, fontSize: "1.8rem", marginBottom: "32px" }}>New Purchase Order</h2>
              <form onSubmit={handleCreateOrder} style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", marginBottom: "8px" }}>SUPPLIER NAME</label>
                  <input style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc" }} 
                    placeholder="e.g. Global Tech Hub" value={newOrder.supplier} onChange={e => setNewOrder({...newOrder, supplier: e.target.value})} required />
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", marginBottom: "8px" }}>SELECT ASSET</label>
                  <select style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                    value={newOrder.product_id} onChange={e => setNewOrder({...newOrder, product_id: e.target.value})} required>
                    <option value="">Choose a product...</option>
                    {products.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontSize: "0.8rem", fontWeight: 800, color: "#94a3b8", marginBottom: "8px" }}>QUANTITY</label>
                  <input type="number" style={{ width: "100%", padding: "14px", borderRadius: "12px", border: "1.5px solid #e2e8f0", background: "#f8fafc" }}
                    placeholder="0" value={newOrder.quantity} onChange={e => setNewOrder({...newOrder, quantity: e.target.value})} required />
                </div>
                <button type="submit" style={{ ...S.btnPrimary, marginTop: "20px", padding: "18px" }}>COMMIT ORDER</button>
              </form>
            </div>
          </div>
        )}

        <div className="it-fade-up">
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "32px" }}>
            <div style={S.headerLeft}>
              <button style={S.breadcrumb} onClick={() => navigate("/dashboard")}>← Return to Dashboard</button>
              <h1 style={S.h1}>Stock Procurement</h1>
            </div>
            <button style={S.btnPrimary} onClick={() => setIsDrawerOpen(true)}>+ New Purchase Order</button>
          </div>

          <div style={S.statsGrid}>
            <div style={S.statCard}>
              <p style={S.statLabel}>Active Orders</p>
              <h2 style={{ ...S.statValue, color: "#1d4ed8" }}>{orders.filter(o => o.status === "Pending").length}</h2>
            </div>
            <div style={S.statCard}>
              <p style={S.statLabel}>Received Assets (All Time)</p>
              <h2 style={{ ...S.statValue, color: "#16a34a" }}>{orders.filter(o => o.status === "Received").length}</h2>
            </div>
          </div>

          <div style={S.tableContainer}>
            <table style={S.table}>
              <thead>
                <tr>
                  <th style={S.th}>Order ID</th>
                  <th style={S.th}>Supplier</th>
                  <th style={S.th}>Asset Details</th>
                  <th style={S.th}>Quantity</th>
                  <th style={S.th}>Date</th>
                  <th style={S.th}>Status</th>
                  <th style={S.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr><td colSpan="7" style={{ padding: "60px", textAlign: "center", color: "#94a3b8", fontWeight: 700 }}>LOADING PROCUREMENT DATA...</td></tr>
                ) : (
                  orders.map(order => (
                    <tr key={order.id} onMouseEnter={e => e.currentTarget.style.background = "#f8fafc"} onMouseLeave={e => e.currentTarget.style.background = "transparent"}>
                      <td style={{ ...S.td, color: "#2563eb", fontWeight: 800 }}>{order.order_id}</td>
                      <td style={S.td}>{order.supplier}</td>
                      <td style={S.td}>{order.product_name}</td>
                      <td style={S.td}>{order.quantity} Units</td>
                      <td style={{ ...S.td, color: "#94a3b8" }}>{order.date}</td>
                      <td style={S.td}>
                        <span style={{ ...S.badge, background: order.status === "Pending" ? "#fef9c3" : "#dcfce7", color: order.status === "Pending" ? "#a16207" : "#166534" }}>
                          {order.status}
                        </span>
                      </td>
                      <td style={S.td}>
                        {order.status === "Pending" && (
                          <button style={S.actionBtn} onClick={() => handleReceive(order.id)}>Mark Received</button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
        <Footer />
      </main>
    </div>
  );
}

export default Orders;
