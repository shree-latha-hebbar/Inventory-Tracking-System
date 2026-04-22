import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

// Assets imports
import logo from "../assets/logo.png";
import heroImg from "../assets/hero.png";
import storageImg from "../assets/storage.png";

/* ─── Inline Styles ─────────────────────────────────────── */
const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    height: "100vh",
    display: "flex",
    background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    overflow: "hidden",
    color: "#0f172a",
  },

  /* ── Left Side: Visual ── */
  visual: {
    flex: 1,
    position: "relative",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "0 8%",
    background: "#1e293b",
    color: "#fff",
    overflow: "hidden",
  },
  visualImg: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    objectFit: "cover",
    opacity: 0.4,
    transform: "scale(1.1)",
    filter: "blur(2px)",
  },
  visualOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    background: "linear-gradient(135deg, rgba(37,99,235,0.7), rgba(15,23,42,1))",
    zIndex: 1,
  },
  visualContent: {
    position: "relative",
    zIndex: 2,
    maxWidth: "500px",
  },
  visualTag: {
    display: "inline-block",
    padding: "6px 14px",
    background: "rgba(255,255,255,0.15)",
    backdropFilter: "blur(8px)",
    borderRadius: "20px",
    fontSize: "0.82rem",
    fontWeight: "600",
    marginBottom: "24px",
    border: "1px solid rgba(255,255,255,0.2)",
    letterSpacing: "0.5px",
  },
  visualH1: {
    fontSize: "3.5rem",
    fontWeight: "950",
    lineHeight: "1.05",
    marginBottom: "20px",
    letterSpacing: "-2px",
  },
  visualDesc: {
    fontSize: "1.1rem",
    color: "rgba(255,255,255,0.85)",
    lineHeight: "1.6",
  },

  /* ── Right Side: Form ── */
  formSide: {
    width: "600px",
    display: "flex",
    flexDirection: "column",
    justifyContent: "center",
    padding: "40px 80px",
    background: "rgba(255,255,255,0.02)",
    backdropFilter: "blur(40px)",
    position: "relative",
    borderLeft: "1px solid rgba(255,255,255,0.05)",
  },
  backToHome: {
    position: "absolute",
    top: "30px",
    right: "40px",
    padding: "8px 16px",
    borderRadius: "10px",
    background: "transparent",
    color: "#64748b",
    fontSize: "0.85rem",
    fontWeight: "600",
    border: "1px solid #e2e8f0",
    cursor: "pointer",
    transition: "all .2s",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },

  /* ── Form Items ── */
  brandWrap: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "40px",
  },
  brandName: {
    fontSize: "1.6rem",
    fontWeight: "950",
    color: "#1e3a8a",
    letterSpacing: "-1px",
  },
  header: {
    marginBottom: "32px",
  },
  h2: {
    fontSize: "1.85rem",
    fontWeight: "800",
    marginBottom: "8px",
    color: "#0f172a",
  },
  sub: {
    color: "#64748b",
    fontSize: "0.95rem",
  },

  field: {
    marginBottom: "20px",
  },
  label: {
    display: "block",
    fontSize: "0.82rem",
    fontWeight: "700",
    color: "#475569",
    marginBottom: "8px",
    letterSpacing: "0.3px",
  },
  input: {
    width: "100%",
    height: "56px",
    padding: "0 20px",
    borderRadius: "16px",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#0f172a",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    background: "#f8fafc",
  },
  inputFocus: {
    borderColor: "#2563eb",
    background: "#fff",
    boxShadow: "0 0 0 4px rgba(37,99,235,0.08)",
  },

  roleGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "10px",
    marginBottom: "24px",
  },
  roleCard: {
    padding: "12px 6px",
    borderRadius: "12px",
    border: "1.5px solid #e2e8f0",
    background: "#fff",
    cursor: "pointer",
    transition: "all .2s",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    gap: "6px",
  },
  roleActive: {
    borderColor: "#2563eb",
    background: "#eff6ff",
    boxShadow: "0 4px 12px rgba(37,99,235,0.08)",
  },
  roleIcon: {
    fontSize: "1.3rem",
  },
  roleLabel: {
    fontSize: "0.75rem",
    fontWeight: "700",
    color: "#1e3a8a",
  },

  options: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "30px",
    fontSize: "0.85rem",
  },
  checkboxWrap: {
    display: "flex",
    alignItems: "center",
    gap: "8px",
    color: "#64748b",
    cursor: "pointer",
  },
  forgot: {
    color: "#2563eb",
    fontWeight: "600",
    cursor: "pointer",
    background: "none",
    border: "none",
    padding: 0,
  },

  signInBtn: {
    width: "100%",
    height: "56px",
    borderRadius: "16px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: "800",
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 30px rgba(37,99,235,0.3), inset 0 0 0 1px rgba(255,255,255,0.1)",
    transition: "all .3s cubic-bezier(0.4, 0, 0.2, 1)",
    marginBottom: "24px",
    letterSpacing: "0.2px",
  },

  footerNotice: {
    textAlign: "center",
    fontSize: "0.78rem",
    color: "#94a3b8",
    marginTop: "auto",
  },
};

function Login() {
  const navigate = useNavigate();

  const [selectedRole, setSelectedRole] = useState("manager");
  const [email, setEmail] = useState("manager@inventrack.com");
  const [password, setPassword] = useState("password123");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [focusedField, setFocusedField] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const rolePresets = {
    manager: { email: "manager@inventrack.com", password: "password123" },
    staff: { email: "staff@inventrack.com", password: "password123" },
    admin: { email: "admin@inventrack.com", password: "admin123" },
  };

  const switchRole = (role) => {
    setSelectedRole(role);
    setEmail(rolePresets[role].email);
    setPassword(rolePresets[role].password);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/api/auth/login", {
        email: email,
        password: password,
      });

      if (response.status === 200) {
        const { access_token, user } = response.data;
        localStorage.setItem("access_token", access_token);
        localStorage.setItem("user", JSON.stringify(user));
        localStorage.setItem("role", user.role || selectedRole);
        navigate("/dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      setError(err.response?.data?.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { id: "manager", label: "Manager", icon: "📊" },
    { id: "staff", label: "Staff", icon: "🧑‍💼" },
    { id: "admin", label: "Admin", icon: "🛡️" },
  ];

  /* Inject Design Assets */
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
        @media (max-width: 1024px) {
          .it-visual { display: none !important; }
          .it-form-side { width: 100% !important; padding: 40px 20px !important; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  return (
    <div style={S.root}>
      {/* ── Left Side: Visual ── */}
      <div style={S.visual} className="it-visual">
        <img src={storageImg} alt="Logistics Support" style={S.visualImg} />
        <div style={S.visualOverlay} />
        <div style={S.visualContent}>
          <div style={S.visualTag} className="it-fade-up">SECURE INFRASTRUCTURE</div>
          <h1 style={S.visualH1} className="it-fade-up it-delay-1">
            Industry-Leading <br /> Inventory Racks.
          </h1>
          <p style={S.visualDesc} className="it-fade-up it-delay-2">
            Control every shelf, every pallet, and every shipment from one centralized platform. Scalable architecture for modern enterprises.
          </p>
        </div>
      </div>

      {/* ── Right Side: Form ── */}
      <div style={S.formSide} className="it-form-side">
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, background: "#fff", zIndex: -1 }} />
        <button 
          style={S.backToHome} 
          onClick={() => navigate("/")}
          onMouseEnter={(e) => { e.target.style.background = "#f8fafc"; e.target.style.color = "#2563eb"; }}
          onMouseLeave={(e) => { e.target.style.background = "transparent"; e.target.style.color = "#64748b"; }}
        >
          ← Back to Home
        </button>

        <div className="it-fade-up" style={{ width: "100%", maxWidth: "400px", margin: "0 auto" }}>
          <img src={logo} alt="InvenTrack" style={{ width: "84px", height: "84px", objectFit: "contain", marginBottom: "8px" }} />
          <span style={S.brandName}>InvenTrack</span>
        </div>

        <div style={S.header}>
          <h2 style={S.h2}>Welcome Back!</h2>
          <p style={S.sub}>Sign in to your account to continue.</p>
        </div>

        <form onSubmit={handleSubmit}>
          {/* USER ROLE SELECTOR */}
          <div style={S.field}>
            <label style={S.label}>SELECT YOUR ROLE</label>
            <div style={S.roleGrid}>
              {roleOptions.map((role) => (
                <div
                  key={role.id}
                  style={{ ...S.roleCard, ...(selectedRole === role.id ? S.roleActive : {}) }}
                  onClick={() => switchRole(role.id)}
                  onMouseEnter={(e) => { if (selectedRole !== role.id) e.currentTarget.style.borderColor = "#93c5fd"; }}
                  onMouseLeave={(e) => { if (selectedRole !== role.id) e.currentTarget.style.borderColor = "#e2e8f0"; }}
                >
                  <span style={S.roleIcon}>{role.icon}</span>
                  <span style={S.roleLabel}>{role.label}</span>
                </div>
              ))}
            </div>
          </div>

          <div style={S.field}>
            <label style={S.label}>WORK EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onFocus={() => setFocusedField("email")}
              onBlur={() => setFocusedField(null)}
              style={{ ...S.input, ...(focusedField === "email" ? S.inputFocus : {}) }}
              placeholder="name@company.com"
            />
          </div>

          <div style={S.field}>
            <label style={S.label}>PASSWORD</label>
            <div style={{ position: "relative" }}>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onFocus={() => setFocusedField("pass")}
                onBlur={() => setFocusedField(null)}
                style={{ ...S.input, ...(focusedField === "pass" ? S.inputFocus : {}) }}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: "absolute", right: "14px", top: "50%",
                  transform: "translateY(-50%)", background: "none",
                  border: "none", color: "#64748b", cursor: "pointer",
                  fontSize: "1rem", display: "flex", alignItems: "center"
                }}
              >
                {showPassword ? (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                ) : (
                  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path><line x1="1" y1="1" x2="23" y2="23"></line></svg>
                )}
              </button>
            </div>
          </div>

          <div style={S.options}>
            <label style={S.checkboxWrap}>
              <input type="checkbox" checked={rememberMe} onChange={() => setRememberMe(!rememberMe)} style={{ cursor: "pointer" }} />
              Remember me
            </label>
            <button type="button" style={S.forgot} onMouseEnter={(e) => e.target.style.textDecoration = "underline"} onMouseLeave={(e) => e.target.style.textDecoration = "none"}>Forgot password?</button>
          </div>

          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1.5px solid #fecaca",
              color: "#b91c1c",
              padding: "12px 16px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: "600",
              marginBottom: "20px",
              display: "flex",
              alignItems: "center",
              gap: "10px"
            }}>
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"></circle><line x1="12" y1="8" x2="12" y2="12"></line><line x1="12" y1="16" x2="12.01" y2="16"></line></svg>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...S.signInBtn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => { e.target.style.transform = "translateY(-1px)"; e.target.style.boxShadow = "0 12px 28px rgba(37,99,235,0.4)"; }}
            onMouseLeave={(e) => { e.target.style.transform = ""; e.target.style.boxShadow = S.signInBtn.boxShadow; }}
          >
            Sign In to Dashboard →
          </button>
        </form>

        <p style={S.footerNotice}>
          © {new Date().getFullYear()} InvenTrack. Secure access for logistics networks. <br />
          System Status: <span style={{ color: "#10b981", fontWeight: "700" }}>● All Systems Operational</span>
        </p>
      </div>
    </div>
  );
}

export default Login;