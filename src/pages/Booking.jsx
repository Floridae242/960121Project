/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   chef: string;
 *   level: string;
 *   price: number;
 *   bookedSeats: number;
 *   totalSeats: number;
 *   seatsLeft: number;
 *   category: string;
 *   emoji: string;
 *   tag: string | null;
 *   tagColor: string | null;
 *   rank: string;
 *   image: string;
 *   description: string;
 *   dateText: string;
 *   slots: string[];
 *   isFull: boolean;
 * }} Workshop
 *
 * @typedef {{
 *   workshop?: string;
 *   slot?: string;
 *   name?: string;
 *   phone?: string;
 * }} BookingErrors
 *
 * @typedef {{
 *   bookingId: string;
 *   status: string;
 *   workshopId?: number;
 *   workshopName?: string;
 *   slot?: string;
 *   name?: string;
 *   phone?: string;
 * }} BookingResult
 */

import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, CalendarDays, User, Phone, CheckCircle2 } from "lucide-react";
import { createBooking, fetchWorkshops, fetchWorkshopById } from "@/api/apiClient";

const EMOJI_TO_ICON = {
  "🥐": "/icons/croissant.svg",
  "🍩": "/icons/donut.svg",
  "🎂": "/icons/macaron.svg",
  "🍞": "/icons/bread.svg",
  "🧁": "/icons/macaron.svg",
};

const CATEGORY_ICONS = {
  "ทั้งหมด": "✨",
  "ขนมปังอบ": "/icons/bread.svg",
  "เค้กและขนมหวาน": "/icons/cake.svg",
  "เบเกอรี่ฝรั่งเศส": "/icons/croissant.svg",
  "โดนัทและฟริตเตอร์": "/icons/donut.svg",
};

const ROW_LABELS = ["A", "B", "C", "D", "E", "F"];
const COLS_PER_ROW = 5;

/**
 * buildSeatGrid — สร้าง layout ที่นั่งแบบ dynamic จาก totalSeats จริง
 * คืน { rows, cols, allSeats } เพื่อให้ seat picker render ได้โดยไม่ hardcode
 */
function buildSeatGrid(totalSeats) {
  const numRows = Math.ceil(totalSeats / COLS_PER_ROW);
  const rows = ROW_LABELS.slice(0, numRows);
  const cols = Array.from({ length: COLS_PER_ROW }, (_, i) => i + 1);
  // seat ทั้งหมดในระบบ (บางที่นั่งสุดท้ายอาจไม่ครบ 5)
  const allSeats = new Set(
    rows.flatMap((row, ri) =>
      cols
        .filter((col) => ri * COLS_PER_ROW + col <= totalSeats)
        .map((col) => `${row}${col}`)
    )
  );
  return { rows, cols, allSeats };
}

export default function Booking() {
  const [searchParams] = useSearchParams();
  const queryId = searchParams.get("workshopId");
  const [workshops, setWorkshops] = useState(/** @type {Workshop[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(/** @type {number | null} */ (queryId ? parseInt(queryId, 10) : null));
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");
  const [selectedSlot, setSelectedSlot] = useState("");     // slot text สำหรับแสดงผล
  const [selectedSlotId, setSelectedSlotId] = useState(null); // slot id สำหรับส่ง API
  const [selectedSeats, setSelectedSeats] = useState([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [bookingResult, setBookingResult] = useState(/** @type {BookingResult | null} */ (null));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(/** @type {string | null} */ (null));
  const [errors, setErrors] = useState(/** @type {BookingErrors} */ ({}));
  // workshopDetail มี slots จาก GET /api/workshops/:id — list view ไม่มี slots
  const [workshopDetail, setWorkshopDetail] = useState(null);

  // โหลดรายการ workshop ทั้งหมด (ไม่มี slots)
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchWorkshops()
      .then((data) => {
        const available = data.filter((w) => !w.isFull);
        setWorkshops(available);

        if (queryId) {
          const requestedId = parseInt(queryId, 10);
          const found = available.find((w) => w.id === requestedId);
          if (found) {
            setSelectedWorkshop(requestedId);
            setSelectedCategory(found.category);
          } else {
            setSelectedWorkshop(null);
          }
        }
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "ไม่สามารถโหลดข้อมูลคลาสได้");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [queryId]);

  // เมื่อเปลี่ยน workshop ให้ reset slot/seats และ fetch รายละเอียดใหม่
  useEffect(() => {
    setSelectedSlot("");
    setSelectedSlotId(null);
    setSelectedSeats([]);
    setWorkshopDetail(null);
    if (!selectedWorkshop) return;
    fetchWorkshopById(selectedWorkshop)
      .then(setWorkshopDetail)
      .catch((err) => console.error("fetch workshop detail:", err));
  }, [selectedWorkshop]);

  /** @type {Workshop | undefined} */
  const workshop = workshops.find((w) => w.id === selectedWorkshop);

  const categories = ["ทั้งหมด", ...new Set(workshops.map((w) => w.category).filter(Boolean))];
  const filteredWorkshops = workshops.filter(
    (w) => selectedCategory === "ทั้งหมด" || w.category === selectedCategory
  );

  const validate = () => {
    const e = {};
    if (!selectedWorkshop) e.workshop = "กรุณาเลือกคลาสเรียน";
    if (!selectedSlot) e.slot = "กรุณาเลือกวันและเวลา";
    if (selectedWorkshop && selectedSlot && selectedSeats.length === 0) e.seats = "กรุณาเลือกที่นั่งอย่างน้อย 1 ที่นั่ง";
    if (!name.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!phone.trim() || !/^[0-9]{9,10}$/.test(phone.replace(/[-\s]/g, "")))
      e.phone = "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง";
    return e;
  };

  /** @param {import("react").FormEvent<HTMLFormElement>} e */
  const handleSubmit = async (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) {
      setErrors(e2);
      return;
    }

    if (!workshop) {
      setErrors({ workshop: "ไม่พบคลาสที่เลือก" });
      return;
    }

    setErrors({});
    setSubmitError(null);
    setIsSubmitting(true);

    try {
      const result = await createBooking({
        workshopId: workshop.id,
        slotId: selectedSlotId,   // numeric id จาก workshop_slots table
        seats: selectedSeats,     // array เช่น ["A1","B2"]
        name,
        phone,
      });
      setBookingResult(result);
      setConfirmed(true);
    } catch (error) {
      console.error(error);
      const message = error instanceof Error ? error.message : "ไม่สามารถส่งคำขอจองได้";
      setSubmitError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--wm-bg)", fontFamily: "var(--font-body)" }}>
      {/* Header */}
      <div style={{
        background: "#fff",
        borderBottom: "1px solid var(--wm-border)",
        padding: "0 16px",
        height: "64px",
        position: "sticky",
        top: 0,
        zIndex: 10,
        display: "flex",
        alignItems: "center",
      }}>
        <div style={{ maxWidth: "768px", margin: "0 auto", width: "100%", display: "flex", alignItems: "center", gap: "12px" }}>
          <Link
            to="/"
            style={{ display: "flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--wm-muted)", textDecoration: "none", transition: "color 0.2s" }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--wm-red)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "var(--wm-muted)")}
          >
            <ChevronLeft style={{ width: "16px", height: "16px" }} /> กลับหน้าหลัก
          </Link>
          <span style={{ color: "var(--wm-border)" }}>|</span>
          <h1 style={{ fontSize: "16px", fontWeight: 800, color: "var(--wm-navy)", letterSpacing: "-0.02em" }}>
            จองคลาสเรียน
          </h1>
        </div>
      </div>

      <main style={{ maxWidth: "768px", margin: "0 auto", padding: "40px 16px 80px" }}>
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", padding: "64px 0", gap: "20px" }}
            >
              <CheckCircle2 style={{ width: "64px", height: "64px", color: "var(--wm-red)" }} strokeWidth={1.5} />
              <h2 style={{ fontSize: "32px", fontWeight: 900, color: "var(--wm-navy)", letterSpacing: "-0.04em" }}>
                การจองสำเร็จ
              </h2>
              <div style={{
                background: "#fff", border: "1px solid var(--wm-border)",
                padding: "28px", width: "100%", maxWidth: "360px",
                textAlign: "left", display: "flex", flexDirection: "column", gap: "8px",
                fontSize: "14px", color: "var(--wm-muted)",
              }}>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>รหัสการจอง:</span> {bookingResult?.bookingId}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>คลาส:</span> {workshop?.title}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>วันเวลา:</span> {selectedSlot}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>ที่นั่ง:</span> <span style={{ color: "var(--wm-navy)", fontWeight: 900 }}>{selectedSeats.join(", ")}</span> ({selectedSeats.length} ที่นั่ง)</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>ชื่อ:</span> {name}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>เบอร์โทร:</span> {phone}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>ราคารวม:</span> <span style={{ color: "var(--wm-red)", fontWeight: 900 }}>฿{(selectedSeats.length * workshop?.price).toLocaleString()}</span></p>
              </div>
              <p style={{ fontSize: "13px", color: "var(--wm-muted)" }}>ทีมงานจะติดต่อกลับเพื่อยืนยันการชำระเงิน</p>
              <Link to="/" style={{ textDecoration: "none" }}>
                <button
                  style={{
                    marginTop: "8px", padding: "12px 32px",
                    border: "1.5px solid var(--wm-navy)", background: "transparent",
                    color: "var(--wm-navy)", fontSize: "13px", fontWeight: 700,
                    letterSpacing: "0.08em", textTransform: "uppercase", cursor: "pointer",
                    transition: "all 0.2s",
                  }}
                  onMouseEnter={(e) => { e.currentTarget.style.background = "var(--wm-navy)"; e.currentTarget.style.color = "#fff"; }}
                  onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--wm-navy)"; }}
                >
                  ดูคลาสอื่น ๆ
                </button>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div style={{ marginBottom: "40px" }}>
                <h2 style={{ fontSize: "clamp(24px, 4vw, 36px)", fontWeight: 900, color: "var(--wm-navy)", letterSpacing: "-0.04em" }}>
                  จองที่นั่งของคุณ
                </h2>
                <p style={{ fontSize: "15px", color: "var(--wm-muted)", marginTop: "6px" }}>
                  เลือกคลาสและกรอกข้อมูลเพื่อยืนยันการจอง
                </p>
              </div>

              <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "40px" }}>

                {/* Step 1 */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>1</span>
                    เลือกคลาสเรียน
                  </h3>
                  {loading ? (
                    <div style={{ border: "1px solid var(--wm-border)", background: "#fff", padding: "24px", textAlign: "center", color: "var(--wm-muted)", fontSize: "14px" }}>กำลังโหลดคลาสที่ว่างอยู่...</div>
                  ) : error ? (
                    <div style={{ border: "1px solid #fca5a5", background: "#fff1f2", padding: "24px", textAlign: "center", color: "#b91c1c", fontSize: "14px" }}>ไม่สามารถโหลดคลาสได้: {error}</div>
                  ) : workshops.length === 0 ? (
                    <div style={{ border: "1px solid var(--wm-border)", background: "#fff", padding: "24px", textAlign: "center", color: "var(--wm-muted)", fontSize: "14px" }}>ขณะนี้ไม่มีคลาสที่ว่างให้จอง</div>
                  ) : (
                    <>
                      {/* หมวดหมู่คลาส (Category Tabs) */}
                      <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "16px" }}>
                        {categories.map((cat) => {
                          const count = cat === "ทั้งหมด" ? workshops.length : workshops.filter((w) => w.category === cat).length;
                          const isActive = selectedCategory === cat;
                          return (
                            <button
                              key={cat}
                              type="button"
                              onClick={() => setSelectedCategory(cat)}
                              style={{
                                padding: "6px 12px",
                                fontSize: "12.5px",
                                fontWeight: 700,
                                border: "1.5px solid",
                                borderColor: isActive ? "var(--wm-navy)" : "var(--wm-border)",
                                background: isActive ? "var(--wm-navy)" : "#fff",
                                color: isActive ? "#fff" : "var(--wm-muted)",
                                cursor: "pointer",
                                transition: "all 0.15s ease",
                                display: "flex",
                                alignItems: "center",
                                gap: "6px",
                              }}
                            >
                              {CATEGORY_ICONS[cat] && (
                                typeof CATEGORY_ICONS[cat] === "string" && CATEGORY_ICONS[cat].startsWith("/") ? (
                                  <img
                                    src={CATEGORY_ICONS[cat]}
                                    alt=""
                                    style={{
                                      width: "12px",
                                      height: "12px",
                                      filter: isActive ? "invert(1)" : "none",
                                      opacity: isActive ? 1 : 0.7,
                                    }}
                                  />
                                ) : (
                                  <span style={{ fontSize: "12px" }}>{CATEGORY_ICONS[cat]}</span>
                                )
                              )}
                              <span>{cat}</span>
                              <span style={{
                                fontSize: "10px",
                                fontWeight: 800,
                                opacity: 0.9,
                                background: isActive ? "rgba(255,255,255,0.2)" : "var(--wm-border)",
                                color: isActive ? "#fff" : "var(--wm-navy)",
                                padding: "1px 5px",
                                borderRadius: "10px",
                                minWidth: "14px",
                                textAlign: "center"
                              }}>
                                {count}
                              </span>
                            </button>
                          );
                        })}
                      </div>

                      {/* รายชื่อคลาส (Classes Grid) */}
                      <motion.div 
                        layout
                        style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}
                      >
                        <AnimatePresence mode="popLayout">
                          {filteredWorkshops.map((w) => (
                            <motion.button
                              key={w.id}
                              layout
                              initial={{ opacity: 0, scale: 0.96 }}
                              animate={{ opacity: 1, scale: 1 }}
                              exit={{ opacity: 0, scale: 0.96 }}
                              transition={{ duration: 0.15 }}
                              type="button"
                              onClick={() => { setSelectedWorkshop(w.id); setSelectedSlot(""); setSelectedSeats([]); setErrors((prev) => ({ ...prev, workshop: undefined })); }}
                              style={{
                                textAlign: "left", padding: "16px",
                                border: selectedWorkshop === w.id ? "1.5px solid var(--wm-navy)" : "1px solid var(--wm-border)",
                                background: selectedWorkshop === w.id ? "var(--wm-bg)" : "#fff",
                                cursor: "pointer", transition: "all 0.2s",
                              }}
                            >
                              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                                {EMOJI_TO_ICON[w.emoji] && (
                                  <img src={EMOJI_TO_ICON[w.emoji]} alt="" style={{ width: "20px", height: "20px", opacity: 0.75 }} />
                                )}
                                <p style={{ fontWeight: 700, color: "var(--wm-navy)", fontSize: "14px" }}>{w.title}</p>
                              </div>
                              <p style={{ fontSize: "12px", color: "var(--wm-muted)" }}>{w.chef} · ฿{w.price.toLocaleString()}</p>
                            </motion.button>
                          ))}
                        </AnimatePresence>
                      </motion.div>
                    </>
                  )}
                  {errors.workshop && <p style={{ color: "var(--wm-red)", fontSize: "13px", marginTop: "8px" }}>{errors.workshop}</p>}
                </section>

                {/* Step 2 */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>2</span>
                    เลือกวันและเวลา
                  </h3>
                  {!workshop ? (
                    <p style={{ color: "var(--wm-muted)", fontSize: "14px", fontStyle: "italic" }}>กรุณาเลือกคลาสก่อน</p>
                  ) : !workshopDetail ? (
                    <p style={{ color: "var(--wm-muted)", fontSize: "14px", fontStyle: "italic" }}>กำลังโหลดรอบเวลา...</p>
                  ) : workshopDetail.slots.length === 0 ? (
                    <p style={{ color: "var(--wm-muted)", fontSize: "14px", fontStyle: "italic" }}>ไม่มีรอบเวลาในขณะนี้</p>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                      {workshopDetail.slots.map((slot) => (
                        <button
                          key={slot.id}
                          type="button"
                          onClick={() => { setSelectedSlot(slot.slot_text); setSelectedSlotId(slot.id); setSelectedSeats([]); setErrors((prev) => ({ ...prev, slot: undefined })); }}
                          style={{
                            display: "flex", alignItems: "center", gap: "10px", padding: "14px",
                            border: selectedSlot === slot.slot_text ? "1.5px solid var(--wm-navy)" : "1px solid var(--wm-border)",
                            background: selectedSlot === slot.slot_text ? "var(--wm-bg)" : "#fff",
                            cursor: "pointer", transition: "all 0.2s", textAlign: "left",
                          }}
                        >
                          <CalendarDays style={{ width: "18px", height: "18px", color: "var(--wm-red)", flexShrink: 0 }} />
                          <span style={{ fontSize: "13px", color: "var(--wm-navy)", fontWeight: 500 }}>{slot.slot_text}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.slot && <p style={{ color: "var(--wm-red)", fontSize: "13px", marginTop: "8px" }}>{errors.slot}</p>}
                </section>

                {/* Step 3 — cinema seat picker kept dark intentionally */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>3</span>
                    เลือกที่นั่งเรียน
                  </h3>
                  {!workshop || !selectedSlot ? (
                    <p style={{ color: "var(--wm-muted)", fontSize: "14px", fontStyle: "italic" }}>กรุณาเลือกคลาสและวันเวลาก่อนเพื่อดูที่นั่ง</p>
                  ) : (() => {
                    const { rows, cols, allSeats } = buildSeatGrid(workshop.totalSeats);
                    const bookedSeats = new Set(workshopDetail?.bookedBySlot?.[selectedSlotId] ?? []);
                    return (
                    <div style={{ background: '#2A1A16', border: '1px solid rgba(192,133,82,0.15)', borderRadius: '8px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '8px' }}>
                        <div style={{ background: 'linear-gradient(180deg, rgba(192,133,82,0.3) 0%, transparent 100%)', border: '1px solid rgba(192,133,82,0.4)', borderBottom: 'none', borderRadius: '4px 4px 0 0', padding: '6px 24px', display: 'inline-block', minWidth: '200px' }}>
                          <span style={{ color: '#C08552', fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em' }}>หน้าชั้นเรียน / โต๊ะเชฟ</span>
                        </div>
                        <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #C08552, transparent)', borderRadius: '0 0 8px 8px' }} />
                        <div style={{ height: '20px', background: 'linear-gradient(180deg, rgba(192,133,82,0.08), transparent)', borderRadius: '0 0 50% 50%' }} />
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {rows.map((row) => (
                          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#5A4A3A', width: '16px', textAlign: 'center' }}>{row}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              {cols.map((col) => {
                                const seatId = `${row}${col}`;
                                if (!allSeats.has(seatId)) return null;
                                const isBooked = bookedSeats.has(seatId);
                                const isSelected = selectedSeats.includes(seatId);
                                return (
                                  <button
                                    key={seatId}
                                    type="button"
                                    disabled={isBooked}
                                    title={seatId}
                                    onClick={() => {
                                      if (isSelected) { setSelectedSeats(selectedSeats.filter((s) => s !== seatId)); }
                                      else { setSelectedSeats([...selectedSeats, seatId]); }
                                      setErrors((prev) => ({ ...prev, seats: undefined }));
                                    }}
                                    style={{
                                      width: '36px', height: '32px', borderRadius: '4px 4px 6px 6px',
                                      border: 'none', cursor: isBooked ? 'not-allowed' : 'pointer',
                                      transition: 'all 0.15s ease', fontSize: '9px', fontWeight: 700,
                                      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: '1px',
                                      backgroundColor: isBooked ? '#1E120F' : isSelected ? '#C08552' : '#3D2418',
                                      color: isBooked ? '#6B3A22' : isSelected ? '#0A0806' : '#E8C4A0',
                                      boxShadow: isSelected ? '0 0 12px rgba(192,133,82,0.5)' : 'none',
                                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                  >
                                    <div style={{ width: '22px', height: '4px', borderRadius: '3px 3px 0 0', backgroundColor: isBooked ? '#3A1E14' : isSelected ? '#A06D3E' : '#5A3020' }} />
                                    <span style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>{seatId}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#5A4A3A', width: '16px', textAlign: 'center' }}>{row}</span>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', paddingTop: '16px', borderTop: '1px solid rgba(192,133,82,0.1)' }}>
                        {[{ color: '#3D2418', label: 'ว่าง' }, { color: '#C08552', label: 'เลือก', glow: true }, { color: '#1E120F', label: 'จองแล้ว' }].map(({ color, label, glow }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '24px', height: '22px', borderRadius: '3px 3px 5px 5px', backgroundColor: color, boxShadow: glow ? '0 0 8px rgba(192,133,82,0.4)' : 'none' }} />
                            <span style={{ fontSize: '11px', color: '#8C5A3C' }}>{label}</span>
                          </div>
                        ))}
                      </div>
                      {selectedSeats.length > 0 && (
                        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                          <p style={{ fontSize: '13px', color: '#FFF8F0' }}>ที่นั่งที่เลือก: <span style={{ color: '#C08552', fontWeight: 700 }}>{selectedSeats.join(", ")}</span> ({selectedSeats.length} ที่นั่ง)</p>
                          <p style={{ fontSize: '11px', color: '#8C5A3C', marginTop: '4px' }}>฿{workshop.price.toLocaleString()} × {selectedSeats.length} = <span style={{ color: '#C08552', fontWeight: 700 }}>฿{(selectedSeats.length * workshop.price).toLocaleString()}</span></p>
                        </div>
                      )}
                    </div>
                    );
                  })()}
                  {errors.seats && <p style={{ color: "var(--wm-red)", fontSize: "13px", marginTop: "8px" }}>{errors.seats}</p>}
                </section>

                {/* Step 4 */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, flexShrink: 0 }}>4</span>
                    ข้อมูลผู้จอง
                  </h3>
                  <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "var(--wm-navy)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>
                        <User style={{ width: "14px", height: "14px", color: "var(--wm-red)" }} /> ชื่อ-นามสกุล
                      </label>
                      <input
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                        placeholder="กรุณากรอกชื่อ-นามสกุล"
                        style={{ width: "100%", height: "48px", padding: "0 16px", border: "1px solid var(--wm-border)", background: "#fff", color: "var(--wm-navy)", fontSize: "15px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--wm-navy)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--wm-border)")}
                      />
                      {errors.name && <p style={{ color: "var(--wm-red)", fontSize: "13px", marginTop: "6px" }}>{errors.name}</p>}
                    </div>
                    <div>
                      <label style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "12px", fontWeight: 700, color: "var(--wm-navy)", letterSpacing: "0.05em", textTransform: "uppercase", marginBottom: "8px" }}>
                        <Phone style={{ width: "14px", height: "14px", color: "var(--wm-red)" }} /> เบอร์โทรศัพท์
                      </label>
                      <input
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
                        placeholder="0xx-xxx-xxxx"
                        type="tel"
                        style={{ width: "100%", height: "48px", padding: "0 16px", border: "1px solid var(--wm-border)", background: "#fff", color: "var(--wm-navy)", fontSize: "15px", outline: "none", transition: "border-color 0.2s", boxSizing: "border-box" }}
                        onFocus={(e) => (e.currentTarget.style.borderColor = "var(--wm-navy)")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--wm-border)")}
                      />
                      {errors.phone && <p style={{ color: "var(--wm-red)", fontSize: "13px", marginTop: "6px" }}>{errors.phone}</p>}
                    </div>
                  </div>
                </section>

                {/* Summary */}
                {selectedWorkshop && selectedSlot && selectedSeats.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    style={{ background: "#fff", border: "1px solid var(--wm-border)", padding: "24px", display: "flex", flexDirection: "column", gap: "8px", fontSize: "14px" }}
                  >
                    <p style={{ fontWeight: 800, color: "var(--wm-navy)", fontSize: "16px", marginBottom: "4px" }}>สรุปการจอง</p>
                    <p style={{ color: "var(--wm-muted)" }}><span style={{ color: "var(--wm-navy)", fontWeight: 600 }}>คลาส:</span> {workshop?.title}</p>
                    <p style={{ color: "var(--wm-muted)" }}><span style={{ color: "var(--wm-navy)", fontWeight: 600 }}>วันเวลา:</span> {selectedSlot}</p>
                    <p style={{ color: "var(--wm-muted)" }}><span style={{ color: "var(--wm-navy)", fontWeight: 600 }}>ที่นั่ง:</span> <span style={{ color: "var(--wm-navy)", fontWeight: 900 }}>{selectedSeats.join(", ")}</span> ({selectedSeats.length} ที่นั่ง)</p>
                    <p style={{ color: "var(--wm-muted)" }}><span style={{ color: "var(--wm-navy)", fontWeight: 600 }}>ราคารวม:</span> <span style={{ color: "var(--wm-red)", fontWeight: 900 }}>฿{(selectedSeats.length * workshop?.price).toLocaleString()}</span></p>
                  </motion.div>
                )}

                {submitError && (
                  <div style={{ border: "1px solid #fca5a5", background: "#fff1f2", padding: "16px", fontSize: "14px", color: "#b91c1c" }}>
                    {submitError}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={isSubmitting || loading || !!error}
                  style={{
                    width: "100%", height: "56px",
                    background: isSubmitting || loading || !!error ? "#9ca3af" : "var(--wm-navy)",
                    color: "#fff", border: "none",
                    fontSize: "14px", fontWeight: 700, letterSpacing: "0.08em",
                    textTransform: "uppercase", cursor: isSubmitting || loading || !!error ? "not-allowed" : "pointer",
                    transition: "background 0.2s",
                  }}
                  onMouseEnter={(e) => { if (!isSubmitting && !loading && !error) e.currentTarget.style.background = "#2d2d4e"; }}
                  onMouseLeave={(e) => { if (!isSubmitting && !loading && !error) e.currentTarget.style.background = "var(--wm-navy)"; }}
                >
                  {isSubmitting ? "กำลังส่งคำขอจอง..." : "ยืนยันการจอง"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}