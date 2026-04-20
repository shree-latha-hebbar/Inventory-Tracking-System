import React, { useState, useEffect, useRef } from "react";
import { useNavigate, Link } from "react-router-dom";

// Assets imports
import logo from "../assets/logo.png";
import heroImg from "../assets/hero_v2.png";
import featuresImg from "../assets/features.png";
import managementImg from "../assets/management_v2.png";
import storageImg from "../assets/storage_v2.png";

/* ─── Inline Styles ─────────────────────────────────────── */
const S = {
  /* Reset / Base */
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    color: "#0f172a",
    background: "#fff",
    overflowX: "hidden",
    scrollBehavior: "smooth",
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
    height: "72px",
    background: "rgba(255,255,255,0.85)",
    backdropFilter: "blur(20px)",
    borderBottom: "1.5px solid rgba(226, 232, 240, 0.4)",
    boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
    transition: "all .3s ease",
  },
  navLogo: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    textDecoration: "none",
    cursor: "pointer",
  },
  navLogoIcon: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
  },
  footerLogoIcon: {
    width: "80px",
    height: "80px",
    objectFit: "contain",
    marginBottom: "16px",
  },
  navBrand: {
    fontSize: "1.65rem",
    fontWeight: "950",
    color: "#1e3a8a",
    letterSpacing: "-1px",
  },
  navLinks: {
    display: "flex",
    alignItems: "center",
    gap: "6px",
    listStyle: "none",
    margin: 0,
    padding: 0,
  },
  navLink: {
    padding: "6px 14px",
    borderRadius: "8px",
    color: "#374151",
    fontWeight: "500",
    fontSize: "0.92rem",
    cursor: "pointer",
    transition: "all .2s",
    textDecoration: "none",
    border: "none",
    background: "transparent",
  },
  navSignIn: {
    padding: "8px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.9rem",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
    transition: "all .2s",
    letterSpacing: "0.2px",
  },
  hamburger: {
    display: "none",
    flexDirection: "column",
    gap: "5px",
    cursor: "pointer",
    padding: "4px",
    background: "none",
    border: "none",
  },
  hamburgerBar: {
    width: "24px",
    height: "2.5px",
    borderRadius: "2px",
    background: "#1e3a8a",
    transition: "all .3s",
  },
  mobileMenu: {
    position: "fixed",
    top: "68px",
    left: 0,
    right: 0,
    background: "#fff",
    borderBottom: "1px solid rgba(59,130,246,0.12)",
    padding: "16px 5% 24px",
    display: "flex",
    flexDirection: "column",
    gap: "4px",
    zIndex: 999,
    boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
  },
  mobileLink: {
    padding: "11px 14px",
    borderRadius: "10px",
    color: "#374151",
    fontWeight: "500",
    fontSize: "0.95rem",
    cursor: "pointer",
    border: "none",
    background: "transparent",
    textAlign: "left",
  },
  mobileSignIn: {
    marginTop: "8px",
    padding: "12px 20px",
    borderRadius: "10px",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.95rem",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 4px 14px rgba(59,130,246,0.3)",
  },

  /* ── Hero ── */
  hero: {
    minHeight: "100vh",
    paddingTop: "68px",
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    alignItems: "center",
    gap: "40px",
    padding: "120px 6% 80px",
    background:
      "linear-gradient(135deg, #f0f6ff 0%, #e8f0fe 40%, #f8faff 100%)",
    position: "relative",
    overflow: "hidden",
  },
  heroBadge: {
    display: "inline-flex",
    alignItems: "center",
    gap: "8px",
    background: "rgba(59,130,246,0.1)",
    border: "1px solid rgba(59,130,246,0.25)",
    borderRadius: "50px",
    padding: "5px 14px 5px 8px",
    marginBottom: "22px",
    color: "#2563eb",
    fontSize: "0.78rem",
    fontWeight: "600",
    letterSpacing: "0.5px",
    textTransform: "uppercase",
  },
  heroBadgeDot: {
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#3b82f6",
    animation: "pulse 2s infinite",
  },
  heroH1: {
    fontSize: "clamp(2.5rem, 5vw, 4.4rem)",
    fontWeight: "950",
    lineHeight: "1.05",
    color: "#0f172a",
    marginBottom: "24px",
    letterSpacing: "-2.5px",
  },
  heroH1Blue: { color: "#2563eb" },
  heroSubtitle: {
    fontSize: "1.05rem",
    color: "#475569",
    lineHeight: "1.75",
    marginBottom: "36px",
    maxWidth: "520px",
  },
  heroBtns: { display: "flex", gap: "14px", flexWrap: "wrap" },
  btnPrimary: {
    padding: "13px 28px",
    borderRadius: "12px",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.97rem",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 22px rgba(59,130,246,0.40)",
    transition: "all .25s",
    letterSpacing: "0.2px",
  },
  btnSecondary: {
    padding: "13px 28px",
    borderRadius: "12px",
    background: "#fff",
    color: "#2563eb",
    fontWeight: "700",
    fontSize: "0.97rem",
    cursor: "pointer",
    border: "2px solid #bfdbfe",
    transition: "all .25s",
    letterSpacing: "0.2px",
  },

  /* Hero visual cards */
  heroVisual: {
    display: "grid",
    gridTemplateColumns: "1fr 1fr",
    gap: "14px",
    position: "relative",
  },
  heroCard: {
    background: "#fff",
    borderRadius: "18px",
    padding: "20px",
    boxShadow: "0 8px 30px rgba(59,130,246,0.10)",
    border: "1px solid rgba(59,130,246,0.08)",
    transition: "transform .3s",
  },
  heroCardIcon: {
    fontSize: "26px",
    marginBottom: "10px",
  },
  heroCardLabel: {
    fontSize: "0.75rem",
    color: "#94a3b8",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "0.8px",
    marginBottom: "4px",
  },
  heroCardVal: {
    fontSize: "1.55rem",
    fontWeight: "800",
    color: "#0f172a",
    lineHeight: "1",
  },
  heroCardSub: {
    fontSize: "0.78rem",
    color: "#22c55e",
    fontWeight: "600",
    marginTop: "5px",
  },
  heroCardSubRed: {
    fontSize: "0.78rem",
    color: "#ef4444",
    fontWeight: "600",
    marginTop: "5px",
  },
  heroCardWide: {
    gridColumn: "1 / -1",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    borderRadius: "18px",
    padding: "18px 22px",
    color: "#fff",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  heroCardWideTxt: { fontSize: "0.9rem", fontWeight: "700", opacity: 0.95 },
  heroCardWideSub: { fontSize: "0.75rem", opacity: 0.75, marginTop: "2px" },
  heroStockBar: {
    height: "6px",
    borderRadius: "4px",
    background: "rgba(255,255,255,0.25)",
    marginTop: "10px",
    overflow: "hidden",
  },
  heroStockFill: {
    height: "100%",
    borderRadius: "4px",
    background: "#fff",
  },

  /* ── Section shared ── */
  section: {
    padding: "90px 6%",
  },
  sectionAlt: {
    padding: "90px 6%",
    background: "#f8faff",
  },
  sectionTag: {
    display: "inline-block",
    background: "rgba(59,130,246,0.09)",
    color: "#2563eb",
    borderRadius: "50px",
    padding: "4px 14px",
    fontSize: "0.76rem",
    fontWeight: "700",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "14px",
    border: "1px solid rgba(59,130,246,0.18)",
  },
  sectionH2: {
    fontSize: "clamp(1.7rem, 3vw, 2.5rem)",
    fontWeight: "900",
    color: "#0f172a",
    marginBottom: "14px",
    letterSpacing: "-0.8px",
    lineHeight: "1.15",
  },
  sectionSub: {
    fontSize: "1rem",
    color: "#64748b",
    lineHeight: "1.7",
    maxWidth: "580px",
    marginBottom: "50px",
  },
  grid3: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
    gap: "22px",
  },
  grid4: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    gap: "18px",
  },

  /* Feature cards */
  featureCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "18px",
    padding: "28px 24px",
    transition: "all .3s",
    cursor: "default",
    position: "relative",
    overflow: "hidden",
  },
  featureIconWrap: {
    width: "52px",
    height: "52px",
    borderRadius: "14px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "24px",
    marginBottom: "18px",
  },
  featureH3: {
    fontSize: "1.05rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "8px",
  },
  featureP: { fontSize: "0.88rem", color: "#64748b", lineHeight: "1.65" },

  /* Module cards */
  moduleCard: {
    background: "#fff",
    border: "1px solid #e2e8f0",
    borderRadius: "16px",
    padding: "24px 20px",
    transition: "all .3s",
    cursor: "pointer",
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },
  moduleIconWrap: {
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "20px",
  },
  moduleH3: {
    fontSize: "0.98rem",
    fontWeight: "800",
    color: "#0f172a",
    margin: 0,
  },
  moduleP: { fontSize: "0.82rem", color: "#64748b", lineHeight: "1.55", margin: 0 },
  moduleArrow: {
    fontSize: "0.8rem",
    color: "#3b82f6",
    fontWeight: "700",
    marginTop: "auto",
  },

  /* Workflow */
  workflowGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
    gap: "24px",
    position: "relative",
    padding: "12px",
  },
  workflowStep: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    textAlign: "center",
    padding: "36px 20px",
    position: "relative",
    background: "#fff",
    borderRadius: "28px",
    border: "1.5px solid #e2e8f0",
    transition: "all 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
    boxShadow: "0 4px 12px rgba(0,0,0,0.03)",
  },
  workflowNum: {
    width: "44px",
    height: "44px",
    borderRadius: "50%",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    color: "#fff",
    fontWeight: "900",
    fontSize: "1rem",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "14px",
    boxShadow: "0 4px 14px rgba(59,130,246,0.35)",
    zIndex: 1,
  },
  workflowIcon: { fontSize: "20px", marginBottom: "10px" },
  workflowTitle: {
    fontSize: "0.88rem",
    fontWeight: "800",
    color: "#0f172a",
    marginBottom: "5px",
  },
  workflowDesc: { fontSize: "0.78rem", color: "#64748b", lineHeight: "1.5" },
  workflowConnector: {
    position: "absolute",
    top: "52px",
    right: "-18px",
    zIndex: 2,
    color: "#bfdbfe",
    fontSize: "1.4rem",
    fontWeight: "900",
  },

  /* Roles */
  roleCard: {
    borderRadius: "20px",
    padding: "36px 28px",
    position: "relative",
    overflow: "hidden",
  },
  roleIcon: {
    fontSize: "2.2rem",
    marginBottom: "18px",
  },
  roleTitle: {
    fontSize: "1.25rem",
    fontWeight: "900",
    marginBottom: "8px",
    letterSpacing: "-0.3px",
  },
  roleSubtitle: {
    fontSize: "0.82rem",
    fontWeight: "600",
    opacity: 0.7,
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "20px",
  },
  roleList: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },
  roleListItem: {
    fontSize: "0.9rem",
    display: "flex",
    alignItems: "center",
    gap: "9px",
    fontWeight: "500",
  },

  /* CTA */
  cta: {
    padding: "90px 6%",
    background: "linear-gradient(135deg, #1e3a8a 0%, #2563eb 50%, #3b82f6 100%)",
    textAlign: "center",
    position: "relative",
    overflow: "hidden",
  },
  ctaH2: {
    fontSize: "clamp(1.8rem, 3.5vw, 3rem)",
    fontWeight: "900",
    color: "#fff",
    marginBottom: "16px",
    letterSpacing: "-1px",
    lineHeight: "1.15",
  },
  ctaP: {
    fontSize: "1.05rem",
    color: "rgba(255,255,255,0.8)",
    marginBottom: "40px",
    maxWidth: "520px",
    margin: "0 auto 40px",
    lineHeight: "1.7",
  },
  ctaBtns: {
    display: "flex",
    gap: "16px",
    justifyContent: "center",
    flexWrap: "wrap",
  },
  ctaBtnPrimary: {
    padding: "14px 32px",
    borderRadius: "12px",
    background: "#fff",
    color: "#2563eb",
    fontWeight: "800",
    fontSize: "0.97rem",
    cursor: "pointer",
    border: "none",
    boxShadow: "0 6px 22px rgba(0,0,0,0.18)",
    transition: "all .25s",
  },
  ctaBtnSecondary: {
    padding: "14px 32px",
    borderRadius: "12px",
    background: "transparent",
    color: "#fff",
    fontWeight: "700",
    fontSize: "0.97rem",
    cursor: "pointer",
    border: "2px solid rgba(255,255,255,0.45)",
    transition: "all .25s",
  },

  /* Footer */
  footer: {
    background: "#0f172a",
    padding: "56px 6% 32px",
    color: "#94a3b8",
  },
  footerGrid: {
    display: "grid",
    gridTemplateColumns: "2fr 1fr 1fr",
    gap: "40px",
    marginBottom: "48px",
  },
  footerBrand: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "16px",
  },
  footerBrandIcon: {
    width: "34px",
    height: "34px",
    borderRadius: "9px",
    background: "linear-gradient(135deg,#2563eb,#3b82f6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "800",
  },
  footerBrandName: {
    color: "#f1f5f9",
    fontWeight: "800",
    fontSize: "1.05rem",
  },
  footerDesc: { fontSize: "0.87rem", lineHeight: "1.7", maxWidth: "280px" },
  footerHeading: {
    color: "#e2e8f0",
    fontWeight: "800",
    fontSize: "0.9rem",
    marginBottom: "16px",
    letterSpacing: "0.3px",
  },
  footerLinks: {
    listStyle: "none",
    padding: 0,
    margin: 0,
    display: "flex",
    flexDirection: "column",
    gap: "9px",
  },
  footerLink: {
    fontSize: "0.87rem",
    cursor: "pointer",
    transition: "color .2s",
    textDecoration: "none",
    color: "#94a3b8",
  },
  footerDivider: {
    borderTop: "1px solid #1e293b",
    paddingTop: "28px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "10px",
  },
  footerCopy: { fontSize: "0.82rem" },
};

/* ─── Data ─────────────────────────────────────────────── */
const FEATURES = [
  {
    icon: "📦",
    title: "Product Management",
    desc: "Add, edit, and organize your entire product catalogue with detailed SKUs, categories, and pricing.",
    color: "#dbeafe",
    iconColor: "#2563eb",
  },
  {
    icon: "📊",
    title: "Stock Tracking",
    desc: "Real-time visibility into current stock levels across all warehouse locations and categories.",
    color: "#dcfce7",
    iconColor: "#16a34a",
  },
  {
    icon: "🔔",
    title: "Low Stock Alerts",
    desc: "Automated alerts notify the right team members when inventory drops below defined thresholds.",
    color: "#fef9c3",
    iconColor: "#ca8a04",
  },
  {
    icon: "🔍",
    title: "Search & Reports",
    desc: "Powerful search filters and exportable reports help you make data-driven inventory decisions.",
    color: "#fce7f3",
    iconColor: "#db2777",
  },
  {
    icon: "🛡️",
    title: "Role-Based Access",
    desc: "Granular permission controls ensure each team member only sees and does what they should.",
    color: "#ede9fe",
    iconColor: "#7c3aed",
  },
  {
    icon: "🔄",
    title: "Transaction Management",
    desc: "Track every stock movement — inbound, outbound, sales, and adjustments — with full history.",
    color: "#ffedd5",
    iconColor: "#ea580c",
  },
];

const WORKFLOW = [
  { num: 1, icon: "🔐", title: "Secure Perimeter Access", desc: "Enterprise-grade authentication with multi-factor role validation.", shadow: "rgba(37, 99, 235, 0.1)" },
  { num: 2, icon: "✅", title: "Logic Verification Gate", desc: "System protocols establish persistent permission tokens.", shadow: "rgba(16, 185, 129, 0.1)" },
  { num: 3, icon: "🔍", title: "Real-time Engine Scan", desc: "Dynamic scanning across unified logistics databases.", shadow: "rgba(59, 130, 246, 0.1)" },
  { num: 4, icon: "📊", title: "Ledger Equilibrium Check", desc: "Sub-second verification of global stock liquidity levels.", shadow: "rgba(37, 99, 235, 0.1)" },
  { num: 5, icon: "🛒", title: "Procurement Threshold Trigger", desc: "Automated replenishment logic based on predictive analytics.", shadow: "rgba(37, 99, 235, 0.1)" },
  { num: 6, icon: "📥", title: "Warehouse Intake Sync", desc: "Real-time reconciliation of physical stock arrivals.", shadow: "rgba(16, 185, 129, 0.1)" },
  { num: 7, icon: "💰", title: "Dispatch Ledger Entry", desc: "Automated transaction logging for high-velocity sales.", shadow: "rgba(59, 130, 246, 0.1)" },
  { num: 8, icon: "📋", title: "Logistics Analytics Intel", desc: "Generating strategic summaries for operational intelligence.", shadow: "rgba(37, 99, 235, 0.1)" },
];

const ROLES = [
  {
    icon: "👑",
    title: "Admin",
    subtitle: "Full Access",
    perms: ["Manage all products & categories", "Add / remove system users", "Set role permissions", "View all reports & logs", "Configure low-stock thresholds"],
    bg: "linear-gradient(135deg,#1e3a8a,#2563eb)",
    textColor: "#fff",
    checkColor: "rgba(255,255,255,0.6)",
  },
  {
    icon: "📋",
    title: "Manager",
    subtitle: "Operational Access",
    perms: ["Order and receive stock", "Track inventory movements", "Approve reorder requests", "View inventory reports", "Manage supplier contacts"],
    bg: "linear-gradient(135deg,#f0f6ff,#e8f0fe)",
    textColor: "#1e3a8a",
    checkColor: "#3b82f6",
  },
  {
    icon: "🏷️",
    title: "Staff",
    subtitle: "Limited Access",
    perms: ["Browse product catalogue", "Process product sales", "Update stock on arrivals", "View own transactions", "Flag low-stock items"],
    bg: "#fff",
    textColor: "#0f172a",
    checkColor: "#3b82f6",
    border: "1px solid #e2e8f0",
  },
];

/* ─── Component ─────────────────────────────────────────── */
export default function Home() {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [hoveredFeature, setHoveredFeature] = useState(null);
  const [hoveredRole, setHoveredRole] = useState(null);
  const [hoveredWorkflow, setHoveredWorkflow] = useState(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    setMenuOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const goLogin = () => navigate("/login");
  const goAbout = () => navigate("/about");
  const goContact = () => navigate("/contact");

  /* Inject keyframes & Google Font once */
  useEffect(() => {
    if (!document.getElementById("it-styles")) {
      const style = document.createElement("style");
      style.id = "it-styles";
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900;1000&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @keyframes itFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes floatA { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-10px)} }
        @keyframes floatB { 0%,100%{transform:translateY(0)} 50%{transform:translateY(-7px)} }
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) both; }
        .it-delay-1 { animation-delay: .12s; }
        .it-delay-2 { animation-delay: .24s; }
        .it-delay-3 { animation-delay: .36s; }
        .it-float-a { animation: floatA 4s ease-in-out infinite; }
        .it-float-b { animation: floatB 5s ease-in-out infinite; }
        @media (max-width: 900px) {
          .it-nav-links { display: none !important; }
          .it-hamburger { display: flex !important; }
          .it-hero { grid-template-columns: 1fr !important; padding: 100px 6% 60px !important; }
          .it-hero-visual { display: none !important; }
          .it-footer-grid { grid-template-columns: 1fr !important; }
          .it-workflow-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .it-workflow-connector { display: none !important; }
          .it-features-hero { grid-template-columns: 1fr !important; }
        }
        @media (max-width: 600px) {
          .it-workflow-grid { grid-template-columns: 1fr !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={S.root}>

      {/* ── Navbar ── */}
      <nav style={{
        ...S.nav,
        boxShadow: scrolled ? "0 4px 24px rgba(59,130,246,0.13)" : S.nav.boxShadow,
      }}>
        <div style={S.navLogo} onClick={() => scrollTo("hero")}>
          <img src={logo} alt="InvenTrack Logo" style={S.navLogoIcon} />
          <span style={S.navBrand}>InvenTrack</span>
        </div>

        {/* Desktop links */}
        <ul style={S.navLinks} className="it-nav-links">
          {["Features"].map((l) => (
            <li key={l}>
              <button
                style={S.navLink}
                onClick={() => scrollTo(l.toLowerCase())}
                onMouseEnter={(e) => { e.target.style.background = "#f0f6ff"; e.target.style.color = "#2563eb"; }}
                onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#374151"; }}
              >{l}</button>
            </li>
          ))}
          <li>
            <Link 
              to="/contact" 
              style={{ ...S.navLink, textDecoration: "none", display: "inline-block" }}
              onMouseEnter={(e) => { e.target.style.background = "#f0f6ff"; e.target.style.color = "#2563eb"; }}
              onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#374151"; }}
            >Contact</Link>
          </li>
          <li>
            <button
              style={S.navLink}
              onClick={goAbout}
              onMouseEnter={(e) => { e.target.style.background = "#f0f6ff"; e.target.style.color = "#2563eb"; }}
              onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#374151"; }}
            >About Us</button>
          </li>
        </ul>

        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <button
            style={S.navSignIn}
            className="it-nav-links"
            onClick={goLogin}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 8px 22px rgba(59,130,246,0.50)"; }}
            onMouseLeave={(e) => { e.target.style.transform = ""; e.target.style.boxShadow = S.navSignIn.boxShadow; }}
          >Sign In</button>

          {/* Hamburger */}
          <button
            style={{ ...S.hamburger, display: "none" }}
            className="it-hamburger"
            onClick={() => setMenuOpen((p) => !p)}
            aria-label="Toggle menu"
          >
            <span style={{ ...S.hamburgerBar, transform: menuOpen ? "rotate(45deg) translateY(7px)" : "" }} />
            <span style={{ ...S.hamburgerBar, opacity: menuOpen ? 0 : 1 }} />
            <span style={{ ...S.hamburgerBar, transform: menuOpen ? "rotate(-45deg) translateY(-7px)" : "" }} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div style={S.mobileMenu}>
          {["Features"].map((l) => (
            <button
              key={l}
              style={S.mobileLink}
              onClick={() => scrollTo(l.toLowerCase())}
              onMouseEnter={(e) => { e.target.style.background = "#f0f6ff"; }}
              onMouseLeave={(e) => { e.target.style.background = "transparent"; }}
            >{l}</button>
          ))}
          <Link to="/contact" style={{ ...S.mobileLink, textDecoration: "none" }}>Contact</Link>
          <button style={S.mobileLink} onClick={goAbout}>About Us</button>
          <button style={S.mobileSignIn} onClick={goLogin}>Sign In →</button>
        </div>
      )}

      {/* ── Hero ── */}
      <section id="hero" style={S.hero} className="it-hero">
        {/* Left */}
        <div>
          <h1 style={S.heroH1} className="it-fade-up it-delay-1">
            Know what you have.{" "}
            <span style={S.heroH1Blue}>Before you need it.</span>
          </h1>
          <p style={S.heroSubtitle} className="it-fade-up it-delay-2">
            InvenTrack gives your team complete control over product inventory — track stock levels in real time, receive low-stock alerts, manage transactions, and generate reports — all with role-based access designed for your organisation.
          </p>
          <div style={S.heroBtns} className="it-fade-up it-delay-3">
            <button
              style={S.btnPrimary}
              onClick={goLogin}
              onMouseEnter={(e) => { e.target.style.transform = "translateY(-2px)"; e.target.style.boxShadow = "0 10px 28px rgba(59,130,246,0.50)"; }}
              onMouseLeave={(e) => { e.target.style.transform = ""; e.target.style.boxShadow = S.btnPrimary.boxShadow; }}
            >Sign In →</button>
            <button
              style={S.btnSecondary}
              onClick={() => scrollTo("features")}
              onMouseEnter={(e) => { e.target.style.background = "#eff6ff"; e.target.style.borderColor = "#93c5fd"; }}
              onMouseLeave={(e) => { e.target.style.background = "#fff"; e.target.style.borderColor = "#bfdbfe"; }}
            >Learn More</button>
          </div>
        </div>

        {/* Right — Professional Imagery Collage */}
        <div style={{ ...S.heroVisual, position: "relative", gridTemplateColumns: "1fr 1fr", gridTemplateRows: "1fr 1fr", height: "500px" }} className="it-hero-visual">
          {/* Main Hero Image Backdrop Polish */}
          <div style={{
            position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)",
            width: "120%", height: "120%", zIndex: 0, opacity: 0.3, filter: "blur(60px)", pointerEvents: "none"
          }}>
            <img src={heroImg} alt="" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          {/* Collage Images */}
          <div style={{ 
            gridColumn: "1 / 2", gridRow: "1 / 3", 
            borderRadius: "24px", overflow: "hidden", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.4)",
            position: "relative", zIndex: 1 
          }}>
            <img src={managementImg} alt="Warehouse Operations" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{ 
            gridColumn: "2 / 3", gridRow: "1 / 2", 
            borderRadius: "24px", overflow: "hidden", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.4)",
            position: "relative", zIndex: 1, marginBottom: "14px"
          }}>
            <img src={heroImg} alt="Storage Racks" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>

          <div style={{ 
            gridColumn: "2 / 3", gridRow: "2 / 3", 
            borderRadius: "24px", overflow: "hidden", 
            boxShadow: "0 20px 40px rgba(0,0,0,0.12)", border: "1px solid rgba(255,255,255,0.4)",
            position: "relative", zIndex: 1 
          }}>
            <img src={storageImg} alt="Inventory Management" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>

        {/* Background decoration */}
        <div style={{
          position: "absolute", top: "-60px", right: "-60px",
          width: "340px", height: "340px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(59,130,246,0.12),transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "10%",
          width: "220px", height: "220px", borderRadius: "50%",
          background: "radial-gradient(circle,rgba(59,130,246,0.08),transparent 70%)",
          pointerEvents: "none",
        }} />
      </section>

      {/* ── Features ── */}
      <section id="features" style={S.section}>
        <div style={S.sectionTag}>Key Features</div>
        <h2 style={S.sectionH2}>Everything your team needs</h2>
        <p style={S.sectionSub}>
          Purpose-built tools that give every role in your organisation the visibility and control they need to keep inventory running smoothly.
        </p>

        {/* Requirements Context — Feature Mockup */}
        <div style={{ 
          marginBottom: "60px", 
          borderRadius: "24px", 
          overflow: "hidden", 
          boxShadow: "0 30px 60px rgba(59,130,246,0.15)",
          border: "1px solid #e2e8f0",
          background: "#fff",
          display: "grid",
          gridTemplateColumns: "1.2fr 1fr",
          alignItems: "center"
        }} className="it-features-hero">
          <div style={{ padding: "40px" }}>
            <h3 style={{ fontSize: "1.5rem", fontWeight: "900", marginBottom: "16px", color: "#0f172a" }}>Requirement-Driven Intelligence</h3>
            <p style={{ color: "#64748b", lineHeight: "1.7", marginBottom: "24px" }}>
              Our system is designed according to strict operational requirements, ensuring that every stock movement is logged, verified, and reported with 100% accuracy. Experience a dashboard that thinks ahead.
            </p>
            <button style={S.btnPrimary} onClick={goLogin}>Explore Dashboard →</button>
          </div>
          <div style={{ height: "400px", background: "#f8faff" }}>
            <img src={featuresImg} alt="System Requirements" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
          </div>
        </div>
        <div style={S.grid3}>
          {FEATURES.map((f, i) => (
            <div
              key={i}
              style={{
                ...S.featureCard,
                transform: hoveredFeature === i ? "translateY(-6px)" : "",
                boxShadow: hoveredFeature === i ? "0 16px 40px rgba(59,130,246,0.14)" : "0 2px 12px rgba(0,0,0,0.05)",
                borderColor: hoveredFeature === i ? "#bfdbfe" : "#e2e8f0",
              }}
              onMouseEnter={() => setHoveredFeature(i)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div style={{ ...S.featureIconWrap, background: f.color }}>
                {f.icon}
              </div>
              <h3 style={S.featureH3}>{f.title}</h3>
              <p style={S.featureP}>{f.desc}</p>
              {hoveredFeature === i && (
                <div style={{
                  position: "absolute", top: 0, left: 0, right: 0,
                  height: "3px", borderRadius: "18px 18px 0 0",
                  background: `linear-gradient(90deg, ${f.iconColor}, transparent)`,
                }} />
              )}
            </div>
          ))}
        </div>
      </section>
      {/* ── How It Works (Premium Winding Path) ── */}
      <section style={{ ...S.section, background: "#fff", position: "relative", overflow: "hidden" }}>
        <div style={{ textAlign: "center", marginBottom: "80px", position: "relative", zIndex: 10 }}>
          <div style={{ ...S.sectionTag, display: "block", width: "fit-content", margin: "0 auto 18px", color: "#2563eb", background: "#eff6ff", border: "1px solid #bfdbfe" }}>How It Works</div>
          <h2 style={{ ...S.sectionH2, textAlign: "center", color: "#0f172a", fontSize: "3.2rem" }}>Integrated Logistics Flow</h2>
          <p style={{ ...S.sectionSub, margin: "0 auto", textAlign: "center", fontSize: "1.2rem", maxWidth: "700px" }}>
            The InvenTrack engine powers eight sequential logic gates, ensuring your supply chain remains fluid, secure, and data-driven.
          </p>
        </div>

        <div style={{ maxWidth: "1200px", margin: "0 auto", position: "relative" }}>
          {/* SVG Connector Path */}
          <svg style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", zIndex: 0, pointerEvents: "none" }} viewBox="0 0 1200 600">
            <defs>
              <linearGradient id="flowGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#2563eb" stopOpacity="0.2" />
                <stop offset="50%" stopColor="#2563eb" stopOpacity="0.6" />
                <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.2" />
              </linearGradient>
            </defs>
            {/* Winding Path: 1-4 R to L, then 5-8 L to R */}
            <path 
              d="M150,150 L450,150 L750,150 L1050,150 Q1150,150 1150,300 L1150,300 Q1150,450 1050,450 L750,450 L450,450 L150,450" 
              fill="none" 
              stroke="url(#flowGrad)" 
              strokeWidth="3" 
              strokeDasharray="12,12"
              style={{ animation: "liquidFlow 10s linear infinite" }}
            />
          </svg>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "2px", position: "relative", zIndex: 2 }}>
            {WORKFLOW.map((w, i) => {
              // Logic for S-Curve: Row 1 (1-4), Row 2 (8-5)
              const displayOrder = i < 4 ? i : (11 - i); 
              const step = WORKFLOW[displayOrder];
              
              return (
                <div 
                  key={i} 
                  style={{ 
                    padding: "60px 40px",
                    background: "#fff",
                    border: "1px solid rgba(226, 232, 240, 0.8)",
                    position: "relative",
                    overflow: "hidden",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    textAlign: "center",
                    transition: "all 0.3s ease",
                    minHeight: "300px",
                    cursor: "default"
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.zIndex = 10;
                    e.currentTarget.style.boxShadow = "0 20px 40px rgba(37,99,235,0.08)";
                    e.currentTarget.style.borderColor = "#bfdbfe";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.zIndex = 2;
                    e.currentTarget.style.boxShadow = "none";
                    e.currentTarget.style.borderColor = "rgba(226, 232, 240, 0.8)";
                  }}
                >
                  {/* Decorative 3D Background Icon */}
                  <div style={{ position: "absolute", right: "-10px", bottom: "-10px", fontSize: "10rem", opacity: 0.05, transform: "rotate(-15deg)", pointerEvents: "none", zIndex: 0 }}>
                    {step.icon}
                  </div>

                  <div style={{ 
                    width: "56px", height: "56px", borderRadius: "50%", 
                    background: "linear-gradient(135deg, #2563eb, #3b82f6)",
                    color: "#fff", fontWeight: "950", fontSize: "1.2rem",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    marginBottom: "32px", position: "relative", zIndex: 1,
                    boxShadow: "0 8px 20px rgba(37,99,235,0.3)"
                  }}>
                    {step.num}
                  </div>

                  <h3 style={{ fontSize: "1.25rem", fontWeight: "900", color: "#0f172a", marginBottom: "12px", position: "relative", zIndex: 1 }}>
                    {step.title}
                  </h3>
                  <p style={{ fontSize: "0.95rem", color: "#64748b", lineHeight: "1.6", fontWeight: "500", position: "relative", zIndex: 1 }}>
                    {step.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>


      {/* Redundant Contact Section Removed - User directed to /contact */}

      {/* ── Footer ── */}
      <footer style={S.footer}>
        <div style={S.footerGrid} className="it-footer-grid">
          <div>
            <div style={S.footerBrand}>
              <img src={logo} alt="InvenTrack Logo" style={{ width: "32px", height: "32px", objectFit: "contain" }} />
              <span style={S.footerBrandName}>InvenTrack</span>
            </div>
            <p style={S.footerDesc}>
              A full-featured logistics solution built for teams who need real-time stock visibility, low-stock alerts, and role-based access — all in one clean interface.
            </p>
          </div>
          <div>
            <div style={S.footerHeading}>Quick Links</div>
            <ul style={S.footerLinks}>
              {["Features"].map((l) => (
                <li key={l}>
                  <a
                    style={S.footerLink}
                    onClick={() => scrollTo(l.toLowerCase())}
                    onMouseEnter={(e) => { e.target.style.color = "#93c5fd"; }}
                    onMouseLeave={(e) => { e.target.style.color = "#94a3b8"; }}
                  >{l}</a>
                </li>
              ))}
              <li>
                <Link 
                  to="/contact" 
                  style={{ ...S.footerLink, textDecoration: "none" }}
                  onMouseEnter={(e) => { e.target.style.color = "#93c5fd"; }}
                  onMouseLeave={(e) => { e.target.style.color = "#94a3b8"; }}
                >Contact</Link>
              </li>
            </ul>
          </div>
          <div>
            <div style={S.footerHeading}>System</div>
            <ul style={S.footerLinks}>
              {["Dashboard", "Products", "Transactions", "Reports"].map((l) => (
                <li key={l}>
                  <a
                    style={S.footerLink}
                    onClick={goLogin}
                    onMouseEnter={(e) => { e.target.style.color = "#93c5fd"; }}
                    onMouseLeave={(e) => { e.target.style.color = "#94a3b8"; }}
                  >{l}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div style={S.footerDivider}>
          <p style={S.footerCopy}>© {new Date().getFullYear()} InvenTrack. All rights reserved.</p>
          <p style={S.footerCopy}>Built with React · Role-Based Manufacturer Support Solution</p>
        </div>
      </footer>

    </div>
  );
}