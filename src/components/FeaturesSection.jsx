import { useEffect, useRef, useState } from "react";
import { useMediaQuery } from "@/hooks/useMediaQuery";

const FEATURES = [
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="20" cy="14" r="7" stroke="currentColor" strokeWidth="1.5" />
        <path d="M8 34c0-6.627 5.373-12 12-12s12 5.373 12 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M26 10l2 2M28 6l1 3M32 10l-2 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    eyebrow: "Expert Instructors",
    title: "เชฟมืออาชีพระดับโลก",
    body: "เรียนรู้จากเชฟที่ผ่านการฝึกอบรมระดับนานาชาติ ทุกคลาสออกแบบให้คุณได้ทักษะที่ใช้ได้จริง",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="6" y="18" width="28" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
        <path d="M12 18v-4a8 8 0 0116 0v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="26" r="3" stroke="currentColor" strokeWidth="1.5" />
        <path d="M20 29v3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    eyebrow: "Small Groups",
    title: "กลุ่มเล็ก ใส่ใจทุกคน",
    body: "ไม่เกิน 12 คนต่อคลาส เชฟดูแลและให้ฟีดแบ็กได้อย่างใกล้ชิดทุกขั้นตอน ไม่มีใครหลงทาง",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M8 30 Q20 8 32 30" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <ellipse cx="20" cy="30" rx="12" ry="4" stroke="currentColor" strokeWidth="1.5" />
        <path d="M16 22c0-2.21 1.79-4 4-4s4 1.79 4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="14" r="2" fill="currentColor" />
      </svg>
    ),
    eyebrow: "Premium Equipment",
    title: "อุปกรณ์ระดับโปรเฟสชันนัล",
    body: "เตาอบ วัตถุดิบชั้นเลิศ และอุปกรณ์มืออาชีพ ทุกอย่างพร้อม คุณแค่ต้องมาพร้อมใจ",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M10 20h20M20 10v20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <circle cx="20" cy="20" r="13" stroke="currentColor" strokeWidth="1.5" />
        <path d="M14 14l12 12M26 14L14 26" stroke="currentColor" strokeWidth="1" opacity="0.3" />
      </svg>
    ),
    eyebrow: "Flexible Schedule",
    title: "ตารางเรียนยืดหยุ่น",
    body: "หลากหลายรอบให้เลือก ทั้งวันธรรมดาและวันหยุด จองล่วงหน้าได้ง่าย ยืนยันทันที",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 6l3.09 9.26L32 15l-7 7 2 10-7-4-7 4 2-10-7-7 8.91-.74z" stroke="currentColor" strokeWidth="1.5" strokeLinejoin="round" />
      </svg>
    ),
    eyebrow: "Certified Results",
    title: "ใบรับรองจริง มาตรฐานสูง",
    body: "ทุกคลาสจบพร้อมใบเซอร์ที่ได้รับการรับรอง เพิ่มมูลค่าให้กับ portfolio ของคุณ",
  },
  {
    icon: (
      <svg width="40" height="40" viewBox="0 0 40 40" fill="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M20 8C13.373 8 8 13.373 8 20s5.373 12 12 12 12-5.373 12-12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
        <path d="M28 8v8h-8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M20 16v4l3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    ),
    eyebrow: "Lifetime Access",
    title: "เรียนซ้ำ ทบทวนได้ตลอด",
    body: "นักเรียนเก่ามีสิทธิ์กลับมาทบทวนคลาสเดิมฟรี เพราะเราเชื่อว่าทักษะต้องการการฝึกซ้ำ",
  },
];

function FeatureCard({ icon, eyebrow, title, body, delay }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.15 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={{
        padding: "40px 36px",
        background: "#fff",
        border: "1px solid rgba(192,133,82,0.15)",
        position: "relative",
        transition: "all 0.5s cubic-bezier(0.16,1,0.3,1)",
        transitionDelay: visible ? `${delay}ms` : "0ms",
        opacity: visible ? 1 : 0,
        transform: visible ? "translateY(0)" : "translateY(24px)",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = "rgba(192,133,82,0.5)";
        e.currentTarget.style.boxShadow = "0 8px 40px rgba(75,46,43,0.1)";
        e.currentTarget.style.transform = "translateY(-4px)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = "rgba(192,133,82,0.15)";
        e.currentTarget.style.boxShadow = "none";
        e.currentTarget.style.transform = "translateY(0)";
      }}
    >
      {/* Corner accent */}
      <div style={{
        position: "absolute", top: 0, left: 0,
        width: "32px", height: "32px",
        borderTop: "2px solid var(--wm-red)",
        borderLeft: "2px solid var(--wm-red)",
        opacity: 0.5,
      }} />

      {/* Icon */}
      <div style={{
        color: "var(--wm-red)",
        marginBottom: "20px",
        opacity: 0.85,
      }}>
        {icon}
      </div>

      {/* Eyebrow */}
      <div style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "0.3em",
        textTransform: "uppercase", color: "var(--wm-red)",
        marginBottom: "10px", opacity: 0.8,
      }}>
        {eyebrow}
      </div>

      {/* Title */}
      <h3 style={{
        fontFamily: "'Playfair Display', Georgia, serif",
        fontSize: "22px", fontWeight: 700,
        color: "var(--wm-navy)", lineHeight: 1.25,
        letterSpacing: "-0.02em",
        marginBottom: "14px",
      }}>
        {title}
      </h3>

      {/* Divider */}
      <div style={{
        width: "32px", height: "1.5px",
        background: "var(--wm-red)",
        marginBottom: "16px", opacity: 0.5,
      }} />

      {/* Body */}
      <p style={{
        fontSize: "14px", color: "var(--wm-muted)",
        lineHeight: 1.75, fontWeight: 400,
      }}>
        {body}
      </p>
    </div>
  );
}

export default function FeaturesSection() {
  const headerRef = useRef(null);
  const [headerVisible, setHeaderVisible] = useState(false);
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const featureCols = isMobile ? 1 : isTablet ? 2 : 3;

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setHeaderVisible(true); },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <section
      id="features-section"
      style={{
        background: "var(--wm-bg)",
        padding: "120px clamp(24px,5vw,64px)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Background texture */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none",
        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        opacity: 0.02,
      }} />

      <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
        {/* Section header */}
        <div
          ref={headerRef}
          style={{
            marginBottom: "80px",
            display: "flex", alignItems: "flex-end",
            justifyContent: "space-between", flexWrap: "wrap", gap: "24px",
            transition: "all 0.7s cubic-bezier(0.16,1,0.3,1)",
            opacity: headerVisible ? 1 : 0,
            transform: headerVisible ? "translateY(0)" : "translateY(24px)",
          }}
        >
          <div>
            <div style={{
              display: "flex", alignItems: "center", gap: "14px", marginBottom: "20px",
            }}>
              <div style={{ width: "40px", height: "1.5px", background: "var(--wm-red)" }} />
              <span style={{
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em",
                textTransform: "uppercase", color: "var(--wm-red)",
              }}>
                Why Choose Us
              </span>
            </div>
            <h2 style={{
              fontFamily: "'Playfair Display', Georgia, serif",
              fontSize: "clamp(36px, 5vw, 64px)",
              fontWeight: 700, lineHeight: 1.05,
              letterSpacing: "-0.03em", color: "var(--wm-navy)",
            }}>
              ทำไมต้องเลือก
              <br />
              <em style={{ fontStyle: "italic", color: "var(--wm-red)" }}>แป้งละออง</em>
            </h2>
          </div>
          <p style={{
            maxWidth: "320px", fontSize: "15px",
            color: "var(--wm-muted)", lineHeight: 1.75,
            paddingBottom: "8px",
          }}>
            มากกว่าคลาสทำขนม — เราสร้างประสบการณ์ที่คุณจะจำไปตลอดชีวิต
          </p>
        </div>

        {/* responsive feature grid: 3 / 2 / 1 columns */}
        <div style={{
          display: "grid",
          gridTemplateColumns: `repeat(${featureCols}, 1fr)`,
          gap: "2px",
        }}>
          {FEATURES.map((feature, idx) => (
            <FeatureCard key={idx} {...feature} delay={idx * 80} />
          ))}
        </div>
      </div>
    </section>
  );
}
