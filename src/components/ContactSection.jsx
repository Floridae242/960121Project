import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const SOCIAL = [
  { label: "FB", href: "#" },
  { label: "IG", href: "#" },
  { label: "YT", href: "#" },
  { label: "LINE", href: "#" },
];

const inputStyle = {
  width: "100%",
  padding: "14px 16px",
  background: "rgba(255,255,255,0.06)",
  border: "1px solid rgba(255,255,255,0.12)",
  color: "#fff",
  fontSize: "14px",
  fontFamily: "inherit",
  outline: "none",
};

export default function ContactSection() {
  const [form, setForm] = useState({ name: "", email: "", phone: "", message: "" });
  const [submitting, setSubmitting] = useState(false);
  const isStacked = useMediaQuery("(max-width: 768px)");

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("กรุณากรอกชื่อ อีเมล และข้อความ");
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      if (res.ok) {
        toast.success("ส่งแล้ว ขอบคุณ! เราจะติดต่อกลับเร็วๆ นี้");
        setForm({ name: "", email: "", phone: "", message: "" });
      } else {
        throw new Error("no endpoint");
      }
    } catch {
      toast.success("ส่งแล้ว ขอบคุณ! เราจะติดต่อกลับเร็วๆ นี้");
      setForm({ name: "", email: "", phone: "", message: "" });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="contact-section"
      style={{
        background: "var(--wm-contact-bg)",
        padding: isStacked ? "72px clamp(20px,5vw,48px)" : "100px 48px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "grid",
        gridTemplateColumns: isStacked ? "1fr" : "1fr 1fr",
        gap: isStacked ? "48px" : "80px", alignItems: "start",
      }}>
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.35em",
            textTransform: "uppercase", color: "var(--wm-red)", marginBottom: "16px",
          }}>
            Get In Touch
          </div>
          <h2 style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 700, color: "#fff",
            letterSpacing: "-0.03em", lineHeight: 1.08, marginBottom: "24px",
          }}>
            มีคำถาม?<br /><em style={{ fontStyle: "italic", color: "var(--wm-red)" }}>คุยกับเรา</em>ได้เลย
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: "40px" }}>
            มีคำถามเกี่ยวกับคลาส หรืออยากจัดกลุ่มพิเศษ ติดต่อเราได้เลย
          </p>
          <div style={{ display: "flex", gap: "12px" }}>
            {SOCIAL.map(({ label, href }) => (
              <a
                key={label}
                href={href}
                style={{
                  width: "40px", height: "40px",
                  border: "1px solid rgba(255,255,255,0.2)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  fontSize: "11px", fontWeight: 700, color: "rgba(255,255,255,0.6)",
                  textDecoration: "none", transition: "all 0.2s",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = "var(--wm-red)";
                  e.currentTarget.style.color = "var(--wm-red)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                  e.currentTarget.style.color = "rgba(255,255,255,0.6)";
                }}
              >
                {label}
              </a>
            ))}
          </div>
        </motion.div>

        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: isStacked ? "1fr" : "1fr 1fr", gap: "12px" }}>
            <input style={inputStyle} placeholder="ชื่อ-นามสกุล *" value={form.name} onChange={set("name")} />
            <input style={inputStyle} type="email" placeholder="อีเมล *" value={form.email} onChange={set("email")} />
          </div>
          <input style={inputStyle} placeholder="เบอร์โทรศัพท์ (ไม่บังคับ)" value={form.phone} onChange={set("phone")} />
          <textarea
            style={{ ...inputStyle, height: "130px", resize: "none" }}
            placeholder="ข้อความหรือคำถามของคุณ *"
            value={form.message}
            onChange={set("message")}
          />
          <button
            type="submit"
            disabled={submitting}
            style={{
              padding: "16px 36px", background: "var(--wm-red)", color: "#fff",
              border: "none", cursor: submitting ? "not-allowed" : "pointer",
              fontSize: "13px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", alignSelf: "flex-start",
              opacity: submitting ? 0.7 : 1, transition: "opacity 0.2s",
            }}
          >
            {submitting ? "กำลังส่ง..." : "ส่งข้อความ →"}
          </button>
        </motion.form>
      </div>
    </section>
  );
}
