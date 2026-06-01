# Optimize & Redesign Remaining Pages Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Remove dead code and GPU jank, then restyle all remaining pages (auth + booking) to match the established white-minimalist palette.

**Architecture:** Three sequential phases — (1) assets + cleanup, (2) AuthLayout rewrite with CSS variable scoping so all four auth pages inherit the new look without individual edits, (3) Booking.jsx inline restyle preserving all logic. The seat-picker cinema dark theme is deliberately kept as a visually distinct section inside the white page.

**Tech Stack:** React 18, Vite, Tailwind CSS, CSS custom properties (`--wm-*`), framer-motion (already installed)

---

## File Map

| Action | File | What changes |
|--------|------|-------------|
| Shell copy | `public/models/*/shaded.png` × 5 | Static pre-rendered icons + room image |
| Modify | `src/components/WorkshopCardWhite.jsx` | Static `<img>` replaces `BakeryIcon3D` canvas |
| Delete | `src/components/FloatingCroissant.jsx` | Dead code |
| Delete | `src/components/AllClasses.jsx` | Dead code |
| Delete | `src/components/PopularClasses.jsx` | Dead code |
| Delete | `src/components/WorkshopCard.jsx` | Dead code |
| Delete | `src/components/FilterBar.jsx` | Dead code |
| Delete | `src/components/GlobeModel.jsx` | Dead code |
| Delete | `src/components/SeatBadge.jsx` | Dead code |
| Modify | `src/index.css` | Add `.auth-light-theme` CSS variable scope |
| Rewrite | `src/components/AuthLayout.jsx` | Two-column navy/white layout |
| Restyle | `src/pages/Booking.jsx` | White-minimalist inline styles, logic untouched |

---

## Task 1 — Copy shaded.png assets and fix card icons

**Files:**
- Shell: copy 5 shaded.png files into `public/models/`
- Modify: `src/components/WorkshopCardWhite.jsx`

- [ ] **Copy shaded.png files from Downloads**

```bash
cp "/Users/floridae/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/The Croissant Icon/shaded.png" /Users/floridae/960121Project/public/models/croissant/shaded.png

cp "/Users/floridae/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/Pink Glazed Donut Icon/shaded.png" /Users/floridae/960121Project/public/models/donut/shaded.png

cp "/Users/floridae/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/Colorful Macarons Icon/shaded.png" /Users/floridae/960121Project/public/models/macaron/shaded.png

cp "/Users/floridae/Downloads/Floating 3D Bakery Elements (Best for Feature Cards : Categories)/Sourdough Bread Icon/shaded.png" /Users/floridae/960121Project/public/models/bread/shaded.png

cp "/Users/floridae/Downloads/The 3D Isometric Bakery Room (Best for Hero Section)/shaded.png" /Users/floridae/960121Project/public/models/room/shaded.png
```

Verify: `ls /Users/floridae/960121Project/public/models/croissant/` should now include `shaded.png`.

- [ ] **Overwrite `src/components/WorkshopCardWhite.jsx`** — remove `BakeryIcon3D`/`Suspense`, add static img map:

```jsx
import { motion } from "framer-motion";

const EMOJI_TO_SHADED = {
  "🥐": "/models/croissant/shaded.png",
  "🍩": "/models/donut/shaded.png",
  "🎂": "/models/macaron/shaded.png",
  "🍞": "/models/bread/shaded.png",
  "🧁": "/models/macaron/shaded.png",
};

export default function WorkshopCardWhite({ workshop, onBook }) {
  const isFull = workshop.isFull || workshop.seatsLeft === 0;
  const shadedSrc = EMOJI_TO_SHADED[workshop.emoji];

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
      {/* Image with static 3D icon overlay */}
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

          {/* Tag badge */}
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

          {/* Static shaded.png icon — no WebGL canvas */}
          {shadedSrc && (
            <img
              src={shadedSrc}
              alt=""
              style={{
                position: "absolute", top: "8px", right: "8px",
                width: "72px", height: "72px",
                objectFit: "contain",
                filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.3))",
                pointerEvents: "none",
              }}
            />
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
          <span style={{ fontSize: "21px", fontWeight: 900, color: "var(--wm-navy)", letterSpacing: "-0.03em" }}>
            ฿{workshop.price.toLocaleString()}
          </span>

          {isFull ? (
            <button disabled style={{
              padding: "9px 18px", border: "1px solid #ddd",
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
              textTransform: "uppercase", color: "#bbb", background: "transparent", cursor: "not-allowed",
            }}>
              เต็มแล้ว
            </button>
          ) : (
            <button
              onClick={() => onBook(workshop)}
              style={{
                padding: "9px 18px", border: "1.5px solid var(--wm-navy)",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.1em",
                textTransform: "uppercase", color: "var(--wm-navy)", background: "transparent",
                cursor: "pointer", transition: "all 0.2s",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--wm-navy)"; e.currentTarget.style.color = "#fff"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "var(--wm-navy)"; }}
            >
              จองเลย
            </button>
          )}
        </div>
      </div>
    </motion.article>
  );
}
```

- [ ] **Build to verify** — `npm run build` from `/Users/floridae/960121Project`. Expected: passes with no errors.

- [ ] **Commit**
```bash
git add public/models/croissant/shaded.png public/models/donut/shaded.png public/models/macaron/shaded.png public/models/bread/shaded.png public/models/room/shaded.png src/components/WorkshopCardWhite.jsx
git commit -m "perf: replace BakeryIcon3D canvases with static shaded.png renders; copy room shaded.png"
```

---

## Task 2 — Delete dead components

**Files:**
- Delete: 7 files

- [ ] **Delete all unused components**

```bash
rm /Users/floridae/960121Project/src/components/FloatingCroissant.jsx
rm /Users/floridae/960121Project/src/components/AllClasses.jsx
rm /Users/floridae/960121Project/src/components/PopularClasses.jsx
rm /Users/floridae/960121Project/src/components/WorkshopCard.jsx
rm /Users/floridae/960121Project/src/components/FilterBar.jsx
rm /Users/floridae/960121Project/src/components/GlobeModel.jsx
rm /Users/floridae/960121Project/src/components/SeatBadge.jsx
```

- [ ] **Verify nothing imports these** — build must pass:

```bash
npm run build 2>&1 | grep -E "error|Error|cannot find|not found" | head -20
```

Expected: no import errors. If any appear, identify which file still imports the deleted component and remove that import.

- [ ] **Commit**
```bash
git add -A
git commit -m "chore: delete 7 dead components (FloatingCroissant, AllClasses, PopularClasses, WorkshopCard, FilterBar, GlobeModel, SeatBadge)"
```

---

## Task 3 — Add auth CSS variable scope to index.css

**Files:**
- Modify: `src/index.css`

This is the key trick: by scoping CSS variable overrides to `.auth-light-theme`, all shadcn/ui Input, Button, Label components inside AuthLayout automatically render in white-minimalist style — with zero changes to Login.jsx, Register.jsx, ForgotPassword.jsx, or ResetPassword.jsx.

- [ ] **Append to `src/index.css`** — add after all existing rules at the end of the file:

```css
/* Auth pages — light theme variable scope so shadcn components render white-minimalist */
.auth-light-theme {
  --background: 0 0% 100%;
  --foreground: 236 43% 14%;
  --card: 0 0% 100%;
  --card-foreground: 236 43% 14%;
  --primary: 236 43% 14%;
  --primary-foreground: 0 0% 100%;
  --muted-foreground: 0 0% 40%;
  --border: 0 0% 91%;
  --input: 0 0% 91%;
  --ring: 236 43% 14%;
  color-scheme: light;
  background-color: var(--wm-bg);
  color: var(--wm-navy);
}
```

- [ ] **Build to verify** — `npm run build`. Expected: passes cleanly.

- [ ] **Commit**
```bash
git add src/index.css
git commit -m "style: add .auth-light-theme CSS scope for shadcn component theming"
```

---

## Task 4 — Rewrite AuthLayout.jsx

**Files:**
- Rewrite: `src/components/AuthLayout.jsx`

The left panel shows the bakery room `shaded.png` decoratively. The right panel wraps `{children}` in `.auth-light-theme` so all shadcn inputs/buttons auto-theme.

- [ ] **Overwrite `src/components/AuthLayout.jsx` entirely:**

```jsx
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

        {/* Decorative bakery room render */}
        <img
          src="/models/room/shaded.png"
          alt=""
          style={{
            position: "absolute",
            bottom: "-30px",
            right: "-50px",
            width: "400px",
            opacity: 0.75,
            pointerEvents: "none",
          }}
        />
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
```

- [ ] **Build to verify** — `npm run build`. Expected: passes cleanly.

- [ ] **Commit**
```bash
git add src/components/AuthLayout.jsx
git commit -m "feat: rewrite AuthLayout — two-col navy/white split, .auth-light-theme scoping"
```

---

## Task 5 — Restyle Booking.jsx

**Files:**
- Modify: `src/pages/Booking.jsx`

**Rule:** All existing state, hooks, API calls, event handlers, and JSX structure stay identical. Only change: className strings and inline style values. The cinema-style seat picker section stays dark (it's kept as a distinct visual element inside the white page).

- [ ] **Replace the `return (` block of `Booking.jsx`** with the restyled version below. The imports and all state/logic above `return (` are untouched:

```jsx
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
                การจองสำเร็จ! 🎉
              </h2>
              <div style={{
                background: "#fff", border: "1px solid var(--wm-border)",
                padding: "28px", width: "100%", maxWidth: "360px",
                textAlign: "left", display: "flex", flexDirection: "column", gap: "8px",
                fontSize: "14px", color: "var(--wm-muted)",
              }}>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>รหัสการจอง:</span> {bookingResult?.bookingId}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>คลาส:</span> {workshop?.emoji} {workshop?.title}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>วันเวลา:</span> {selectedSlot}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>ที่นั่ง:</span> <span style={{ color: "var(--wm-navy)", fontWeight: 900 }}>{selectedSeats.join(", ")}</span> ({selectedSeats.length} ที่นั่ง)</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>ชื่อ:</span> {name}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>เบอร์โทร:</span> {phone}</p>
                <p><span style={{ color: "var(--wm-navy)", fontWeight: 700 }}>ราคารวม:</span> <span style={{ color: "var(--wm-red)", fontWeight: 900 }}>฿{(selectedSeats.length * workshop?.price).toLocaleString()}</span></p>
              </div>
              <p style={{ fontSize: "13px", color: "var(--wm-muted)" }}>ทีมงานจะติดต่อกลับเพื่อยืนยันการชำระเงิน</p>
              <Link to="/" style={{ textDecoration: "none" }}>
                <button style={{
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

                {/* Step 1: Select Workshop */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 700, flexShrink: 0,
                    }}>1</span>
                    เลือกคลาสเรียน
                  </h3>

                  {loading ? (
                    <div style={{ border: "1px solid var(--wm-border)", background: "#fff", padding: "24px", textAlign: "center", color: "var(--wm-muted)", fontSize: "14px" }}>
                      กำลังโหลดคลาสที่ว่างอยู่...
                    </div>
                  ) : error ? (
                    <div style={{ border: "1px solid #fca5a5", background: "#fff1f2", padding: "24px", textAlign: "center", color: "#b91c1c", fontSize: "14px" }}>
                      ไม่สามารถโหลดคลาสได้: {error}
                    </div>
                  ) : workshops.length === 0 ? (
                    <div style={{ border: "1px solid var(--wm-border)", background: "#fff", padding: "24px", textAlign: "center", color: "var(--wm-muted)", fontSize: "14px" }}>
                      ขณะนี้ไม่มีคลาสที่ว่างให้จอง
                    </div>
                  ) : (
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
                      {workshops.map((w) => (
                        <button
                          key={w.id}
                          type="button"
                          onClick={() => { setSelectedWorkshop(w.id); setSelectedSlot(""); setSelectedSeats([]); setErrors((prev) => ({ ...prev, workshop: undefined })); }}
                          style={{
                            textAlign: "left", padding: "16px",
                            border: selectedWorkshop === w.id ? "1.5px solid var(--wm-navy)" : "1px solid var(--wm-border)",
                            background: selectedWorkshop === w.id ? "var(--wm-bg)" : "#fff",
                            cursor: "pointer", transition: "all 0.2s",
                          }}
                        >
                          <span style={{ fontSize: "24px" }}>{w.emoji}</span>
                          <p style={{ fontWeight: 700, color: "var(--wm-navy)", fontSize: "14px", marginTop: "4px" }}>{w.title}</p>
                          <p style={{ fontSize: "12px", color: "var(--wm-muted)", marginTop: "2px" }}>{w.chef} · ฿{w.price.toLocaleString()}</p>
                        </button>
                      ))}
                    </div>
                  )}

                  {errors.workshop && <p style={{ color: "var(--wm-red)", fontSize: "13px", marginTop: "8px" }}>{errors.workshop}</p>}
                </section>

                {/* Step 2: Select Date/Time */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 700, flexShrink: 0,
                    }}>2</span>
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
                          onClick={() => {
                            setSelectedSlot(slot.slot_text);
                            setSelectedSlotId(slot.id);
                            setSelectedSeats([]);
                            setErrors((prev) => ({ ...prev, slot: undefined }));
                          }}
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

                {/* Step 3: Seat Picker — cinema dark theme intentionally kept */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 700, flexShrink: 0,
                    }}>3</span>
                    เลือกที่นั่งเรียน
                  </h3>
                  {!workshop || !selectedSlot ? (
                    <p style={{ color: "var(--wm-muted)", fontSize: "14px", fontStyle: "italic" }}>กรุณาเลือกคลาสและวันเวลาก่อนเพื่อดูที่นั่ง</p>
                  ) : (
                    <div style={{ background: '#0D0C0B', border: '1px solid rgba(201,148,58,0.15)', borderRadius: '8px', padding: '32px 24px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
                      <div style={{ position: 'relative', textAlign: 'center', marginBottom: '8px' }}>
                        <div style={{
                          background: 'linear-gradient(180deg, rgba(201,148,58,0.3) 0%, transparent 100%)',
                          border: '1px solid rgba(201,148,58,0.4)', borderBottom: 'none',
                          borderRadius: '4px 4px 0 0', padding: '6px 24px',
                          display: 'inline-block', minWidth: '200px',
                        }}>
                          <span style={{ color: '#C9943A', fontSize: '10px', fontWeight: 700, letterSpacing: '0.3em' }}>
                            🍳 หน้าชั้นเรียน / โต๊ะเชฟ
                          </span>
                        </div>
                        <div style={{ height: '3px', background: 'linear-gradient(90deg, transparent, #C9943A, transparent)', borderRadius: '0 0 8px 8px' }} />
                        <div style={{ height: '20px', background: 'linear-gradient(180deg, rgba(201,148,58,0.08), transparent)', borderRadius: '0 0 50% 50%' }} />
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}>
                        {seatConfigs[workshop.id]?.rows.map((row) => (
                          <div key={row} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#5A4A3A', width: '16px', textAlign: 'center' }}>{row}</span>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                              {seatConfigs[workshop.id]?.cols.map((col) => {
                                const seatId = `${row}${col}`;
                                const isBooked = seatConfigs[workshop.id]?.booked.includes(seatId);
                                const isSelected = selectedSeats.includes(seatId);
                                return (
                                  <button
                                    key={seatId}
                                    type="button"
                                    disabled={isBooked}
                                    title={seatId}
                                    onClick={() => {
                                      if (isSelected) {
                                        setSelectedSeats(selectedSeats.filter((s) => s !== seatId));
                                      } else {
                                        setSelectedSeats([...selectedSeats, seatId]);
                                      }
                                      setErrors((prev) => ({ ...prev, seats: undefined }));
                                    }}
                                    style={{
                                      width: '36px', height: '32px', borderRadius: '4px 4px 6px 6px',
                                      border: 'none', cursor: isBooked ? 'not-allowed' : 'pointer',
                                      transition: 'all 0.15s ease', fontSize: '9px', fontWeight: 700,
                                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                                      justifyContent: 'center', gap: '1px', position: 'relative',
                                      backgroundColor: isBooked ? '#3D2B1F' : isSelected ? '#C9943A' : '#1E3A2F',
                                      color: isBooked ? '#6B4A35' : isSelected ? '#0A0806' : '#5BA882',
                                      boxShadow: isSelected ? '0 0 12px rgba(201,148,58,0.5)' : 'none',
                                      transform: isSelected ? 'scale(1.1)' : 'scale(1)',
                                    }}
                                  >
                                    <div style={{
                                      width: '22px', height: '4px', borderRadius: '3px 3px 0 0',
                                      backgroundColor: isBooked ? '#5A3D2B' : isSelected ? '#B8832A' : '#2D5A45',
                                    }} />
                                    <span style={{ letterSpacing: '-0.02em', lineHeight: 1 }}>{seatId}</span>
                                  </button>
                                );
                              })}
                            </div>
                            <span style={{ fontSize: '11px', fontWeight: 700, color: '#5A4A3A', width: '16px', textAlign: 'center' }}>{row}</span>
                          </div>
                        ))}
                      </div>

                      <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', paddingTop: '16px', borderTop: '1px solid rgba(201,148,58,0.1)' }}>
                        {[
                          { color: '#1E3A2F', label: 'ว่าง' },
                          { color: '#C9943A', label: 'เลือก', glow: true },
                          { color: '#3D2B1F', label: 'จองแล้ว' },
                        ].map(({ color, label, glow }) => (
                          <div key={label} style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                            <div style={{ width: '24px', height: '22px', borderRadius: '3px 3px 5px 5px', backgroundColor: color, boxShadow: glow ? '0 0 8px rgba(201,148,58,0.4)' : 'none' }} />
                            <span style={{ fontSize: '11px', color: '#7A6A55' }}>{label}</span>
                          </div>
                        ))}
                      </div>

                      {selectedSeats.length > 0 && (
                        <div style={{ textAlign: 'center', paddingTop: '8px' }}>
                          <p style={{ fontSize: '13px', color: '#F2E8D5' }}>
                            ที่นั่งที่เลือก: <span style={{ color: '#C9943A', fontWeight: 700 }}>{selectedSeats.join(", ")}</span> ({selectedSeats.length} ที่นั่ง)
                          </p>
                          <p style={{ fontSize: '11px', color: '#7A6A55', marginTop: '4px' }}>
                            ฿{workshop.price.toLocaleString()} × {selectedSeats.length} = <span style={{ color: '#C9943A', fontWeight: 700 }}>฿{(selectedSeats.length * workshop.price).toLocaleString()}</span>
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                  {errors.seats && <p style={{ color: "var(--wm-red)", fontSize: "13px", marginTop: "8px" }}>{errors.seats}</p>}
                </section>

                {/* Step 4: Personal Info */}
                <section>
                  <h3 style={{ fontSize: "17px", fontWeight: 800, color: "var(--wm-navy)", marginBottom: "16px", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{
                      width: "28px", height: "28px", background: "var(--wm-navy)", color: "#fff",
                      borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center",
                      fontSize: "13px", fontWeight: 700, flexShrink: 0,
                    }}>4</span>
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
                        style={{
                          width: "100%", height: "48px", padding: "0 16px",
                          border: "1px solid var(--wm-border)", background: "#fff",
                          color: "var(--wm-navy)", fontSize: "15px", outline: "none",
                          transition: "border-color 0.2s", boxSizing: "border-box",
                        }}
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
                        style={{
                          width: "100%", height: "48px", padding: "0 16px",
                          border: "1px solid var(--wm-border)", background: "#fff",
                          color: "var(--wm-navy)", fontSize: "15px", outline: "none",
                          transition: "border-color 0.2s", boxSizing: "border-box",
                        }}
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
                    style={{
                      background: "#fff", border: "1px solid var(--wm-border)",
                      padding: "24px", display: "flex", flexDirection: "column", gap: "8px",
                      fontSize: "14px",
                    }}
                  >
                    <p style={{ fontWeight: 800, color: "var(--wm-navy)", fontSize: "16px", marginBottom: "4px" }}>สรุปการจอง</p>
                    <p style={{ color: "var(--wm-muted)" }}><span style={{ color: "var(--wm-navy)", fontWeight: 600 }}>คลาส:</span> {workshop?.emoji} {workshop?.title}</p>
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
                  {isSubmitting ? "กำลังส่งคำขอจอง..." : "✅ ยืนยันการจอง"}
                </button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
```

- [ ] **Build to verify**
```bash
npm run build 2>&1 | tail -8
```
Expected: build passes. No unused import warnings should become errors.

- [ ] **Commit**
```bash
git add src/pages/Booking.jsx
git commit -m "feat: restyle Booking.jsx — white-minimalist, cinema seat picker kept dark"
```

---

## Task 6 — Final Verification

- [ ] **Start dev server**
```bash
npm run dev
```

- [ ] **Manual checklist:**
  - [ ] Home page: workshop cards show Unsplash photo + static shaded.png icon (no canvas per card)
  - [ ] No console errors about WebGL context limit
  - [ ] Navigate to `/login` → left navy panel with bakery room image, right white form card
  - [ ] Navigate to `/register` → same layout, form inputs have navy border and navy submit button
  - [ ] Navigate to `/forgot-password` → same layout
  - [ ] Navigate to `/reset-password` → same layout
  - [ ] Navigate to `/booking` → white page, navy step circles, cinema dark seat picker, navy submit
  - [ ] Booking flow works end-to-end: select workshop → slot → seats → fill name/phone → confirm
  - [ ] Confirmation screen shows in white minimalist style

- [ ] **Final commit** (if any untracked polish was made)
```bash
git add -A
git commit -m "feat: complete optimize & page redesign — perf cleanup, auth redesign, booking restyle"
```

---

## Self-Review

**Spec coverage:**
- ✅ Copy 5 shaded.png files (Task 1)
- ✅ WorkshopCardWhite → static img, no BakeryIcon3D canvas (Task 1)
- ✅ Delete 7 dead components (Task 2)
- ✅ `.auth-light-theme` CSS scope (Task 3)
- ✅ AuthLayout two-column navy/white rewrite (Task 4)
- ✅ Booking.jsx full restyle, logic unchanged (Task 5)
- ✅ Auth pages (Login/Register/ForgotPassword/ResetPassword) inherit theme via `.auth-light-theme` — no individual edits needed

**Placeholder scan:** No TBDs. All code blocks are complete and copy-paste ready.

**Consistency check:**
- `var(--wm-navy)`, `var(--wm-red)`, `var(--wm-border)`, `var(--wm-bg)` used consistently across Tasks 1, 4, 5 ✅
- `APP_NAME` imported from `@/lib/app-params` in AuthLayout (value = "แป้งละออง") ✅
- Booking.jsx keeps all imports (ChevronLeft, CalendarDays, User, Phone, CheckCircle2, AnimatePresence, motion, cn, etc.) — the return block replacement relies on them all being present ✅
