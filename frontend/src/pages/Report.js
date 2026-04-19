import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import logo from "../assets/logo.png";



/* ─── Inline Styles ─────────────────────────────────────── */
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
    padding: "0 5%",
    height: "72px",
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

  nav: { display: "flex", gap: "32px", alignItems: "center" },
  navItem: (active) => ({
    fontSize: "0.85rem",
    fontWeight: "800",
    color: active ? "#2563eb" : "#64748b",
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: active ? "2.5px solid #2563eb" : "2.5px solid transparent",
    padding: "24px 0",
    cursor: "pointer",
    transition: "all .2s ease",
  }),

  userBadge: {
    padding: "8px 16px",
    borderRadius: "14px",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.82rem",
    fontWeight: "800",
    color: "#475569",
    display: "flex",
    alignItems: "center",
    gap: "8px",
    boxShadow: "0 4px 12px rgba(0,0,0,0.02)",
  },

  /* ── Content ── */
  main: {
    maxWidth: "1400px",
    margin: "0 auto",
    padding: "40px 5% 100px",
  },

  banner: {
    padding: "48px",
    borderRadius: "32px",
    background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
    color: "#fff",
    marginBottom: "40px",
    position: "relative",
    overflow: "hidden",
    boxShadow: "0 20px 40px rgba(15,23,42,0.15)",
  },
  bannerH2: { fontSize: "2.8rem", fontWeight: "950", marginBottom: "12px", letterSpacing: "-1.5px" },
  bannerSub: { fontSize: "1.1rem", opacity: 0.8, maxWidth: "600px", lineHeight: 1.6 },

  /* ── Stats ── */
  statsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "32px",
    marginBottom: "50px",
  },
  statCard: {
    background: "#fff",
    padding: "32px",
    borderRadius: "28px",
    border: "1.5px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15,23,42,0.03)",
    transition: "all .3s cubic-bezier(0.16, 1, 0.3, 1)",
  },
  statLabel: { fontSize: "0.85rem", fontWeight: "800", color: "#64748b", textTransform: "uppercase", letterSpacing: "1px", marginBottom: "8px" },
  statValue: { fontSize: "3rem", fontWeight: "950", color: "#0f172a", letterSpacing: "-1.5px" },

  /* ── Insights ── */
  insightGrid: { 
    display: "grid", 
    gridTemplateColumns: "1fr 1fr", 
    gap: "32px" 
  },
  section: {
    background: "#fff",
    padding: "40px",
    borderRadius: "32px",
    border: "1.5px solid #e2e8f0",
    boxShadow: "0 10px 30px rgba(15,23,42,0.03)",
  },
  sectionH3: { fontSize: "1.6rem", fontWeight: "950", marginBottom: "24px", color: "#1e3a8a", letterSpacing: "-0.5px" },
  listRow: { 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "space-between", 
    padding: "18px 0", 
    borderBottom: "1.5px solid #f1f5f9" 
  },
  tagName: { fontWeight: "700", color: "#475569", fontSize: "0.95rem" },
  tagValue: { fontWeight: "900", color: "#0f172a", fontSize: "1.1rem" },
};

function Reports() {
  const navigate = useNavigate();
  const location = useLocation();

  const roleString = (localStorage.getItem("role") || "Staff").trim();
  const displayRole = roleString.charAt(0).toUpperCase() + roleString.slice(1).toLowerCase();

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
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .it-delay-1 { animation-delay: 0.1s; }
        .it-delay-2 { animation-delay: 0.2s; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={S.root}>
      {/* ── Unified Sapphire Header ── */}
      <header style={S.header}>
        <div style={{ display: "flex", alignItems: "center", gap: "60px" }}>
          <div style={S.logoBox} onClick={() => navigate("/")}>
            <img src={logo} alt="IT" style={S.logoImg} />
            <span style={S.logoName}>InvenTrack</span>
          </div>
          <nav style={S.nav}>
            <span style={S.navItem(true)} onClick={() => navigate("/reports")}>REPORTS</span>
          </nav>
        </div>

        <div style={{ display: "flex", gap: "16px", alignItems: "center" }}>
          <div style={S.userBadge}>
            👤 {displayRole}
          </div>
          <button
            onClick={() => { localStorage.removeItem("role"); navigate("/"); }}
            style={{ 
              background: "#fee2e2", color: "#ef4444", border: "none", 
              padding: "10px 18px", borderRadius: "14px", fontWeight: "800", 
              fontSize: "0.8rem", cursor: "pointer" 
            }}
          >
            LOGOUT
          </button>
        </div>
      </header>

      <main style={S.main}>
        {/* ── Banner ── */}
        <div style={S.banner} className="it-fade-up">
          <h2 style={S.bannerH2}>Reports & Insights</h2>
          <p style={S.bannerSub}>
            Analyze inventory performance, stock velocity, and structural health of your 
            global warehouse blueprinters.
          </p>
          {/* Subtle Decorative Element */}
          <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "400px", height: "400px", background: "rgba(59,130,246,0.1)", borderRadius: "50%", filter: "blur(80px)" }} />
        </div>

        {/* ── Stats ── */}
        <div style={S.statsGrid} className="it-fade-up it-delay-1">
          <div style={S.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(0,0,0,0.06)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = S.statCard.boxShadow; }}>
            <p style={S.statLabel}>Total Assets</p>
            <h2 style={S.statValue}>542</h2>
          </div>
          <div style={S.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(239,68,68,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = S.statCard.boxShadow; }}>
            <p style={S.statLabel}>Critical Stock</p>
            <h2 style={{ ...S.statValue, color: "#ef4444" }}>18</h2>
          </div>
          <div style={S.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(16,185,129,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = S.statCard.boxShadow; }}>
            <p style={S.statLabel}>Movement Flow</p>
            <h2 style={{ ...S.statValue, color: "#10b981" }}>+12%</h2>
          </div>
          <div style={S.statCard} onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-8px)"; e.currentTarget.style.boxShadow = "0 20px 40px rgba(30,58,138,0.1)"; }} onMouseLeave={(e) => { e.currentTarget.style.transform = ""; e.currentTarget.style.boxShadow = S.statCard.boxShadow; }}>
            <p style={S.statLabel}>System Health</p>
            <h2 style={{ ...S.statValue, color: "#2563eb" }}>99.8%</h2>
          </div>
        </div>



        {/* ── Insights Section ── */}
        <div style={S.insightGrid} className="it-fade-up it-delay-2">
          {/* Top Stock */}
          <section style={S.section}>
            <h3 style={S.sectionH3}>Top Velocity Assets</h3>
            <div style={{ spaceY: "10px" }}>
              {[
                { name: "HDMI 2.1 Ultra-Fast Cable", val: "678 Units" },
                { name: "MacBook Pro M3 Silicon", val: "245 Units" },
                { name: "Wireless Mechanical Core", val: "189 Units" },
                { name: "USB-C Tactical Hub", val: "154 Units" },
              ].map((item, i) => (
                <div key={i} style={S.listRow}>
                  <span style={S.tagName}>{item.name}</span>
                  <span style={S.tagValue}>{item.val}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Low Stock */}
          <section style={S.section}>
            <h3 style={{ ...S.sectionH3, color: "#1e3a8a" }}>Critical Replenishment</h3>
            <div style={{ spaceY: "10px" }}>
              {[
                { name: "Ergonomic Mesh Support", val: "2 Units", color: "#ef4444" },
                { name: "Industrial Steel Racking", val: "4 Units", color: "#f59e0b" },
                { name: "Server Blade Enclosure", val: "6 Units", color: "#f59e0b" },
                { name: "4K Reference Monitor", val: "8 Units", color: "#f59e0b" },
              ].map((item, i) => (
                <div key={i} style={S.listRow}>
                  <span style={S.tagName}>{item.name}</span>
                  <span style={{ ...S.tagValue, color: item.color }}>{item.val}</span>
                </div>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}

export default Reports;