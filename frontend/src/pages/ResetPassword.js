import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import logo from "../assets/logo.png";

const S = {
  root: {
    fontFamily: "'DM Sans', 'Segoe UI', sans-serif",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    background: "linear-gradient(135deg, #020617 0%, #0f172a 100%)",
    padding: "20px",
  },
  card: {
    background: "#fff",
    borderRadius: "28px",
    padding: "48px",
    width: "100%",
    maxWidth: "460px",
    boxShadow: "0 25px 50px rgba(0,0,0,0.25)",
  },
  logo: {
    width: "72px",
    height: "72px",
    objectFit: "contain",
    marginBottom: "8px",
  },
  brand: {
    fontSize: "1.5rem",
    fontWeight: "950",
    color: "#1e3a8a",
    letterSpacing: "-1px",
    marginBottom: "32px",
    display: "block",
  },
  title: {
    fontSize: "1.6rem",
    fontWeight: 800,
    color: "#0f172a",
    marginBottom: "8px",
  },
  subtitle: {
    fontSize: "0.9rem",
    color: "#64748b",
    marginBottom: "32px",
    lineHeight: 1.5,
  },
  input: {
    width: "100%",
    height: "52px",
    padding: "0 18px",
    borderRadius: "14px",
    border: "1.5px solid #e2e8f0",
    fontSize: "0.95rem",
    fontWeight: "600",
    color: "#0f172a",
    outline: "none",
    background: "#f8fafc",
    transition: "all .3s",
    marginBottom: "16px",
    boxSizing: "border-box",
  },
  btn: {
    width: "100%",
    height: "52px",
    borderRadius: "14px",
    background: "linear-gradient(135deg, #1d4ed8, #3b82f6)",
    color: "#fff",
    fontSize: "1rem",
    fontWeight: 800,
    border: "none",
    cursor: "pointer",
    boxShadow: "0 10px 24px rgba(37,99,235,0.3)",
    transition: "all .3s",
    marginTop: "8px",
  },
  link: {
    display: "block",
    textAlign: "center",
    marginTop: "20px",
    color: "#2563eb",
    fontWeight: 600,
    fontSize: "0.9rem",
    textDecoration: "none",
    cursor: "pointer",
  },
};

function ResetPassword() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [validating, setValidating] = useState(true);
  const [tokenError, setTokenError] = useState(null);

  useEffect(() => {
    if (!token) {
      setTokenError("No reset token provided. Please request a new password reset link.");
      setValidating(false);
    } else {
      setValidating(false);
    }
  }, [token]);

  const handleReset = async (e) => {
    e.preventDefault();
    setError(null);

    if (!newPassword || !confirmPassword) {
      setError("Please fill in both password fields.");
      return;
    }
    if (newPassword.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.post("http://127.0.0.1:5001/api/auth/reset-password", {
        token,
        new_password: newPassword,
      });
      setSuccess(true);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to reset password. The link may have expired.");
    } finally {
      setLoading(false);
    }
  };

  if (validating) {
    return (
      <div style={S.root}>
        <div style={{ color: "#fff", fontSize: "1rem" }}>Validating your reset link...</div>
      </div>
    );
  }

  if (tokenError) {
    return (
      <div style={S.root}>
        <div style={S.card}>
          <img src={logo} alt="InvenTrack" style={S.logo} />
          <span style={S.brand}>InvenTrack</span>
          <h2 style={S.title}>Invalid Reset Link</h2>
          <p style={S.subtitle}>{tokenError}</p>
          <button style={S.btn} onClick={() => navigate("/login")}>
            Back to Login
          </button>
        </div>
      </div>
    );
  }

  if (success) {
    return (
      <div style={S.root}>
        <div style={S.card}>
          <img src={logo} alt="InvenTrack" style={S.logo} />
          <span style={S.brand}>InvenTrack</span>
          <h2 style={{ ...S.title, color: "#16a34a" }}>Password Reset!</h2>
          <p style={S.subtitle}>
            Your password has been successfully reset. You can now log in with your new password.
          </p>
          <button style={S.btn} onClick={() => navigate("/login")}>
            Go to Login →
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={S.root}>
      <div style={S.card}>
        <img src={logo} alt="InvenTrack" style={S.logo} />
        <span style={S.brand}>InvenTrack</span>

        <h2 style={S.title}>Create New Password</h2>
        <p style={S.subtitle}>
          Enter a new secure password for your account. Make sure it's at least 6 characters long.
        </p>

        <form onSubmit={handleReset}>
          <input
            type="password"
            placeholder="New Password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            style={S.input}
            onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.08)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
          />
          <input
            type="password"
            placeholder="Confirm New Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            style={S.input}
            onFocus={(e) => { e.target.style.borderColor = "#2563eb"; e.target.style.background = "#fff"; e.target.style.boxShadow = "0 0 0 4px rgba(37,99,235,0.08)"; }}
            onBlur={(e) => { e.target.style.borderColor = "#e2e8f0"; e.target.style.background = "#f8fafc"; e.target.style.boxShadow = "none"; }}
          />

          {error && (
            <div style={{
              background: "#fee2e2",
              border: "1.5px solid #fecaca",
              color: "#b91c1c",
              padding: "10px 14px",
              borderRadius: "12px",
              fontSize: "0.85rem",
              fontWeight: 600,
              marginBottom: "16px",
            }}>
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{ ...S.btn, opacity: loading ? 0.7 : 1, cursor: loading ? "not-allowed" : "pointer" }}
            onMouseEnter={(e) => { if (!loading) e.target.style.transform = "translateY(-1px)"; }}
            onMouseLeave={(e) => { e.target.style.transform = ""; }}
          >
            {loading ? "Resetting..." : "Reset Password"}
          </button>
        </form>

        <a style={S.link} onClick={() => navigate("/login")}>
          ← Back to Login
        </a>
      </div>
    </div>
  );
}

export default ResetPassword;
