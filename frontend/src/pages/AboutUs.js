import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";

// Assets imports
import logo from "../assets/logo.png";
import managementImg from "../assets/management.png";

/* ─── Inline Styles (Sapphire & Slate Design Restoration) ─── */
const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    background: "linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)",
    color: "#0f172a",
    overflowX: "hidden",
  },
  
  /* ── Navigation Header ── */
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
  
  btnPrimary: {
    padding: "12px 28px", borderRadius: "16px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff", fontWeight: "800", border: "none", cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)"
  },

  /* ── Hero Section ── */
  hero: {
    padding: "100px 5%",
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)",
    color: "#fff",
    textAlign: "center",
    clipPath: "ellipse(100% 100% at 50% 0%)",
    paddingBottom: "140px",
  },
  heroTitle: { fontSize: "3.5rem", fontWeight: "950", letterSpacing: "-2px", marginBottom: "20px" },
  heroSub: { fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", maxWidth: "800px", margin: "0 auto", lineHeight: 1.7 },

  /* ── Marquee Ticker ── */
  marqueeWrap: {
    background: "#0f172a",
    color: "#3b82f6",
    padding: "12px 0",
    borderTop: "1px solid rgba(59,130,246,0.2)",
    borderBottom: "1px solid rgba(59,130,246,0.2)",
    fontWeight: "800",
    fontSize: "0.85rem",
    letterSpacing: "1px",
    textTransform: "uppercase",
  },

  /* ── Main Container ── */
  container: { maxWidth: "1200px", margin: "-80px auto 0", padding: "0 5% 120px", position: "relative", zIndex: 10 },
  
  /* ── Info Cards ── */
  grid: { display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "32px" },
  card: {
    background: "#fff",
    padding: "48px",
    borderRadius: "32px",
    border: "1.5px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    transition: "all .3s ease",
  },
  cardTitle: { fontSize: "1.6rem", fontWeight: "900", marginBottom: "16px", color: "#1e3a8a" },
  cardText: { fontSize: "1.05rem", color: "#64748b", lineHeight: 1.8 },

  /* ── Workflow Steps ── */
  workflowRow: {
    display: "flex", gap: "24px", overflowX: "auto", padding: "24px 0", scrollbarWidth: "none"
  },
  wfStep: {
    minWidth: "200px", flex: 1, padding: "32px", background: "#fff", borderRadius: "24px", 
    border: "1.5px solid #e2e8f0", textAlign: "center"
  },
  wfNum: { fontSize: "2rem", fontWeight: "900", color: "#2563eb", opacity: 0.2, marginBottom: "8px" },

  footer: {
    padding: "80px 5%", background: "#fff", borderTop: "1.5px solid #e2e8f0", textAlign: "center"
  }
};

function AboutUs() {
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0,0);
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
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .it-delay-1 { animation-delay: 0.1s; }
        .it-delay-2 { animation-delay: 0.2s; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={S.root}>
      {/* ── Navigation ── */}
      <header style={S.header}>
        <div style={S.logoBox} onClick={() => navigate("/")}>
          <img src={logo} alt="IT" style={S.logoImg} />
          <span style={S.logoName}>InvenTrack</span>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#64748b", cursor: "pointer", textTransform: "uppercase" }} onClick={() => navigate("/dashboard")}>Dashboard</span>
          <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#64748b", cursor: "pointer", textTransform: "uppercase" }} onClick={() => navigate("/reports")}>Reports</span>
          <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#2563eb", cursor: "pointer", textTransform: "uppercase", borderBottom: "2px solid #2563eb" }}>About Us</span>
          <button style={S.btnPrimary} onClick={() => navigate("/login")}>Get Started</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={S.hero}>
        <h1 style={S.heroTitle} className="it-fade-up">Smart Inventory Management</h1>
        <p style={S.heroSub} className="it-fade-up it-delay-1">
          InvenTrack is a web-based comprehensive solution designed to eliminate manual tracking 
          errors and provide complete stock visibility for modern manufacturing.
        </p>
      </section>

      {/* ── Live Pulse Marquee ── */}
      <div style={S.marqueeWrap}>
        <marquee scrollamount="8" behavior="scroll" direction="left">
           🔐 [SECURITY] Role-Based Access Active &nbsp;&nbsp;&nbsp;&nbsp; 🚀 [STATUS] Stock Vault Synchronized &nbsp;&nbsp;&nbsp;&nbsp; 📊 [DATA] Real-time Reporting Online &nbsp;&nbsp;&nbsp;&nbsp; 💎 [INFO] Admin Authored 2m Ago &nbsp;&nbsp;&nbsp;&nbsp; 📦 [INVENTORY] Low Stock Indicator Functional
        </marquee>
      </div>

      <main style={S.container}>
        
        {/* ── Mission & Vision ── */}
        <div style={{ ...S.grid, marginBottom: "80px" }} className="it-fade-up it-delay-2">
          <div style={S.card} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.boxShadow="0 20px 40px rgba(0,0,0,0.08)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow=S.card.boxShadow; }}>
            <h2 style={{ ...S.cardTitle, fontWeight: "950", letterSpacing: "-1px" }}>Our Mission</h2>
            <p style={S.cardText}>
              To provide industrial-strength transparency for every asset in your warehouse. 
              We aim to replace unreliable manual logs with a high-fidelity digital nervous 
              system that scales with your growth.
            </p>
          </div>
          <div style={{ ...S.card, background: "#1e3a8a", color: "#fff", border: "none" }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px)"; e.currentTarget.style.boxShadow="0 20px 40px rgba(30,58,138,0.2)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow=S.card.boxShadow; }}>
            <h2 style={{ ...S.cardTitle, color: "#fff", fontWeight: "950", letterSpacing: "-1px" }}>Our Vision</h2>
            <p style={{ ...S.cardText, color: "rgba(255,255,255,0.7)" }}>
              We envision a future where inventory systems are smarter and fully automated, 
              allowing businesses to operate at peak velocity with zero-error predictive 
              intelligence.
            </p>
          </div>
        </div>

        {/* ── Features ── */}
        <div style={{ textAlign: "center", marginBottom: "60px" }} className="it-fade-up">
          <h2 style={{ fontSize: "2.8rem", fontWeight: "950", color: "#0f172a", letterSpacing: "-1.5px" }}>Core Ecosystem Capabilities</h2>
        </div>
        <div style={{ ...S.grid, marginBottom: "120px" }}>
          {[
            { t: "Product Mgmt", d: "Easily add, edit, or delete items with categorical precision.", i: "📦" },
            { t: "Stock Tracking", d: "Monitor inventory levels in real-time across multiple zones.", i: "📊" },
            { t: "Smart Alerts", d: "Instant visual cues when stock hits critical thresholds.", i: "🔔" },
            { t: "Role Hierarchy", d: "Secure permissions for Admin, Manager, and Staff roles.", i: "🛡️" },
            { t: "Search & Filter", d: "Locate any asset in milliseconds with advanced query tools.", i: "🔍" },
            { t: "Data Reports", d: "Generate operational summaries and valuation insights.", i: "📈" }
          ].map((f, i) => (
            <div key={i} style={{ ...S.card, padding: "32px", border: "1.5px solid #e2e8f0" }}>
              <div style={{ fontSize: "2rem", marginBottom: "16px" }}>{f.i}</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "900", marginBottom: "8px" }}>{f.t}</h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.6 }}>{f.d}</p>
            </div>
          ))}
        </div>

        {/* ── Workflow ── */}
        <div style={{ marginBottom: "120px" }}>
          <h2 style={{ fontSize: "2rem", fontWeight: "900", textAlign: "center", marginBottom: "40px" }}>System Workflow</h2>
          <div style={S.workflowRow}>
            {["Login", "View Vault", "Check levels", "Update data", "Get Reports"].map((step, i) => (
              <div key={i} style={S.wfStep}>
                <div style={S.wfNum}>0{i+1}</div>
                <p style={{ fontWeight: "800", fontSize: "0.95rem" }}>{step}</p>
              </div>
            ))}
          </div>
        </div>

        {/* ── Detailed System Roles ── */}
        <div style={{ marginBottom: "120px" }}>
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2 style={{ fontSize: "2.5rem", fontWeight: "900", color: "#0f172a" }}>System Access Roles</h2>
            <p style={{ color: "#64748b", fontSize: "1.1rem", maxWidth: "800px", margin: "16px auto 0", lineHeight: 1.6 }}>A structured, role-based architecture ensuring secure and efficient operations at every level.</p>
          </div>
          <div style={{ ...S.grid, gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))" }}>
            {[
              { 
                r: "Admin", 
                i: "🛡️", 
                bg: "#1e3a8a", 
                tc: "#fff",
                desc: "The System Owner with supreme control over the platform's configuration and security.",
                points: ["Manage all user accounts", "Assign system roles", "Configure global settings", "Full data visibility"] 
              },
              { 
                r: "Manager", 
                i: "💼", 
                bg: "#fff", 
                tc: "#0f172a",
                border: "1.5px solid #e2e8f0",
                desc: "The Operational Head responsible for catalog accuracy and inventory insights.",
                points: ["Add, edit, or delete products", "Monitor low stock alerts", "Manage supplier relations", "View operational reports"] 
              },
              { 
                r: "Staff", 
                i: "👤", 
                bg: "#fff", 
                tc: "#0f172a",
                border: "1.5px solid #e2e8f0",
                desc: "The Day-to-Day Worker keeping the warehouse operations moving rapidly.",
                points: ["View product catalog", "Update current stock levels", "Process daily transactions", "Check low stock status"] 
              }
            ].map((role, i) => (
              <div key={i} style={{ 
                background: role.bg, color: role.tc, border: role.border || "none",
                padding: "48px 40px", borderRadius: "32px", boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
                transition: "transform .3s ease",
              }} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = "none"; }}>
                <div style={{ fontSize: "3rem", marginBottom: "24px" }}>{role.i}</div>
                <h3 style={{ fontSize: "1.8rem", fontWeight: "900", marginBottom: "16px", color: role.tc }}>{role.r}</h3>
                <p style={{ fontSize: "1rem", opacity: 0.85, lineHeight: 1.6, marginBottom: "32px" }}>{role.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
                  {role.points.map((pt, idx) => (
                    <li key={idx} style={{ 
                      fontSize: "0.95rem", fontWeight: "700", marginBottom: "16px",
                      display: "flex", alignItems: "flex-start", gap: "12px", opacity: 0.95
                    }}>
                      <span style={{ color: role.bg === "#1e3a8a" ? "#60a5fa" : "#2563eb", marginTop: "2px" }}>✔</span> {pt}
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

      </main>

      <footer style={S.footer}>
        <p style={{ color: "#94a3b8", fontWeight: "800", fontSize: "0.9rem" }}>
          © 2026 InvenTrack Infrastructure. Simple. Reliable. Accurate.
        </p>
      </footer>
    </div>
  );
}

export default AboutUs;