/**
 * WorkshopCardWhite.jsx — การ์ดแสดงคลาส 1 รายการในหน้าแคตตาล็อก
 * แสดงรูป, ชื่อคลาส, เชฟ, ราคา และปุ่มจอง (ปิดปุ่มเมื่อคลาสเต็ม)
 */
import { motion } from "framer-motion";

// แม็พ emoji ของคลาส → ไฟล์ไอคอน SVG ที่ใช้แสดง
const EMOJI_TO_ICON = {
  "🥐": "/icons/croissant.svg",
  "🍩": "/icons/donut.svg",
  "🎂": "/icons/macaron.svg",
  "🍞": "/icons/bread.svg",
  "🧁": "/icons/macaron.svg",
};

export default function WorkshopCardWhite({ workshop, onBook }) {
  const isFull = workshop.isFull || workshop.seatsLeft === 0;
  const iconSrc = EMOJI_TO_ICON[workshop.emoji];

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        border: "1px solid var(--wm-border)",
        background: "var(--wm-surface)",
        display: "flex",
        flexDirection: "column",
        transition: "border-color 0.2s",
        overflow: "hidden",
      }}
      onMouseEnter={(e) => { e.currentTarget.style.borderColor = "#ccc"; }}
      onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--wm-border)"; }}
    >
      {workshop.image && (
        <div style={{ position: "relative", height: "200px", overflow: "hidden", background: "#0A0806" }}>
          <img
            src={workshop.image}
            alt={workshop.title}
            style={{ width: "100%", height: "100%", objectFit: "cover", opacity: 0.9 }}
          />
          <div style={{
            position: "absolute", inset: 0,
            background: "linear-gradient(to top, rgba(0,0,0,0.55) 0%, transparent 60%)",
          }} />

          {workshop.tag && (
            <span style={{
              position: "absolute", top: 0, left: 0,
              padding: "4px 12px",
              fontSize: "10px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", background: "var(--wm-red)", color: "#fff",
            }}>
              {workshop.tag}
            </span>
          )}

          {iconSrc && (
            <div style={{
              position: "absolute", top: "12px", right: "12px",
              width: "56px", height: "56px",
              background: "rgba(255,255,255,0.92)",
              borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              boxShadow: "0 2px 12px rgba(0,0,0,0.18)",
              pointerEvents: "none",
            }}>
              <img
                src={iconSrc}
                alt=""
                style={{ width: "32px", height: "32px", objectFit: "contain" }}
              />
            </div>
          )}
        </div>
      )}

      {/* Card body */}
      <div style={{ padding: "24px 28px", display: "flex", flexDirection: "column", flex: 1 }}>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em",
          textTransform: "uppercase", color: "#999", marginBottom: "6px",
        }}>
          {workshop.category}
        </div>

        <h3 style={{
          fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)",
          letterSpacing: "-0.02em", marginBottom: "5px", lineHeight: 1.25,
        }}>
          {workshop.title}
        </h3>

        <p style={{ fontSize: "12px", color: "#888", marginBottom: "4px" }}>
          {workshop.chef} · {workshop.level}
        </p>

        <p style={{ fontSize: "11px", color: "#bbb", marginBottom: "20px" }}>
          {workshop.dateText}
        </p>

        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
          <span style={{
            fontSize: "21px", fontWeight: 900, color: "var(--wm-navy)", letterSpacing: "-0.03em",
          }}>
            ฿{workshop.price.toLocaleString()}
          </span>

          {isFull ? (
            <button disabled style={{
              padding: "9px 18px",
              border: "1px solid #ddd",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#bbb", background: "transparent",
              cursor: "not-allowed",
            }}>
              เต็มแล้ว
            </button>
          ) : (
            <button
              onClick={() => onBook(workshop)}
              style={{
                padding: "9px 18px",
                border: "1.5px solid var(--wm-navy)",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--wm-navy)", background: "transparent",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "var(--wm-navy)";
                e.currentTarget.style.color = "#fff";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = "transparent";
                e.currentTarget.style.color = "var(--wm-navy)";
              }}
            >
              จองเลย
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
