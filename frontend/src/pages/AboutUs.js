import React, { useEffect, useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import logo from "../assets/logo.png";

const S = {
  root: {
    fontFamily: "'DM Sans', 'Inter', sans-serif",
    minHeight: "100vh",
    background: "#f8fafc", // Slate-50 background
    color: "#0f172a", // Slate-900 text
    overflowX: "hidden",
  },
  /* ── Navbar ── */
  nav: {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 1000,
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 5%",
    height: "80px",
    background: "rgba(255,255,255,0.75)",
    backdropFilter: "blur(24px)",
    borderBottom: "1px solid rgba(226, 232, 240, 0.4)",
    transition: "all .4s ease",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textDecoration: "none",
    cursor: "pointer",
  },
  navLogoImg: {
    width: "48px",
    height: "48px",
    objectFit: "contain",
  },
  navBrand: {
    fontSize: "1.75rem",
    fontWeight: "1000",
    color: "#1e3a8a",
    letterSpacing: "-1.5px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    listStyle: "none",
  },
  navLink: {
    padding: "8px 16px",
    borderRadius: "10px",
    color: "#475569",
    fontWeight: "600",
    fontSize: "0.95rem",
    textDecoration: "none",
    transition: "all .3s",
  },
  navLinkActive: {
    color: "#2563eb",
    background: "rgba(37, 99, 235, 0.08)",
  },
  navBtn: {
    padding: "10px 24px",
    borderRadius: "12px",
    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
    color: "#fff",
    fontWeight: "800",
    fontSize: "0.95rem",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 8px 20px rgba(37, 99, 235, 0.2)",
    transition: "all .3s",
  },
  /* ── Hero ── */
  hero: {
    padding: "160px 8% 100px",
    background: "radial-gradient(circle at top right, rgba(37, 99, 235, 0.08), transparent), radial-gradient(circle at bottom left, rgba(37, 99, 235, 0.05), transparent)",
  },
  heroGrid: {
    display: "grid",
    gridTemplateColumns: "1.2fr 1fr",
    gap: "60px",
    alignItems: "center",
  },
  heroColA: {
    textAlign: "left",
  },
  heroH1: {
    fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
    fontWeight: "1000",
    letterSpacing: "-4px",
    lineHeight: "1",
    color: "#0f172a",
    marginBottom: "32px",
  },
  heroGlassCard: {
    background: "rgba(255, 255, 255, 0.5)",
    backdropFilter: "blur(12px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "24px",
    padding: "32px",
    marginTop: "24px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.02)",
    transition: "transform 0.3s ease",
  },
  heroImage: {
    width: "100%",
    height: "550px",
    borderRadius: "48px",
    objectFit: "cover",
    boxShadow: "0 40px 80px rgba(30, 58, 138, 0.15)",
  },
  /* ── Footer ── */
  footer: {
    padding: "40px 8% 24px",
    background: "#0f172a",
    color: "#94a3b8",
    borderTop: "1px solid rgba(255,255,255,0.05)",
  },
  footerColTitle: {
    color: "#fff",
    fontSize: "0.85rem",
    fontWeight: "800",
    marginBottom: "16px",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  footerLink: {
    color: "#94a3b8",
    textDecoration: "none",
    fontSize: "0.85rem",
    marginBottom: "8px",
    display: "block",
    transition: "color 0.3s",
  },
  /* ── Bento Grid ── */
  bentoContainer: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gridAutoRows: "minmax(300px, auto)",
    gap: "24px",
    padding: "0 6% 120px",
  },
  glassCard: {
    background: "rgba(255, 255, 255, 0.7)",
    backdropFilter: "blur(16px)",
    border: "1px solid rgba(255, 255, 255, 0.4)",
    borderRadius: "32px",
    padding: "48px",
    boxShadow: "0 20px 50px rgba(0,0,0,0.03)",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    transition: "all 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
  },
  /* ── Specific Bento Items ── */
  itemMission: {
    gridColumn: "1 / span 2",
    gridRow: "1 / span 2",
    backgroundImage: "linear-gradient(to bottom, rgba(15, 23, 42, 0.8), rgba(15, 23, 42, 0.6)), url('https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?q=80&w=1200')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    color: "#fff",
    border: "none",
  },
  itemVision: {
    gridColumn: "3 / span 1",
    gridRow: "1 / span 1",
    background: "linear-gradient(135deg, rgba(255,255,255,0.9), rgba(255,255,255,0.7))",
  },
  itemVisionVisual: {
    position: "absolute",
    bottom: 0,
    left: 0,
    width: "100%",
    height: "50%",
    backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=1200')",
    backgroundSize: "cover",
    backgroundPosition: "center",
    opacity: 0.8,
    maskImage: "linear-gradient(to top, black, transparent)",
  },
  itemFeature1: { gridColumn: "3 / span 1", gridRow: "2 / span 1" },
  itemFeature2: { gridColumn: "1 / span 1", gridRow: "3 / span 1" },
  itemFeature3: { gridColumn: "2 / span 1", gridRow: "3 / span 1" },
  itemFeature4: { gridColumn: "3 / span 1", gridRow: "3 / span 1" },
  /* ── Roles Section ── */
  roleContainer: {
    padding: "120px 6%",
    background: "#fff",
  },
  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
    gap: "32px",
    marginTop: "60px",
  },
  roleCard: {
    padding: "48px",
    borderRadius: "32px",
    background: "#fff",
    border: "1.5px solid #e2e8f0",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    position: "relative",
  },
  adminCard: {
    borderColor: "#2563eb",
    boxShadow: "0 0 40px rgba(37, 99, 235, 0.15)",
  },
  roleIconContainer: {
    width: "72px",
    height: "72px",
    borderRadius: "20px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "2.5rem",
    marginBottom: "32px",
    background: "rgba(37, 99, 235, 0.05)",
  },
  /* ── System Intel ── */
  intelSection: {
    padding: "80px 6% 40px",
    background: "#0f172a", // Slate-900
    color: "#fff",
    textAlign: "center",
  },
  intelGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "40px",
    maxWidth: "1200px",
    margin: "0 auto",
  },
  intelVal: {
    fontSize: "clamp(2.5rem, 4vw, 4.5rem)",
    fontWeight: "1000",
    letterSpacing: "-2px",
    margin: "0 0 8px 0",
    fontFamily: "'Inter', sans-serif",
  },
  intelLabel: {
    fontSize: "1rem",
    fontWeight: "800",
    color: "#64748b", // Slate-400
    textTransform: "uppercase",
    letterSpacing: "4px",
  },
};

const ROLES_DATA = [
  {
    title: "System Admin",
    type: "System Control",
    icon: "🛡️",
    isAdmin: true,
    desc: "Manages user roles and system configuration.",
    perms: ["Manage Users & Roles", "System Settings", "Data Management"]
  },
  {
    title: "Logistics Manager",
    type: "Operational Lead",
    icon: "💼",
    desc: "Overseeing the supply chain and optimizing warehouse resource allocation.",
    perms: ["Inventory Analysis", "Supplier Coordination", "Stock Threshold Control"]
  },
  {
    title: "Warehouse Staff",
    type: "Operational Access",
    icon: "📦",
    desc: "Handles day-to-day inventory tasks and updates stock information.",
    perms: ["View Product Details", "Update Stock Levels", "Search & Filter Products", "Limited Access"]
  }
];

export default function AboutUs() {
  const navigate = useNavigate();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    if (!document.getElementById("premium-styles")) {
      const style = document.createElement("style");
      style.id = "premium-styles";
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@700;800;900;1000&family=Inter:wght@900&display=swap');
        
        @keyframes floating {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-20px); }
        }

        @keyframes orbitRotate {
          from { transform: rotate(0deg) translateX(5px) rotate(0deg); }
          to { transform: rotate(360deg) translateX(5px) rotate(-360deg); }
        }

        @keyframes neonPulse {
          0%, 100% { box-shadow: 0 0 20px rgba(37, 99, 235, 0.2), inset 0 0 10px rgba(37, 99, 235, 0.1); border-color: #2563eb; }
          50% { box-shadow: 0 0 50px rgba(37, 99, 235, 0.5), inset 0 0 20px rgba(37, 99, 235, 0.2); border-color: #3b82f6; }
        }

        @keyframes glowPulse {
          0%, 100% { filter: drop-shadow(0 0 5px rgba(37, 99, 235, 0.5)); }
          50% { filter: drop-shadow(0 0 15px rgba(37, 99, 235, 0.9)); }
        }

        .floating-section { animation: floating 8s ease-in-out infinite; }
        .bento-hover:hover { transform: scale(1.03); z-index: 10; box-shadow: 0 30px 70px rgba(0,0,0,0.1); }
        .orbit-icon { animation: orbitRotate 6s linear infinite; }
        .neon-admin { animation: neonPulse 3s ease-in-out infinite; }
        .glow-pulse { animation: glowPulse 2s ease-in-out infinite; }
        
        .tracking-black { letter-spacing: -2px; }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={S.root}>
      {/* Navbar */}
      <nav style={{ ...S.nav, background: scrolled ? "rgba(255,255,255,0.9)" : S.nav.background }}>
        <div style={S.navLogo} onClick={() => navigate("/")}>
          <img src={logo} alt="InvenTrack" style={S.navLogoImg} />
          <span style={S.navBrand}>InvenTrack</span>
        </div>
        <div style={S.navLinks}>
          <Link to="/" style={S.navLink}>Home</Link>
          <Link to="/about" style={{ ...S.navLink, ...S.navLinkActive }}>About</Link>
          <button style={S.navBtn} onClick={() => navigate("/login")}>System Login</button>
        </div>
      </nav>

      {/* Hero Section */}
      <header style={S.hero}>
        <div style={S.heroGrid}>
          <div style={S.heroColA} className="floating-section">
            <span style={{ textTransform: "uppercase", fontSize: "0.9rem", fontWeight: "900", letterSpacing: "3px", color: "#2563eb", marginBottom: "20px", display: "block" }}>Innovation in Motion</span>
            <h1 style={S.heroH1}>The Next Generation <br /> of <span style={{ color: "#2563eb" }}>Inventory Control</span></h1>
            
            <div style={{ marginTop: "40px" }}>
              <div style={S.heroGlassCard} className="bento-hover">
                <h4 style={{ color: "#1e3a8a", fontWeight: "900", marginBottom: "8px", fontSize: "1.1rem" }}>Our Mission</h4>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  To simplify inventory management by providing a real-time, user-friendly system that helps businesses track stock efficiently and reduce manual errors.
                </p>
              </div>

              <div style={{ ...S.heroGlassCard, marginTop: "20px" }} className="bento-hover">
                <h4 style={{ color: "#1e3a8a", fontWeight: "900", marginBottom: "8px", fontSize: "1.1rem" }}>Our Vision</h4>
                <p style={{ fontSize: "0.95rem", lineHeight: "1.6", color: "#475569" }}>
                  To build a reliable and scalable inventory platform that enhances operational efficiency and supports smarter decision-making.
                </p>
              </div>
            </div>
          </div>
          <div>
            <img 
              src="https://images.unsplash.com/photo-1553413077-190dd305871c?q=80&w=1200" 
              alt="Modern Inventory Management" 
              style={S.heroImage} 
            />
          </div>
        </div>
      </header>

      {/* Bento Grid */}
      <section style={S.bentoContainer}>
        {/* Analytics Card */}
        <div style={{ ...S.glassCard, ...S.itemMission }} className="bento-hover">
          <div>
            <span style={{ textTransform: "uppercase", fontSize: "0.85rem", fontWeight: "900", letterSpacing: "2px", color: "rgba(255,255,255,0.6)" }}>Advanced Analytics</span>
            <h2 style={{ fontSize: "3rem", fontWeight: "1000", marginTop: "16px", letterSpacing: "-1.5px" }}>Precision <br /> Intelligence</h2>
          </div>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, maxWidth: "500px", lineHeight: "1.6" }}>
            Harness the power of data to predict stock needs and optimize storage efficiency. Our intelligent algorithms ensure you never miss a beat in your supply chain.
          </p>
        </div>

        {/* Global Access */}
        <div style={{ ...S.glassCard, ...S.itemVision }} className="bento-hover">
          <div style={S.itemVisionVisual}></div>
          <div style={{ position: "relative" }}>
            <span style={{ textTransform: "uppercase", fontSize: "0.75rem", fontWeight: "900", letterSpacing: "2px", color: "#64748b" }}>Global Scale</span>
            <h3 style={{ fontSize: "1.75rem", fontWeight: "1000", marginTop: "8px", letterSpacing: "-1px" }}>Multi-Node <br /> Logistics</h3>
          </div>
        </div>

        {/* Features Bento */}
        <div style={{ ...S.glassCard, ...S.itemFeature1 }} className="bento-hover">
          <span style={{ fontSize: "3rem" }}>📊</span>
          <h4 style={{ fontSize: "1.5rem", fontWeight: "1000" }}>Real-Time Inventory Tracking</h4>
          <p style={{ color: "#64748b", fontSize: "0.9rem", marginTop: "12px" }}>Track product stock levels instantly with live updates across the system, ensuring accurate inventory visibility at all times.</p>
        </div>

        <div style={{ ...S.glassCard, ...S.itemFeature2 }} className="bento-hover">
          <span style={{ fontSize: "3rem" }}>📦</span>
          <h4 style={{ fontSize: "1.5rem", fontWeight: "1000" }}>Smart Stock Management</h4>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Easily add, update, and manage products while receiving low stock alerts to prevent shortages and overstocking.</p>
        </div>

        <div style={{ ...S.glassCard, ...S.itemFeature3 }} className="bento-hover">
          <span style={{ fontSize: "3rem" }}>🔐</span>
          <h4 style={{ fontSize: "1.5rem", fontWeight: "1000" }}>Role-Based Access Control</h4>
          <p style={{ color: "#64748b", fontSize: "0.9rem" }}>Secure access with defined roles where managers control operations and staff handle day-to-day inventory tasks efficiently.</p>
        </div>

        <div style={{ ...S.glassCard, ...S.itemFeature4, background: "#2563eb", color: "#fff" }} className="bento-hover">
          <h4 style={{ fontSize: "1.5rem", fontWeight: "1000" }}>99.9% <br /> Reliability</h4>
          <span style={{ fontSize: "2rem" }}>💎</span>
        </div>
      </section>

      {/* Roles Section */}
      <section style={S.roleContainer}>
        <div style={{ textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
          <span style={{ textTransform: "uppercase", fontSize: "0.85rem", fontWeight: "900", letterSpacing: "2px", color: "#2563eb" }}>User Infrastructure</span>
          <h2 style={{ fontSize: "3.5rem", fontWeight: "1000", marginTop: "16px", letterSpacing: "-2px" }}>Administrative Structure</h2>
        </div>

        <div style={S.roleGrid}>
          {ROLES_DATA.map((role, i) => (
            <div
              key={i}
              style={{ ...S.roleCard, ...(role.isAdmin ? S.adminCard : {}) }}
              className={`bento-hover ${role.isAdmin ? 'neon-admin' : ''}`}
            >
              <div style={S.roleIconContainer}>
                <span className={`orbit-icon ${role.isAdmin ? 'glow-pulse' : ''}`}>{role.icon}</span>
              </div>
              <span style={{ color: "#2563eb", fontWeight: "800", fontSize: "0.8rem", textTransform: "uppercase", letterSpacing: "1px" }}>{role.type}</span>
              <h3 style={{ fontSize: "1.75rem", fontWeight: "1000", marginTop: "12px", marginBottom: "16px", letterSpacing: "-1px" }}>{role.title}</h3>
              <p style={{ color: "#64748b", fontSize: "1rem", lineHeight: "1.6", marginBottom: "24px" }}>{role.desc}</p>
              <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: "12px" }}>
                {role.perms.map((p, idx) => (
                  <li key={idx} style={{ fontSize: "0.9rem", color: "#475569", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ color: "#2563eb", fontWeight: "900" }}>✓</span> {p}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      {/* System Intel Section */}
      <div style={S.intelSection}>
        <div style={S.intelGrid}>
          <div>
            <h3 style={S.intelVal} className="tracking-black">12.5k</h3>
            <span style={S.intelLabel}>Items Tracked</span>
          </div>
          <div>
            <h3 style={S.intelVal} className="tracking-black">99.9%</h3>
            <span style={S.intelLabel}>System Uptime</span>
          </div>
          <div>
            <h3 style={S.intelVal} className="tracking-black">3 Roles</h3>
            <span style={S.intelLabel}>Integrated</span>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={S.footer}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1.5fr 1fr 1fr 1fr", gap: "40px", textAlign: "left", marginBottom: "32px" }}>
            {/* Logo + Description */}
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <img src={logo} alt="InvenTrack" style={{ width: "24px" }} />
                <span style={{ color: "#fff", fontWeight: "900", fontSize: "1.25rem", letterSpacing: "-0.5px" }}>InvenTrack</span>
              </div>
              <p style={{ fontSize: "0.85rem", lineHeight: "1.5", color: "#64748b", maxWidth: "280px" }}>
                InvenTrack helps businesses manage products, monitor stock levels, and track inventory operations efficiently.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h5 style={S.footerColTitle}>Quick Links</h5>
              <Link to="/" style={S.footerLink}>Home</Link>
              <Link to="/about" style={{ ...S.footerLink, color: "#fff" }}>About Us</Link>
              <Link to="/" style={S.footerLink}>Products</Link>
              <Link to="/" style={S.footerLink}>Reports</Link>
            </div>

            {/* System Features */}
            <div>
              <h5 style={S.footerColTitle}>System Features</h5>
              <span style={S.footerLink}>Inventory Tracking</span>
              <span style={S.footerLink}>Low Stock Alerts</span>
              <span style={S.footerLink}>Role-Based Access</span>
              <span style={S.footerLink}>Transactions</span>
            </div>

            {/* Contact */}
            <div>
              <h5 style={S.footerColTitle}>Contact</h5>
              <p style={{ ...S.footerLink, marginBottom: "4px" }}>inventrack.support@gmail.com</p>
              <p style={{ ...S.footerLink }}>Bengaluru, India</p>
            </div>
          </div>
          
          <div style={{ borderTop: "1px solid rgba(255,255,255,0.03)", paddingTop: "20px", textAlign: "center" }}>
            <p style={{ fontSize: "0.8rem", fontWeight: "600", opacity: 0.6 }}>© 2026 InvenTrack. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}