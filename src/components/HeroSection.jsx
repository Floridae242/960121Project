import { lazy, Suspense } from "react";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

// โหลด 3D scene แบบ lazy — แยก three.js ออกจาก initial bundle
// เพื่อไม่ให้ block first paint ของ hero (ดู Suspense fallback ด้านล่าง)
const BakeryRoom3D = lazy(() => import("./BakeryRoom3D"));

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 32 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1], delay },
});

const BADGES = [
  { icon: "⭐", value: "4.9", label: "Google Reviews" },
  { icon: "👨‍🍳", value: "15+", label: "เชฟมืออาชีพ" },
  { icon: "🎓", value: "200+", label: "นักเรียนสำเร็จ" },
];

export default function HeroSection() {
  const isStacked = useMediaQuery("(max-width: 900px)");

  return (
    <section style={{
      minHeight: "100vh",
      background: "var(--wm-bg)",
      display: "flex",
      alignItems: "center",
      paddingTop: "68px",
      overflow: "hidden",
      position: "relative",
    }}>
      {/* Grain texture overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.025,
      }} />

      {/* Decorative caramel circle — top right */}
      <div style={{
        position: "absolute", top: "-120px", right: "-120px",
        width: "500px", height: "500px",
        background: "radial-gradient(circle, rgba(192,133,82,0.12) 0%, transparent 70%)",
        borderRadius: "50%", zIndex: 0, pointerEvents: "none",
      }} />

      {/* Decorative line — left */}
      <div style={{
        position: "absolute", left: 0, top: "30%",
        width: "3px", height: "200px",
        background: "linear-gradient(transparent, var(--wm-red), transparent)",
        opacity: 0.4, zIndex: 0,
      }} />

      <div style={{
        maxWidth: "1280px", width: "100%", margin: "0 auto",
        padding: isStacked ? "48px clamp(24px,5vw,64px)" : "80px clamp(24px,5vw,64px)",
        display: "flex",
        flexDirection: isStacked ? "column" : "row",
        alignItems: "center", gap: isStacked ? "32px" : "0",
        position: "relative", zIndex: 2,
      }}>
        {/* LEFT — text */}
        <div style={{
          flex: isStacked ? "1 1 auto" : "0 0 52%",
          width: isStacked ? "100%" : "auto",
          paddingRight: isStacked ? 0 : "48px",
          textAlign: isStacked ? "center" : "left",
        }}>
          {/* Eyebrow */}
          <motion.div {...fadeUp(0)} style={{
            display: "flex", alignItems: "center", gap: "14px", marginBottom: "28px",
            justifyContent: isStacked ? "center" : "flex-start",
          }}>
            <div style={{ width: "40px", height: "1.5px", background: "var(--wm-red)" }} />
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em",
              textTransform: "uppercase", color: "var(--wm-red)",
            }}>
              Artisan Baking Workshops · Chiang Mai
            </span>
          </motion.div>

          {/* H1 — editorial split */}
          <motion.h1 {...fadeUp(0.1)} style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 700,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            marginBottom: "28px",
            color: "var(--wm-navy)",
          }}>
            <span style={{ display: "block", fontSize: "clamp(52px,7.5vw,96px)" }}>ศิลปะ</span>
            <span style={{
              display: "block",
              fontSize: "clamp(52px,7.5vw,96px)",
              fontStyle: "italic", color: "var(--wm-red)",
            }}>
              แห่งการ
            </span>
            <span style={{
              display: "block",
              fontSize: "clamp(36px,5vw,64px)",
              fontWeight: 400, fontStyle: "normal",
              color: "var(--wm-muted)", letterSpacing: "-0.01em",
            }}>
              นวดแป้ง & อบขนม
            </span>
          </motion.h1>

          {/* H2 subheadline */}
          <motion.p {...fadeUp(0.2)} style={{
            fontSize: "clamp(15px,1.3vw,17px)",
            color: "var(--wm-muted)", lineHeight: 1.75,
            maxWidth: "440px", marginBottom: "44px",
            marginLeft: isStacked ? "auto" : 0,
            marginRight: isStacked ? "auto" : 0,
            fontWeight: 400,
          }}>
            เรียนรู้จากเชฟมืออาชีพในบรรยากาศอบอุ่น
            <br />
            คลาสขนาดเล็ก ดูแลใกล้ชิด เน้นลงมือทำจริง
          </motion.p>

          {/* Two buttons */}
          <motion.div {...fadeUp(0.3)} style={{ display: "flex", gap: "16px", flexWrap: "wrap", marginBottom: "48px", justifyContent: isStacked ? "center" : "flex-start" }}>
            <button
              onClick={() => document.getElementById("classes-section")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "16px 40px",
                background: "var(--wm-navy)",
                color: "var(--wm-bg)",
                border: "2px solid var(--wm-navy)",
                cursor: "pointer",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "16px", fontWeight: 700, fontStyle: "italic",
                letterSpacing: "0.01em",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
                boxShadow: "0 4px 24px rgba(75,46,43,0.25)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--wm-red)";
                e.currentTarget.style.borderColor = "var(--wm-red)";
                e.currentTarget.style.transform = "translateY(-2px)";
                e.currentTarget.style.boxShadow = "0 8px 32px rgba(192,133,82,0.4)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "var(--wm-navy)";
                e.currentTarget.style.borderColor = "var(--wm-navy)";
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 24px rgba(75,46,43,0.25)";
              }}
            >
              จองคลาสเลย →
            </button>
            <button
              onClick={() => document.getElementById("features-section")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                padding: "16px 40px",
                background: "transparent",
                color: "var(--wm-navy)",
                border: "2px solid var(--wm-navy)",
                cursor: "pointer",
                fontFamily: "'Playfair Display', Georgia, serif",
                fontSize: "16px", fontWeight: 700,
                letterSpacing: "0.01em",
                transition: "all 0.25s cubic-bezier(0.16,1,0.3,1)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--wm-navy)";
                e.currentTarget.style.color = "var(--wm-bg)";
                e.currentTarget.style.transform = "translateY(-2px)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--wm-navy)";
                e.currentTarget.style.transform = "translateY(0)";
              }}
            >
              ดูคลาสทั้งหมด
            </button>
          </motion.div>

          {/* 3 Social proof badges */}
          <motion.div {...fadeUp(0.45)} style={{ display: "flex", gap: "12px", flexWrap: "wrap", justifyContent: isStacked ? "center" : "flex-start" }}>
            {BADGES.map(({ icon, value, label }) => (
              <div key={label} style={{
                display: "flex", alignItems: "center", gap: "10px",
                padding: "10px 18px",
                background: "#fff",
                border: "1.5px solid rgba(192,133,82,0.3)",
                boxShadow: "0 2px 12px rgba(75,46,43,0.08)",
                position: "relative",
              }}>
                {/* stamp corner */}
                <div style={{
                  position: "absolute", top: "-1px", left: "-1px",
                  width: "6px", height: "6px",
                  borderTop: "2px solid var(--wm-red)",
                  borderLeft: "2px solid var(--wm-red)",
                }} />
                <div style={{
                  position: "absolute", bottom: "-1px", right: "-1px",
                  width: "6px", height: "6px",
                  borderBottom: "2px solid var(--wm-red)",
                  borderRight: "2px solid var(--wm-red)",
                }} />
                <span style={{ fontSize: "18px" }}>{icon}</span>
                <div>
                  <div style={{
                    fontSize: "16px", fontWeight: 800,
                    fontFamily: "'Playfair Display', Georgia, serif",
                    color: "var(--wm-navy)", lineHeight: 1.1,
                  }}>{value}</div>
                  <div style={{ fontSize: "10px", color: "var(--wm-muted)", letterSpacing: "0.06em", textTransform: "uppercase" }}>{label}</div>
                </div>
              </div>
            ))}
          </motion.div>
        </div>

        {/* RIGHT — 3D bakery room */}
        <div style={{
          flex: isStacked ? "0 0 auto" : 1,
          width: isStacked ? "100%" : "auto",
          height: isStacked ? "360px" : "560px",
          position: "relative",
        }}>
          {/* Warm background blob */}
          <div style={{
            position: "absolute", inset: "-40px",
            background: "radial-gradient(ellipse at center, rgba(192,133,82,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }} />
          <Suspense fallback={<div style={{ height: "100%", display: "flex", alignItems: "center", justifyContent: "center", color: "var(--wm-muted)", fontSize: "13px" }}>Loading...</div>}>
            <BakeryRoom3D />
          </Suspense>
          <span style={{
            position: "absolute", bottom: "8px", right: "0",
            fontSize: "10px", fontWeight: 600, color: "var(--wm-muted)",
            letterSpacing: "0.2em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: "8px",
            opacity: 0.7,
          }}>
            <span style={{ display: "block", width: "20px", height: "1px", background: "var(--wm-muted)" }} />
            Drag to rotate
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        style={{
          position: "absolute", bottom: "36px", left: "50%",
          transform: "translateX(-50%)",
          display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
          zIndex: 2,
        }}
      >
        <span style={{ fontSize: "10px", letterSpacing: "0.25em", color: "var(--wm-muted)", textTransform: "uppercase" }}>Scroll</span>
        <div style={{
          width: "1px", height: "48px",
          background: "linear-gradient(var(--wm-red), transparent)",
        }} />
      </motion.div>
    </section>
  );
}
