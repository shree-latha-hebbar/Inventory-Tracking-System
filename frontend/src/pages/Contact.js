import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logo from '../assets/logo.png';

/* ─── Inline Styles (Sapphire & Slate Design) ─── */
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
    padding: "80px 5% 140px",
    background: "linear-gradient(135deg, #1e3a8a 0%, #1e293b 100%)",
    color: "#fff",
    textAlign: "center",
    clipPath: "ellipse(120% 100% at 50% 0%)",
  },
  heroTitle: { fontSize: "3.5rem", fontWeight: "950", letterSpacing: "-2px", marginBottom: "20px" },
  heroSub: { fontSize: "1.2rem", color: "rgba(255,255,255,0.7)", maxWidth: "600px", margin: "0 auto", lineHeight: 1.7 },
  
  /* ── Main Layout ── */
  container: {
    maxWidth: "1100px",
    margin: "-80px auto 100px",
    padding: "0 5%",
    position: "relative",
    zIndex: 10,
    display: "grid",
    gridTemplateColumns: "1fr 1.2fr",
    gap: "40px",
  },
  
  /* ── Info Cards ── */
  glassCard: {
    background: "rgba(255, 255, 255, 0.85)",
    backdropFilter: "blur(16px)",
    padding: "48px 40px",
    borderRadius: "32px",
    border: "1.5px solid rgba(226, 232, 240, 0.8)",
    boxShadow: "0 20px 40px rgba(0,0,0,0.04)"
  },
  tag: {
    display: "inline-block",
    fontSize: "0.75rem",
    fontWeight: "900",
    color: "#2563eb",
    background: "#eff6ff",
    border: "1px solid #bfdbfe",
    borderRadius: "20px",
    padding: "6px 14px",
    marginBottom: "24px",
    textTransform: "uppercase",
    letterSpacing: "0.5px"
  },
  infoItem: {
    display: "flex",
    alignItems: "center",
    gap: "20px",
    padding: "24px",
    background: "#fff",
    borderRadius: "24px",
    border: "1.5px solid #e2e8f0",
    marginBottom: "20px",
    transition: "transform 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275), box-shadow 0.4s",
    cursor: "pointer",
  },
  iconBox: (color) => ({
    width: "56px", height: "56px", borderRadius: "16px",
    background: `${color}15`, color: color,
    display: "flex", alignItems: "center", justifyContent: "center",
    flexShrink: 0,
    fontSize: "1.5rem"
  }),
  
  /* ── Form Elements ── */
  label: { display: "block", fontSize: "0.9rem", fontWeight: "800", color: "#475569", marginLeft: "4px" },
  input: (hasError) => ({
    width: "100%", padding: "16px 20px", borderRadius: "16px",
    border: hasError ? "2px solid #f87171" : "2px solid #e2e8f0",
    background: hasError ? "#fef2f2" : "#f8fafc",
    fontSize: "1rem", color: "#0f172a", fontWeight: "600",
    outline: "none", transition: "all 0.3s",
    marginTop: "8px", marginBottom: "4px",
    boxSizing: "border-box"
  }),
  errorText: { fontSize: "0.8rem", color: "#ef4444", fontWeight: "700", marginLeft: "4px", marginTop: "4px" },
  submitBtn: {
    width: "100%", padding: "18px", borderRadius: "16px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff", fontSize: "1.1rem", fontWeight: "900", border: "none", cursor: "pointer",
    boxShadow: "0 15px 30px rgba(37,99,235,0.3), inset 0 0 0 1px rgba(255,255,255,0.2)",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
    marginTop: "16px"
  },
  successBox: {
    background: "#f0fdf4", border: "1.5px solid #bbf7d0", borderRadius: "20px",
    padding: "24px", marginBottom: "32px", display: "flex", gap: "16px", alignItems: "flex-start"
  }
};

function Contact() {
  const navigate = useNavigate();

  // ── Form State ──
  const [formData, setFormData] = useState({ fullName: '', workEmail: '', message: '' });
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    window.scrollTo(0,0);
    // Inject Fonts & Animations
    if (!document.getElementById("contact-it-fonts")) {
      const style = document.createElement("style");
      style.id = "contact-it-fonts";
      style.textContent = `
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;700;800;900&display=swap');
        @keyframes itFadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .it-fade-up { animation: itFadeUp 0.8s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
        .it-delay-1 { animation-delay: 0.1s; }
        .it-delay-2 { animation-delay: 0.2s; }
        
        .contact-info-card:hover {
          transform: translateY(-8px) scale(1.02);
          box-shadow: 0 15px 30px rgba(0,0,0,0.06);
          border-color: #cbd5e1 !important;
        }
        .it-input-active:focus {
          border-color: #3b82f6 !important;
          background: #fff !important;
          box-shadow: 0 0 0 4px rgba(59, 130, 246, 0.1) !important;
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  function handleChange(e) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  }

  function validate() {
    const newErrors = {};
    if (!formData.fullName.trim()) newErrors.fullName = 'Please enter your full name.';
    if (!formData.workEmail.trim()) {
      newErrors.workEmail = 'Please enter your work email.';
    } else if (!/\\S+@\\S+\\.\\S+/.test(formData.workEmail)) {
      newErrors.workEmail = 'Enter a valid email address.';
    }
    if (!formData.message.trim()) newErrors.message = 'Please enter a message.';
    return newErrors;
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const validationErrors = validate();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    try {
      await axios.post("http://127.0.0.1:5000/api/notifications/contact", formData);
      setSubmitted(true);
      setFormData({ fullName: '', workEmail: '', message: '' });
    } catch (err) {
      alert("System dispatch failed. Please try again later.");
    }
  }

  return (
    <div style={S.root}>
      {/* ── Navigation ── */}
      <header style={S.header}>
        <div style={S.logoBox} onClick={() => navigate("/")}>
          <img src={logo} alt="IT" style={S.logoImg} />
          <span style={S.logoName}>InvenTrack</span>
        </div>
        <div style={{ display: "flex", gap: "32px", alignItems: "center" }}>
          <span style={{ fontSize: "0.85rem", fontWeight: "800", color: "#2563eb", cursor: "pointer", textTransform: "uppercase", borderBottom: "2px solid #2563eb" }}>Contact</span>
          <button style={S.btnPrimary} onClick={() => navigate("/login")}>Get Started</button>
        </div>
      </header>

      {/* ── Hero ── */}
      <section style={S.hero}>
        <h1 style={S.heroTitle} className="it-fade-up">Contact Logistics</h1>
        <p style={S.heroSub} className="it-fade-up it-delay-1">
          Direct lines to our enterprise support and distribution specialists. Whether you need bulk manufacturing intelligence or API access, we're ready.
        </p>
      </section>

      {/* ── Main Content ── */}
      <main style={S.container}>
        
        {/* ── Left Information ── */}
        <div className="it-fade-up it-delay-2" style={{ paddingTop: "20px" }}>
          <span style={S.tag}>Manufacturer Support</span>
          <h2 style={{ fontSize: "2.4rem", fontWeight: "950", color: "#0f172a", marginBottom: "16px", lineHeight: 1.1, letterSpacing: "-1px" }}>
            Direct Logistics &amp; Distribution
          </h2>
          <p style={{ color: "#64748b", fontSize: "1.1rem", lineHeight: 1.7, fontWeight: "500", marginBottom: "40px" }}>
            Questions about bulk manufacturing, supply chain logistics, or factory-direct distribution? Our industrial support team is standing by to assist with scale deployments.
          </p>

          <div>
            {[
              { title: "InvenTrack Mfg & Co.", sub: "Industrial Park, New City", color: "#3b82f6", icon: "🏢" },
              { title: "Direct Support", sub: "+1 (555) 789-0123", color: "#10b981", icon: "📞" },
              { title: "Logistics Email", sub: "logistics@inventrack-mfg.com", color: "#ec4899", icon: "✉️" }
            ].map((item, i) => (
              <div key={i} style={S.infoItem} className="contact-info-card">
                <div style={S.iconBox(item.color)}>{item.icon}</div>
                <div>
                  <p style={{ fontSize: "0.85rem", color: "#64748b", fontWeight: "700", marginBottom: "4px", textTransform: "uppercase", letterSpacing: "0.5px" }}>{item.title}</p>
                  <p style={{ fontSize: "1.05rem", fontWeight: "900", color: "#0f172a" }}>{item.sub}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── Right Form ── */}
        <div style={S.glassCard} className="it-fade-up it-delay-2">
          {submitted && (
            <div style={S.successBox}>
              <div style={{ background: "#22c55e", color: "#fff", width: "24px", height: "24px", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", fontSize: "0.9rem", flexShrink: 0 }}>✓</div>
              <div>
                <p style={{ fontSize: "1.05rem", fontWeight: "900", color: "#166534", marginBottom: "4px" }}>Message Transmitted!</p>
                <p style={{ fontSize: "0.9rem", color: "#15803d", fontWeight: "600" }}>Our logistics team has received your query and will dispatch a response within 24 hours.</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div style={{ marginBottom: "24px" }}>
              <label style={S.label}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                placeholder="John Doe"
                style={S.input(!!errors.fullName)}
                className="it-input-active"
              />
              {errors.fullName && <p style={S.errorText}>{errors.fullName}</p>}
            </div>

            <div style={{ marginBottom: "24px" }}>
              <label style={S.label}>Work Email</label>
              <input
                type="email"
                name="workEmail"
                value={formData.workEmail}
                onChange={handleChange}
                placeholder="john@company.com"
                style={S.input(!!errors.workEmail)}
                className="it-input-active"
              />
              {errors.workEmail && <p style={S.errorText}>{errors.workEmail}</p>}
            </div>

            <div style={{ marginBottom: "32px" }}>
              <label style={S.label}>Message Request</label>
              <textarea
                name="message"
                value={formData.message}
                onChange={handleChange}
                placeholder="Detail your fulfillment requirements..."
                rows={5}
                style={{ ...S.input(!!errors.message), resize: "none" }}
                className="it-input-active"
              />
              {errors.message && <p style={S.errorText}>{errors.message}</p>}
            </div>

            <button 
              type="submit" 
              style={S.submitBtn} 
              onMouseEnter={(e) => e.currentTarget.style.transform = "translateY(-3px)"} 
              onMouseLeave={(e) => e.currentTarget.style.transform = "translateY(0)"}
            >
              Dispatch Intel →
            </button>
          </form>
        </div>

      </main>
    </div>
  );
}

export default Contact;