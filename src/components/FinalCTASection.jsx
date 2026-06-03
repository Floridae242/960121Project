import { useNavigate } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useAuth } from "@/lib/AuthContext";

const fadeUp = (delay = 0, reduce = false) => ({
  initial: reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 28 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, amount: 0.4 },
  transition: { duration: reduce ? 0 : 0.7, ease: [0.16, 1, 0.3, 1], delay: reduce ? 0 : delay },
});

export default function FinalCTASection() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const reduce = useReducedMotion();

  const primaryAction = () =>
    isAuthenticated
      ? document.getElementById("classes-section")?.scrollIntoView({ behavior: "smooth" })
      : navigate("/login");

  return (
    <section
      style={{
        background: "var(--wm-red)",
        padding: "clamp(80px, 12vw, 160px) clamp(24px, 5vw, 64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Grain texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.04,
      }} />

      {/* Decorative espresso flourishes */}
      <div style={{
        position: "absolute", top: "-160px", left: "-120px",
        width: "440px", height: "440px",
        background: "radial-gradient(circle, rgba(75,46,43,0.22) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />
      <div style={{
        position: "absolute", bottom: "-180px", right: "-100px",
        width: "480px", height: "480px",
        background: "radial-gradient(circle, rgba(75,46,43,0.18) 0%, transparent 70%)",
        borderRadius: "50%", pointerEvents: "none",
      }} />

      {/* Giant ghost serif glyph — atmosphere */}
      <span style={{
        position: "absolute", right: "4%", top: "50%",
        transform: "translateY(-50%)",
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "clamp(280px, 38vw, 560px)", fontStyle: "italic",
        fontWeight: 700, color: "rgba(75,46,43,0.10)",
        lineHeight: 1, pointerEvents: "none", userSelect: "none",
      }}>
        &amp;
      </span>

      <div style={{
        maxWidth: "920px", margin: "0 auto",
        position: "relative", zIndex: 2,
        textAlign: "center",
      }}>
        {/* Eyebrow */}
        <motion.div {...fadeUp(0, reduce)} style={{
          display: "inline-flex", alignItems: "center", gap: "14px", marginBottom: "32px",
        }}>
          <div style={{ width: "32px", height: "1.5px", background: "var(--wm-bg)", opacity: 0.6 }} />
          <span style={{
            fontSize: "11px", fontWeight: 700, letterSpacing: "0.4em",
            textTransform: "uppercase", color: "var(--wm-bg)", opacity: 0.85,
          }}>
            Start Your Journey
          </span>
          <div style={{ width: "32px", height: "1.5px", background: "var(--wm-bg)", opacity: 0.6 }} />
        </motion.div>

        {/* Headline */}
        <motion.h2 {...fadeUp(0.1, reduce)} style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(40px, 7vw, 88px)",
          fontWeight: 700, lineHeight: 1.04,
          letterSpacing: "-0.03em", color: "var(--wm-bg)",
          marginBottom: "28px",
        }}>
          มือของคุณ
          <br />
          <em style={{ fontStyle: "italic", color: "var(--wm-navy)" }}>พร้อมแล้ว</em> หรือยัง?
        </motion.h2>

        {/* Subheadline */}
        <motion.p {...fadeUp(0.2, reduce)} style={{
          fontSize: "clamp(15px, 1.4vw, 18px)",
          color: "rgba(255,248,240,0.85)", lineHeight: 1.75,
          maxWidth: "520px", margin: "0 auto 48px",
          fontWeight: 400,
        }}>
          ที่นั่งในแต่ละคลาสมีจำกัด จองวันนี้แล้วมาเริ่มต้นเส้นทาง
          การทำขนมของคุณกับเชฟมืออาชีพ
        </motion.p>

        {/* CTA buttons */}
        <motion.div {...fadeUp(0.3, reduce)} style={{
          display: "flex", gap: "16px", flexWrap: "wrap", justifyContent: "center",
        }}>
          <button
            onClick={primaryAction}
            style={{
              padding: "18px 48px",
              background: "var(--wm-bg)",
              color: "var(--wm-navy)",
              border: "2px solid var(--wm-bg)",
              cursor: "pointer",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "17px", fontWeight: 700, fontStyle: "italic",
              letterSpacing: "0.01em",
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              boxShadow: "0 8px 32px rgba(75,46,43,0.28)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = "var(--wm-navy)";
              e.currentTarget.style.color = "var(--wm-bg)";
              e.currentTarget.style.borderColor = "var(--wm-navy)";
              e.currentTarget.style.transform = "translateY(-3px)";
              e.currentTarget.style.boxShadow = "0 14px 40px rgba(75,46,43,0.4)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = "var(--wm-bg)";
              e.currentTarget.style.color = "var(--wm-navy)";
              e.currentTarget.style.borderColor = "var(--wm-bg)";
              e.currentTarget.style.transform = "translateY(0)";
              e.currentTarget.style.boxShadow = "0 8px 32px rgba(75,46,43,0.28)";
            }}
          >
            จองคลาสเลย →
          </button>
          <button
            onClick={() => document.getElementById("contact-section")?.scrollIntoView({ behavior: "smooth" })}
            style={{
              padding: "18px 48px",
              background: "transparent",
              color: "var(--wm-bg)",
              border: "2px solid rgba(255,248,240,0.5)",
              cursor: "pointer",
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "17px", fontWeight: 700,
              letterSpacing: "0.01em",
              transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "var(--wm-bg)";
              e.currentTarget.style.background = "rgba(255,248,240,0.08)";
              e.currentTarget.style.transform = "translateY(-3px)";
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(255,248,240,0.5)";
              e.currentTarget.style.background = "transparent";
              e.currentTarget.style.transform = "translateY(0)";
            }}
          >
            สอบถามก่อน
          </button>
        </motion.div>

        {/* Reassurance line */}
        <motion.p {...fadeUp(0.4, reduce)} style={{
          marginTop: "32px",
          fontSize: "12px", letterSpacing: "0.08em",
          color: "rgba(255,248,240,0.6)",
          textTransform: "uppercase",
        }}>
          ★ ยืนยันที่นั่งทันที · ยกเลิกฟรีก่อน 48 ชม.
        </motion.p>
      </div>
    </section>
  );
}
