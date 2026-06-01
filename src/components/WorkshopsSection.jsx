import { useEffect, useMemo, useState } from "react";
import { fetchWorkshops } from "@/api/apiClient";
import { useDebounce } from "@/hooks/useDebounce";
import { useMediaQuery } from "@/hooks/useMediaQuery";
import WorkshopCardWhite from "./WorkshopCardWhite";
import BookingModal from "./BookingModal";

// แม็พไอคอนตามชื่อ category จริงในฐานข้อมูล (seed) — ถ้าไม่ตรงก็ไม่แสดงไอคอน
const CATEGORY_ICON = {
  "ขนมปังอบ": "/icons/bread.svg",
  "เค้กและขนมหวาน": "/icons/cake.svg",
  "เบเกอรี่ฝรั่งเศส": "/icons/croissant.svg",
  "โดนัทและฟริตเตอร์": "/icons/macaron.svg",
};

const ALL = "ทั้งหมด";

export default function WorkshopsSection() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState(ALL);
  const [searchInput, setSearchInput] = useState("");
  const searchQuery = useDebounce(searchInput, 300);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);
  const isTablet = useMediaQuery("(max-width: 1024px)");
  const isMobile = useMediaQuery("(max-width: 640px)");
  const cardCols = isMobile ? 1 : isTablet ? 2 : 3;

  useEffect(() => {
    fetchWorkshops()
      .then(setWorkshops)
      .catch((err) => setError(err.message ?? "โหลดข้อมูลไม่ได้"))
      .finally(() => setLoading(false));
  }, []);

  // สร้างรายการ category จากข้อมูลจริงที่โหลดมา — กันปัญหา list ไม่ตรงกับ seed
  const categories = useMemo(() => {
    const unique = [...new Set(workshops.map((w) => w.category).filter(Boolean))];
    return [ALL, ...unique];
  }, [workshops]);

  const filtered = workshops.filter((w) => {
    const matchCategory = category === ALL || w.category === category;
    const q = searchQuery.trim().toLowerCase();
    const matchSearch =
      !q ||
      w.title?.toLowerCase().includes(q) ||
      w.chef?.toLowerCase().includes(q);
    return matchCategory && matchSearch;
  });

  const handleBook = (workshop) => {
    setSelectedWorkshop(workshop);
    setBookingOpen(true);
  };

  return (
    <section
      id="classes-section"
      style={{
        background: "#fff",
        padding: "clamp(64px,10vw,100px) clamp(20px,5vw,48px)",
        borderTop: "1px solid var(--wm-border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ marginBottom: "48px" }}>
          <div style={{
            fontSize: "10px", fontWeight: 700, letterSpacing: "0.3em",
            textTransform: "uppercase", color: "var(--wm-red)", marginBottom: "12px",
          }}>
            All Classes
          </div>
          <h2 style={{
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900,
            color: "var(--wm-navy)", letterSpacing: "-0.04em", lineHeight: 1,
          }}>
            คลาสเรียนทั้งหมด
          </h2>
        </div>

        {/* Search input — debounced 300ms ป้องกัน filter ทำงานทุก keystroke */}
        <input
          type="text"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="ค้นหาคลาส หรือชื่อเชฟ..."
          style={{
            width: "100%", maxWidth: "400px", height: "44px",
            padding: "0 16px", marginBottom: "24px",
            border: "1.5px solid var(--wm-border)", background: "#fff",
            color: "var(--wm-navy)", fontSize: "14px", outline: "none",
            transition: "border-color 0.2s", boxSizing: "border-box",
          }}
          onFocus={(e) => (e.currentTarget.style.borderColor = "var(--wm-navy)")}
          onBlur={(e) => (e.currentTarget.style.borderColor = "var(--wm-border)")}
        />

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: "8px 20px",
                fontSize: "12px",
                fontWeight: 600,
                letterSpacing: "0.04em",
                border: "1.5px solid",
                borderColor: category === cat ? "var(--wm-navy)" : "var(--wm-border)",
                background: category === cat ? "var(--wm-navy)" : "transparent",
                color: category === cat ? "#fff" : "#888",
                cursor: "pointer",
                transition: "all 0.18s",
                display: "flex",
                alignItems: "center",
                gap: "6px",
              }}
            >
              {CATEGORY_ICON[cat] && (
                <img
                  src={CATEGORY_ICON[cat]}
                  alt=""
                  style={{
                    width: "14px", height: "14px",
                    filter: category === cat ? "invert(1)" : "none",
                    opacity: category === cat ? 1 : 0.6,
                  }}
                />
              )}
              {cat}
            </button>
          ))}
        </div>

        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: "#aaa", fontSize: "14px", letterSpacing: "0.1em" }}>
            กำลังโหลด...
          </div>
        ) : error ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--wm-red)", fontSize: "14px" }}>
            {error}
          </div>
        ) : filtered.length === 0 ? (
          <div style={{ padding: "80px 0", textAlign: "center" }}>
            <p style={{ color: "var(--wm-navy)", fontSize: "16px", fontWeight: 600, marginBottom: "8px" }}>
              ไม่พบคลาสที่ตรงกับเงื่อนไข
            </p>
            <p style={{ color: "#999", fontSize: "13px", marginBottom: "24px" }}>
              ลองเปลี่ยนหมวดหมู่หรือคำค้นหาดูอีกครั้ง
            </p>
            <button
              onClick={() => { setCategory(ALL); setSearchInput(""); }}
              style={{
                padding: "10px 24px", fontSize: "12px", fontWeight: 600,
                letterSpacing: "0.04em", border: "1.5px solid var(--wm-navy)",
                background: "transparent", color: "var(--wm-navy)", cursor: "pointer",
              }}
            >
              ล้างตัวกรอง
            </button>
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: `repeat(${cardCols}, 1fr)`,
            gap: "2px",
          }}>
            {filtered.map((w) => (
              <WorkshopCardWhite key={w.id} workshop={w} onBook={handleBook} />
            ))}
          </div>
        )}
      </div>

      <BookingModal
        workshop={selectedWorkshop}
        open={bookingOpen}
        onOpenChange={setBookingOpen}
      />
    </section>
  );
}
