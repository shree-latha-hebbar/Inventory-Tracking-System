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
    background: "rgba(255, 255, 255, 0.8)",
    backdropFilter: "blur(12px)",
    padding: "48px",
    borderRadius: "32px",
    border: "1.5px solid rgba(226, 232, 240, 0.8)",
    boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer",
  },
  cardTitle: { fontSize: "1.6rem", fontWeight: "950", marginBottom: "16px", color: "#1e3a8a", letterSpacing: "-0.5px" },
  cardText: { fontSize: "1.05rem", color: "#64748b", lineHeight: 1.8, fontWeight: "500" },

  /* ── Workflow Steps ── */
  workflowRow: {
    display: "flex", alignItems: "center", gap: "0", overflowX: "auto", padding: "40px 0", scrollbarWidth: "none"
  },
  wfStep: {
    minWidth: "180px", flex: 1, padding: "32px 24px", background: "#fff", borderRadius: "24px", 
    border: "1.5px solid #e2e8f0", textAlign: "center", position: "relative",
    transition: "all .3s ease",
    boxShadow: "0 4px 6px rgba(0,0,0,0.02)"
  },
  wfArrow: {
    fontSize: "1.5rem", color: "#cbd5e1", margin: "0 16px", fontWeight: "900",
    display: "flex", alignItems: "center", justifyContent: "center"
  },
  wfNum: { fontSize: "2.4rem", fontWeight: "950", color: "#2563eb", opacity: 0.1, marginBottom: "8px" },

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
        @keyframes glowPulse {
          0% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0.4); }
          70% { box-shadow: 0 0 0 15px rgba(37, 99, 235, 0); }
          100% { box-shadow: 0 0 0 0 rgba(37, 99, 235, 0); }
        }
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .it-delay-1 { animation-delay: 0.1s; }
        .it-delay-2 { animation-delay: 0.2s; }
        .it-glow-on-hover:hover {
          animation: glowPulse 2s infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes liquidFlow {
          from { stroke-dashoffset: 100; }
          to { stroke-dashoffset: 0; }
        }
        @keyframes neonPulse {
          0%, 100% { border-color: rgba(59, 130, 246, 0.4); box-shadow: 0 0 10px rgba(59, 130, 246, 0.2); }
          50% { border-color: rgba(59, 130, 246, 1); box-shadow: 0 0 25px rgba(59, 130, 246, 0.5); }
        }
        @keyframes bgFlow {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
        .saas-wf-card {
          background: rgba(255, 255, 255, 0.6) !important;
          backdrop-filter: blur(25px) !important;
          border: 1px solid rgba(255, 255, 255, 0.8) !important;
          border-radius: 28px !important;
          padding: 30px 20px !important;
          transition: all 0.5s cubic-bezier(0.23, 1, 0.32, 1);
          animation: float 4s ease-in-out infinite;
          animation-delay: var(--delay);
          z-index: 2;
          box-shadow: 0 10px 30px rgba(0,0,0,0.03) !important;
        }
        .saas-wf-card:hover {
          background: rgba(255, 255, 255, 0.9) !important;
          transform: translateY(-15px) scale(1.05) !important;
          border-color: #3b82f6 !important;
          box-shadow: 0 25px 50px -12px rgba(37, 99, 235, 0.2) !important;
        }
        .saas-wf-line {
          stroke: url(#liquidGrad);
          stroke-width: 3;
          stroke-dasharray: 10, 15;
          animation: liquidFlow 5s linear infinite;
        }
        .saas-3d-icon {
          font-size: 3rem;
          margin-bottom: 20px;
          filter: drop-shadow(0 10px 20px rgba(0,0,0,0.3));
          display: inline-block;
          transition: transform 0.3s;
        }
        .saas-wf-card:hover .saas-3d-icon {
          transform: scale(1.2) rotate(5deg);
        }
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
            { t: "Product Management", d: "Easily add, edit, or delete items with categorical precision.", i: "📦", c: "#2563eb" },
            { t: "Stock Tracking", d: "Monitor inventory levels in real-time across multiple zones.", i: "📊", c: "#10b981" },
            { t: "Smart Alerts", d: "Instant visual cues when stock hits critical thresholds.", i: "🔔", c: "#ef4444" },
            { t: "Role Hierarchy", d: "Secure permissions for Admin, Manager, and Staff roles.", i: "🛡️", c: "#6366f1" },
            { t: "Search & Filter", d: "Locate any asset in milliseconds with advanced query tools.", i: "🔍", c: "#0ea5e9" },
            { t: "Data Reports", d: "Generate operational summaries and valuation insights.", i: "📈", c: "#f59e0b" }
          ].map((f, i) => (
            <div key={i} style={{ ...S.card, padding: "32px", border: "1.5px solid #e2e8f0" }} className="it-glow-on-hover" onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-10px) scale(1.02)"; e.currentTarget.style.borderColor = f.c; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
              <div style={{ fontSize: "2.5rem", marginBottom: "16px", filter: "drop-shadow(0 5px 15px rgba(0,0,0,0.1))" }}>{f.i}</div>
              <h3 style={{ fontSize: "1.3rem", fontWeight: "950", marginBottom: "8px", color: "#0f172a" }}>{f.t}</h3>
              <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: 1.6, fontWeight: "600" }}>{f.d}</p>
            </div>
          ))}
        </div>

        {/* ── High-End SaaS Workflow Section (Light Theme Integration) ── */}
        <section style={{ 
          margin: "0 0 120px", 
          position: "relative",
          zIndex: 1
        }}>
          {/* Subtle Aura Gradients for integration */}
          <div style={{ position: "absolute", top: "0%", left: "10%", width: "40%", height: "100%", background: "radial-gradient(circle, rgba(37,99,235,0.06) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)", zIndex: 0 }} />
          <div style={{ position: "absolute", top: "0%", right: "10%", width: "40%", height: "100%", background: "radial-gradient(circle, rgba(16,185,129,0.04) 0%, transparent 70%)", pointerEvents: "none", filter: "blur(60px)", zIndex: 0 }} />

          <div style={{ textAlign: "center", marginBottom: "80px", position: "relative", zIndex: 5 }}>
            <h2 style={{ fontSize: "3.5rem", fontWeight: "950", color: "#0f172a", letterSpacing: "-2.5px" }}>System Flow</h2>
            <p style={{ color: "#475569", fontSize: "1.2rem", maxWidth: "700px", margin: "20px auto 0", fontWeight: "600", opacity: 0.9 }}>Experience the fluid intelligence of InvenTrack logistics.</p>
          </div>

          <div style={{ position: "relative", paddingBottom: "40px" }}>
            {/* SVG Connector Layer */}
            <svg style={{ position: "absolute", top: "50%", left: 0, width: "100%", height: "200px", zIndex: 1, pointerEvents: "none" }} viewBox="0 0 1000 200">
              <defs>
                <linearGradient id="liquidGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#3b82f6" stopOpacity="0" />
                  <stop offset="50%" stopColor="#3b82f6" stopOpacity="1" />
                  <stop offset="100%" stopColor="#6366f1" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M100,100 C200,100 200,50 300,50 S400,150 500,150 S600,50 700,50 S800,100 900,100" fill="none" className="saas-wf-line" />
            </svg>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", position: "relative", zIndex: 2, gap: "24px" }}>
              {[
                { t: "Master Auth", d: "Secure gateway with role-based biometrics.", i: "🔑", delay: "0s", neon: "#22d3ee" },
                { t: "Asset Vault", d: "High-fidelity digital asset repository.", i: "🛡️", delay: "0.2s", neon: "#3b82f6" },
                { t: "Live Pulse", d: "Real-time logistics monitoring engine.", i: "📡", delay: "0.4s", neon: "#f43f5e" },
                { t: "Data Sync", d: "Elastic synchronization across nodes.", i: "🔄", delay: "0.6s", neon: "#10b981" },
                { t: "Intelligence", d: "Predictive analytics & report generation.", i: "📈", delay: "0.8s", neon: "#d946ef" },
              ].map((step, i) => (
                <div key={i} className="saas-wf-card" style={{ "--delay": step.delay, width: "18%", padding: "40px 24px" }}>
                  <div className="saas-3d-icon" style={{ filter: `drop-shadow(0 0 15px ${step.neon}66)` }}>{step.i}</div>
                  <h3 style={{ fontSize: "1.2rem", fontWeight: "950", color: "#1e3a8a", marginBottom: "12px", letterSpacing: "-0.5px" }}>{step.t}</h3>
                  <p style={{ fontSize: "0.9rem", color: "#475569", lineHeight: 1.6, fontWeight: "700", opacity: 0.85 }}>{step.d}</p>
                  <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
                    <div style={{ width: "40px", height: "4px", background: step.neon, borderRadius: "2px", boxShadow: `0 0 10px ${step.neon}aa` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

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