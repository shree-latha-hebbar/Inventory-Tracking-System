import React from "react";

const footerStyles = {
  footer: {
    padding: "24px",
    textAlign: "center",
    borderTop: "1.5px solid #f1f5f9",
    background: "#fff",
    marginTop: "auto",
  },
  text: {
    fontSize: "0.78rem",
    color: "#94a3b8",
    fontWeight: "600",
  },
  brand: {
    color: "#2563eb",
    fontWeight: "900",
  },
};

function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer style={footerStyles.footer}>
      <p style={footerStyles.text}>
        © {currentYear} <span style={footerStyles.brand}>InvenTrack</span>. All rights reserved.
      </p>
    </footer>
  );
}

export default Footer;
