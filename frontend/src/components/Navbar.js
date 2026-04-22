import React from "react";

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
  },
};

function Navbar({ role }) {
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
        <button style={{ background: "none", border: "none", fontSize: "1.3rem", cursor: "pointer", position: "relative" }}>
          🔔
          <div style={{ position: "absolute", top: 0, right: 0, width: "8px", height: "8px", background: "#ef4444", borderRadius: "50%", border: "2px solid #fff" }} />
        </button>
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
