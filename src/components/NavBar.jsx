/**
 * NavBar.jsx — แถบเมนูด้านบนแบบ fixed
 * เริ่มต้นโปร่งใสทับ hero แล้วเปลี่ยนเป็นพื้นครีม + เงาเมื่อเลื่อนลง (scroll)
 * โลโก้ซ้าย / ลิงก์กลาง (ซ่อนบนมือถือ) / ปุ่ม CTA ขวา
 */
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const isMobile = useMediaQuery("(max-width: 768px)");

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav style={{
      position: "fixed",
      top: 0, left: 0, right: 0,
      zIndex: 100,
      height: "68px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      padding: "0 clamp(24px, 5vw, 64px)",
      background: scrolled ? "rgba(255,248,240,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(16px)" : "none",
      borderBottom: scrolled ? "1px solid rgba(192,133,82,0.2)" : "1px solid transparent",
      boxShadow: scrolled ? "0 1px 32px rgba(75,46,43,0.08)" : "none",
      transition: "all 0.4s cubic-bezier(0.16,1,0.3,1)",
    }}>
      {/* Logo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "22px", fontWeight: 700, fontStyle: "italic",
          color: "var(--wm-navy)", letterSpacing: "-0.02em",
          display: "flex", alignItems: "baseline", gap: "2px",
        }}
      >
        แป้งละออง
        <span style={{ color: "var(--wm-red)", fontStyle: "normal", fontSize: "28px", lineHeight: 1 }}>.</span>
      </button>

      {/* Center nav links — ซ่อนบนมือถือ (หน้าเดียว scroll ได้, ใช้โลโก้ + CTA แทน) */}
      <div style={{ display: isMobile ? "none" : "flex", gap: "40px" }}>
        {[
          { label: "Home", action: () => window.scrollTo({ top: 0, behavior: "smooth" }) },
          { label: "Classes", action: () => scrollTo("classes-section") },
          { label: "Features", action: () => scrollTo("features-section") },
          { label: "Contact", action: () => scrollTo("contact-section") },
        ].map(({ label, action }) => (
          <button
            key={label}
            onClick={action}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "13px", fontWeight: 500, letterSpacing: "0.06em",
              textTransform: "uppercase", color: "var(--wm-navy)",
              opacity: 0.6, transition: "opacity 0.2s",
              padding: "4px 0",
              borderBottom: "1.5px solid transparent",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.opacity = "1"; e.currentTarget.style.borderBottomColor = "var(--wm-red)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.opacity = "0.6"; e.currentTarget.style.borderBottomColor = "transparent"; }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right CTA */}
      <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
        {isAuthenticated && (
          <button
            onClick={logout}
            style={{
              background: "none", border: "none", cursor: "pointer",
              fontSize: "12px", color: "var(--wm-muted)", letterSpacing: "0.04em",
              textTransform: "uppercase",
            }}
          >
            ออกจากระบบ
          </button>
        )}
        <button
          onClick={() => isAuthenticated ? scrollTo("classes-section") : navigate("/login")}
          style={{
            padding: "10px 28px",
            background: "var(--wm-navy)",
            color: "var(--wm-bg)",
            border: "none", cursor: "pointer",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "14px", fontWeight: 700, fontStyle: "italic",
            letterSpacing: "0.02em",
            transition: "all 0.25s",
            boxShadow: "0 2px 16px rgba(75,46,43,0.2)",
          }}
          onMouseEnter={(e) => { e.currentTarget.style.background = "var(--wm-red)"; e.currentTarget.style.boxShadow = "0 4px 24px rgba(192,133,82,0.35)"; }}
          onMouseLeave={(e) => { e.currentTarget.style.background = "var(--wm-navy)"; e.currentTarget.style.boxShadow = "0 2px 16px rgba(75,46,43,0.2)"; }}
        >
          จองคลาส
        </button>
      </div>
    </nav>
  );
}
