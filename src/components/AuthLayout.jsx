/**
 * AuthLayout.jsx — เลย์เอาต์ร่วมของหน้า auth (login / register / ลืมรหัสผ่าน ฯลฯ)
 * แบ่งจอเป็น 2 ฝั่ง: ฝั่งซ้ายเป็นภาพแบรนด์ (ซ่อนบนมือถือ), ฝั่งขวาเป็นฟอร์ม (children)
 * รับ prop: title, subtitle, children (ฟอร์ม), footer (ลิงก์ด้านล่าง)
 */
import { Link } from "react-router-dom";
import { APP_NAME } from "@/lib/app-params";

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <main style={{ minHeight: "100vh", display: "flex", background: "var(--wm-bg)" }}>

      {/* Left panel — navy, hidden below md */}
      <div
        className="hidden md:flex"
        style={{
          flex: 1,
          background: "var(--wm-navy)",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          padding: "64px 56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <div style={{
            fontSize: "24px", fontWeight: 800, color: "#fff",
            letterSpacing: "-0.03em", marginBottom: "16px",
          }}>
            {APP_NAME}<span style={{ color: "var(--wm-red)" }}>.</span>
          </div>
        </Link>
        <p style={{
          color: "rgba(255,255,255,0.45)", fontSize: "15px",
          maxWidth: "260px", lineHeight: 1.7,
        }}>
          เรียนรู้ศิลปะการทำขนมอบจากเชฟมืออาชีพ ในบรรยากาศอบอุ่นสไตล์อาร์ทิซาน
        </p>
        
      </div>

      {/* Right panel — light, centered form */}
      <div
        className="auth-light-theme"
        style={{
          flex: 1,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          padding: "48px 24px",
          minHeight: "100vh",
        }}
      >
        {/* Mobile-only logo */}
        <Link
          to="/"
          className="md:hidden"
          style={{
            fontSize: "20px", fontWeight: 800, color: "var(--wm-navy)",
            letterSpacing: "-0.03em", textDecoration: "none", marginBottom: "32px",
            alignSelf: "flex-start",
          }}
        >
          {APP_NAME}<span style={{ color: "var(--wm-red)" }}>.</span>
        </Link>

        {/* Form card */}
        <div style={{
          width: "100%",
          maxWidth: "400px",
          background: "#fff",
          border: "1px solid var(--wm-border)",
          padding: "40px",
        }}>
          <h1 style={{
            fontSize: "26px", fontWeight: 800, color: "var(--wm-navy)",
            letterSpacing: "-0.03em", marginBottom: "6px",
          }}>
            {title}
          </h1>
          <p style={{ fontSize: "14px", color: "var(--wm-muted)", marginBottom: "28px" }}>
            {subtitle}
          </p>

          {children}

          {footer && (
            <div style={{
              marginTop: "24px",
              paddingTop: "20px",
              borderTop: "1px solid var(--wm-border)",
              fontSize: "13px",
              color: "#888",
            }}>
              {footer}
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
