import React from "react";
import logo from "../assets/logo.png";

const sidebarStyles = {
  sidebar: {
    width: "280px",
    display: "flex",
    flexDirection: "column",
    padding: "32px 24px",
    background: "#0f172a",
    color: "#fff",
    transition: "all .3s",
    position: "relative",
    zIndex: 10,
    boxShadow: "10px 0 40px rgba(0,0,0,0.1)",
  },
  sidebarBrand: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "0 12px",
    marginBottom: "40px",
  },
  sidebarBrandName: {
    fontSize: "1.4rem",
    fontWeight: "950",
    color: "#ffffff",
    letterSpacing: "-0.8px",
  },
  sidebarItem: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "14px 16px",
    borderRadius: "16px",
    fontSize: "0.9rem",
    fontWeight: "800",
    color: "#94a3b8",
    cursor: "pointer",
    transition: "all .2s ease",
    border: "none",
    background: "transparent",
    textAlign: "left",
    width: "100%",
  },
  sidebarItemActive: {
    color: "#ffffff",
    background: "#2563eb",
    boxShadow: "0 10px 20px rgba(37,99,235,0.3)",
  },
  sidebarFooter: {
    marginTop: "auto",
    padding: "20px 12px 0",
    borderTop: "1.5px solid rgba(255,255,255,0.05)",
  },
  logoutBtn: {
    width: "100%",
    padding: "12px",
    borderRadius: "12px",
    background: "rgba(239,68,68,0.1)",
    color: "#ef4444",
    border: "none",
    fontWeight: "900",
    cursor: "pointer",
    transition: "all .3s",
  },
};

const roleConfigs = {
  admin: {
    menu: ["Dashboard", "Manage Products", "User Roles", "Audit Logs", "System Config", "Update Stock", "Transaction History"]
  },
  manager: {
    menu: ["Dashboard", "Manage Products", "Stock Orders", "Inventory Reports", "Suppliers", "Update Stock", "Transaction History"]
  },
  staff: {
    menu: ["Dashboard", "Product Search", "Update Stock", "Transaction History"]
  }
};

function Sidebar({ role, activeItem, onMenuClick, onLogout }) {
  const menuItems = roleConfigs[role?.toLowerCase()] || roleConfigs.staff;

  return (
    <aside style={sidebarStyles.sidebar}>
      <div style={sidebarStyles.sidebarBrand}>
        <div style={{ padding: "8px", background: "rgba(37,99,235,0.15)", borderRadius: "14px", boxShadow: "0 8px 24px rgba(37,99,235,0.2)" }}>
          <img src={logo} alt="Logo" style={{ width: "40px", height: "40px", objectFit: "contain" }} />
        </div>
        <span style={sidebarStyles.sidebarBrandName}>InvenTrack</span>
      </div>

      <nav style={{ display: "flex", flexDirection: "column", gap: "8px", flex: 1 }}>
        {menuItems.menu.map(m => (
          <button 
            key={m} 
            style={{ ...sidebarStyles.sidebarItem, ...(activeItem === m ? sidebarStyles.sidebarItemActive : {}) }}
            onClick={() => onMenuClick(m)}
            onMouseEnter={(e) => { if (activeItem !== m) { e.target.style.background = "rgba(255,255,255,0.03)"; e.target.style.color = "#fff"; } }}
            onMouseLeave={(e) => { if (activeItem !== m) { e.target.style.background = "transparent"; e.target.style.color = "#94a3b8"; } }}
          >
            {m}
          </button>
        ))}
      </nav>

    </aside>
  );
}

export default Sidebar;
