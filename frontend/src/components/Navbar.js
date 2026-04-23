import React, { useState, useEffect } from "react";
import axios from "axios";

const navbarStyles = {
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
    position: "relative",
    zIndex: 1000,
  },
  dropdown: {
    position: "absolute",
    top: "70px",
    right: "0",
    width: "320px",
    background: "#fff",
    borderRadius: "20px",
    boxShadow: "0 10px 40px rgba(0,0,0,0.12)",
    border: "1.5px solid #f1f5f9",
    padding: "16px",
    maxHeight: "400px",
    overflowY: "auto",
  }
};

function Navbar({ role }) {
  const [notifications, setNotifications] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000); // Polling every 30s
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      const token = localStorage.getItem("access_token");
      if (!token) return;
      const res = await axios.get("http://127.0.0.1:5000/api/notifications/", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setNotifications(res.data);
    } catch (err) {
      console.error("Failed to fetch notifications:", err);
    }
  };

  const markAsRead = async (id) => {
    try {
      const token = localStorage.getItem("access_token");
      await axios.put(`http://127.0.0.1:5000/api/notifications/read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchNotifications();
    } catch (err) {
      console.error("Error marking as read:", err);
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  return (
    <div style={navbarStyles.topBar}>
      <div style={{ display: "flex", flexDirection: "column" }}>
        <h3 style={{ 
          fontSize: "1.2rem", 
          fontWeight: "950", 
          background: "linear-gradient(135deg, #1e3a8a, #2563eb)", 
          WebkitBackgroundClip: "text", 
          WebkitTextFillColor: "transparent", 
          margin: 0, 
          letterSpacing: "-0.5px" 
        }}>
          Command Center
        </h3>
        <p style={{ fontSize: "0.72rem", fontWeight: "800", color: "#94a3b8", margin: 0 }}>
          {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
        </p>
      </div>
      
      <div style={{ display: "flex", alignItems: "center", gap: "24px" }}>
        <div style={{ position: "relative" }}>
          <button 
            onClick={() => setShowDropdown(!showDropdown)}
            style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", position: "relative" }}
          >
            🔔
            {unreadCount > 0 && (
              <div style={{ 
                position: "absolute", top: -2, right: -2, width: "16px", height: "16px", 
                background: "#ef4444", borderRadius: "50%", border: "2px solid #fff",
                fontSize: "0.6rem", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 900
              }}>
                {unreadCount}
              </div>
            )}
          </button>

          {showDropdown && (
            <div style={navbarStyles.dropdown}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "16px", borderBottom: "1.5px solid #f1f5f9", paddingBottom: "10px" }}>
                <span style={{ fontWeight: 900, fontSize: "0.9rem" }}>Notifications</span>
                <span style={{ fontSize: "0.7rem", color: "#2563eb", fontWeight: 800, cursor: "pointer" }} onClick={() => setShowDropdown(false)}>Close</span>
              </div>
              {notifications.length === 0 ? (
                <p style={{ fontSize: "0.8rem", color: "#94a3b8", textAlign: "center", padding: "20px" }}>No recent alerts</p>
              ) : (
                notifications.map((n) => (
                  <div 
                    key={n.id} 
                    onClick={() => markAsRead(n.id)}
                    style={{ 
                      padding: "12px", borderRadius: "12px", background: n.is_read ? "transparent" : "rgba(37,99,235,0.05)",
                      marginBottom: "8px", cursor: "pointer", border: "1px solid", borderColor: n.is_read ? "transparent" : "rgba(37,99,235,0.1)"
                    }}
                  >
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                      <span style={{ fontWeight: 800, fontSize: "0.85rem", color: n.type === 'critical' ? "#ef4444" : "#0f172a" }}>{n.title}</span>
                      <span style={{ fontSize: "0.65rem", color: "#94a3b8" }}>{new Date(n.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>
                    <p style={{ fontSize: "0.78rem", color: "#64748b", margin: 0 }}>{n.message}</p>
                  </div>
                ))
              )}
            </div>
          )}
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", padding: "4px 12px", borderRadius: "14px", background: "#f8fafc", border: "1.5px solid #f1f5f9" }}>
          <div style={{ textAlign: "right" }}>
            <p style={{ fontSize: "0.82rem", fontWeight: "950", color: "#0f172a", margin: 0 }}>
              {role ? role.toUpperCase() : "USER"}
            </p>
            <p style={{ fontSize: "0.68rem", fontWeight: "800", color: "#94a3b8", margin: 0 }}>Operations</p>
          </div>
          <img 
            src={`https://ui-avatars.com/api/?name=${role || 'User'}&background=2563eb&color=fff`} 
            style={{ width: "36px", height: "36px", borderRadius: "10px" }} 
            alt="user" 
          />
        </div>
      </div>
    </div>
  );
}

export default Navbar;
