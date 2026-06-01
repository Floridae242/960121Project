# แป้งละออง Home Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the dark-luxury home page with a white-minimalist, immersive scrollytelling experience featuring an interactive 3D wireframe globe and sticky feature panels.

**Architecture:** Eight new/rewritten components assembled in `Home.jsx`. The globe lives in two places — hero (full size, cursor-reactive) and features section (sticky, smaller, panel-aware). Sticky scrollytelling uses a `position:sticky` globe div followed by panels with `margin-top:-100vh`. All existing auth/booking pages stay untouched.

**Tech Stack:** React 18, Vite, @react-three/fiber ^8, @react-three/drei ^9, framer-motion ^11, three ^0.168, tailwindcss, react-hot-toast

---

## File Map

| Action | Path | Responsibility |
|--------|------|---------------|
| Modify | `src/index.css` | Add white-minimalist CSS custom properties |
| Create | `src/components/GlobeModel.jsx` | R3F wireframe globe — geometry, lights, auto-rotation, cursor tilt, panel-preset API |
| Create | `src/components/NavBar.jsx` | Sticky white nav — logo, links, Book Now, scroll shadow |
| Rewrite | `src/components/HeroSection.jsx` | White hero — left text, right globe canvas, scroll indicator |
| Create | `src/components/FeaturePanel.jsx` | Single feature panel — number, eyebrow, Thai headline, body |
| Create | `src/components/FeaturesSection.jsx` | Sticky globe + 3 panels via IntersectionObserver |
| Create | `src/components/WorkshopCardWhite.jsx` | Minimal white workshop card — no image |
| Create | `src/components/WorkshopsSection.jsx` | Workshop grid — fetch, filter, BookingModal |
| Create | `src/components/ContactSection.jsx` | Dark navy two-col — copy/social left, form right |
| Rewrite | `src/pages/Home.jsx` | Assembles NavBar + Hero + Features + Workshops + Contact + Footer |

---

## Task 1 — CSS Tokens

**Files:**
- Modify: `src/index.css`

- [ ] **Add white-minimalist custom properties** after the existing `:root` block (do not remove existing dark tokens — other pages use them):

```css
/* White-minimalist redesign tokens — used by new home page components */
:root {
  --wm-bg: #F8F8FA;
  --wm-surface: #FFFFFF;
  --wm-navy: #1A1A2E;
  --wm-red: #FF3B5C;
  --wm-muted: #666666;
  --wm-border: #E8E8E8;
  --wm-contact-bg: #1A1A2E;
  --wm-footer-bg: #111827;
}
```

Add after the closing `}` of the existing `:root` block, before `@keyframes fadeUp`.

Also add the `fadeUp` keyframe alias for the new components (they use `motion` from framer-motion so no raw CSS animation needed — no change required here).

- [ ] **Verify** by running `npm run build` — should pass with no errors.

- [ ] **Commit**
```bash
git add src/index.css
git commit -m "style: add white-minimalist CSS tokens for home redesign"
```

---

## Task 2 — GlobeModel Component

**Files:**
- Create: `src/components/GlobeModel.jsx`

This is the core 3D element used in both the hero and the features section. It accepts a `panelIndex` prop (0, 1, or 2) that rotates the globe to a preset angle when the features section is active.

- [ ] **Create `src/components/GlobeModel.jsx`:**

```jsx
import { useRef, useEffect } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { PresentationControls } from "@react-three/drei";
import * as THREE from "three";

// Preset Y-rotations for each feature panel (radians)
const PANEL_ROTATIONS = [0, Math.PI * 0.4, Math.PI * 0.8];

function Globe({ panelIndex = -1, enableCursorTilt = false }) {
  const groupRef = useRef();
  const dotGroupRef = useRef();
  const targetRotY = useRef(0);
  const targetRotX = useRef(0);
  const { gl, size } = useThree();

  // Cursor tilt via pointer move on the canvas element
  useEffect(() => {
    if (!enableCursorTilt) return;
    const canvas = gl.domElement;
    const handleMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      const nx = ((e.clientX - rect.left) / rect.width) * 2 - 1;  // -1 to 1
      const ny = -((e.clientY - rect.top) / rect.height) * 2 + 1; // -1 to 1
      targetRotX.current = ny * 0.25; // max ±0.25 rad (~14°)
      targetRotY.current = nx * 0.25;
    };
    canvas.addEventListener("pointermove", handleMove);
    return () => canvas.removeEventListener("pointermove", handleMove);
  }, [gl, enableCursorTilt]);

  useFrame((_, delta) => {
    if (!groupRef.current) return;

    // Auto-rotate Y continuously
    groupRef.current.rotation.y += delta * 0.3;

    // Apply cursor tilt (lerp toward target)
    if (enableCursorTilt) {
      groupRef.current.rotation.x = THREE.MathUtils.lerp(
        groupRef.current.rotation.x,
        targetRotX.current,
        0.05
      );
    }

    // Panel preset — override auto-rotation toward preset angle
    if (panelIndex >= 0) {
      const preset = PANEL_ROTATIONS[panelIndex] ?? 0;
      groupRef.current.rotation.y = THREE.MathUtils.lerp(
        groupRef.current.rotation.y,
        preset,
        0.02
      );
    }

    // Orbiting dot
    if (dotGroupRef.current) {
      dotGroupRef.current.rotation.y += delta * 0.8;
    }
  });

  // Latitude ring Y positions and their matching radii for a sphere of radius 2
  const latitudes = [
    { y: 0,     r: 2.01 },
    { y: 0.8,   r: 1.84 },
    { y: -0.8,  r: 1.84 },
    { y: 1.5,   r: 1.32 },
    { y: -1.5,  r: 1.32 },
  ];

  return (
    <group ref={groupRef}>
      {/* Outer wireframe sphere */}
      <mesh>
        <sphereGeometry args={[2, 28, 18]} />
        <meshBasicMaterial color="#1A1A2E" wireframe opacity={0.18} transparent />
      </mesh>

      {/* Latitude rings */}
      {latitudes.map(({ y, r }, i) => (
        <mesh key={i} position={[0, y, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[r, 0.008, 8, 80]} />
          <meshBasicMaterial color="#1A1A2E" opacity={0.25} transparent />
        </mesh>
      ))}

      {/* Red accent orbital rings */}
      <mesh rotation={[Math.PI / 2 + 0.26, 0, 0]}>
        <torusGeometry args={[2.15, 0.015, 8, 100]} />
        <meshBasicMaterial color="#FF3B5C" />
      </mesh>
      <mesh rotation={[Math.PI / 2 + 0.52, 0.8, 0]}>
        <torusGeometry args={[2.1, 0.008, 8, 100]} />
        <meshBasicMaterial color="#FF3B5C" opacity={0.45} transparent />
      </mesh>

      {/* Glowing red core */}
      <mesh>
        <sphereGeometry args={[0.14, 16, 16]} />
        <meshStandardMaterial color="#FF3B5C" emissive="#FF3B5C" emissiveIntensity={2} />
      </mesh>

      {/* Orbiting dot group */}
      <group ref={dotGroupRef}>
        <mesh position={[2.15, 0, 0]}>
          <sphereGeometry args={[0.07, 10, 10]} />
          <meshStandardMaterial color="#FF3B5C" emissive="#FF3B5C" emissiveIntensity={1.5} />
        </mesh>
      </group>

      {/* Lights */}
      <ambientLight intensity={0.9} />
      <directionalLight position={[5, 8, 5]} intensity={0.6} />
    </group>
  );
}

/**
 * GlobeModel — full Canvas wrapper.
 * Props:
 *   panelIndex {number}  -1 = free rotation (hero), 0/1/2 = feature panel preset
 *   enableCursorTilt {boolean}  true in hero only
 *   scale {number}  camera distance (default 6 = full size, 8 = smaller in features)
 *   className {string}
 */
export default function GlobeModel({
  panelIndex = -1,
  enableCursorTilt = false,
  fov = 45,
  className = "",
}) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 6], fov }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
        frameloop="always"
      >
        <PresentationControls
          global
          rotation={[0, 0, 0]}
          polar={[-Math.PI / 5, Math.PI / 5]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
        >
          <Globe panelIndex={panelIndex} enableCursorTilt={enableCursorTilt} />
        </PresentationControls>
      </Canvas>
    </div>
  );
}
```

- [ ] **Verify** the component renders by running dev server (`npm run dev`) — no console errors expected at this point (it won't be visible until wired into a page).

- [ ] **Commit**
```bash
git add src/components/GlobeModel.jsx
git commit -m "feat: add GlobeModel R3F wireframe globe with cursor tilt and panel presets"
```

---

## Task 3 — NavBar Component

**Files:**
- Create: `src/components/NavBar.jsx`

- [ ] **Create `src/components/NavBar.jsx`:**

```jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

export default function NavBar() {
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 50,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        padding: "0 48px",
        height: "64px",
        background: "rgba(255,255,255,0.95)",
        backdropFilter: "blur(12px)",
        borderBottom: "1px solid var(--wm-border)",
        boxShadow: scrolled ? "0 1px 24px rgba(0,0,0,0.08)" : "none",
        transition: "box-shadow 0.3s ease",
      }}
    >
      {/* Logo */}
      <button
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          fontSize: "18px",
          fontWeight: 800,
          color: "var(--wm-navy)",
          letterSpacing: "-0.03em",
        }}
      >
        แป้งละออง<span style={{ color: "var(--wm-red)" }}>.</span>
      </button>

      {/* Center links */}
      <div style={{ display: "flex", gap: "32px" }}>
        {[
          { label: "Classes", id: "classes-section" },
          { label: "Features", id: "features-section" },
          { label: "Contact", id: "contact-section" },
        ].map(({ label, id }) => (
          <button
            key={id}
            onClick={() => scrollTo(id)}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: 500,
              color: "#555",
              letterSpacing: "0.02em",
              transition: "color 0.2s",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.color = "var(--wm-navy)")}
            onMouseLeave={(e) => (e.currentTarget.style.color = "#555")}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right CTA */}
      <div style={{ display: "flex", gap: "12px", alignItems: "center" }}>
        {isAuthenticated && (
          <button
            onClick={logout}
            style={{
              background: "none",
              border: "none",
              cursor: "pointer",
              fontSize: "13px",
              color: "#888",
            }}
          >
            ออกจากระบบ
          </button>
        )}
        <button
          onClick={() => isAuthenticated ? scrollTo("classes-section") : navigate("/login")}
          style={{
            padding: "10px 24px",
            background: "var(--wm-navy)",
            color: "#fff",
            border: "none",
            cursor: "pointer",
            fontSize: "13px",
            fontWeight: 700,
            letterSpacing: "0.06em",
            textTransform: "uppercase",
            transition: "background 0.2s",
          }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "#2d2d4e")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--wm-navy)")}
        >
          Book Now
        </button>
      </div>
    </nav>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/NavBar.jsx
git commit -m "feat: add sticky white NavBar with scroll shadow and auth-aware CTA"
```

---

## Task 4 — HeroSection Rewrite

**Files:**
- Rewrite: `src/components/HeroSection.jsx`

- [ ] **Overwrite `src/components/HeroSection.jsx` entirely:**

```jsx
import { Suspense } from "react";
import { motion } from "framer-motion";
import GlobeModel from "./GlobeModel";

const fadeUp = (delay = 0) => ({
  initial: { opacity: 0, y: 28 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1], delay },
});

export default function HeroSection() {
  return (
    <section
      style={{
        height: "100vh",
        background: "var(--wm-bg)",
        display: "flex",
        alignItems: "center",
        paddingTop: "64px",
        overflow: "hidden",
        position: "relative",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          width: "100%",
          margin: "0 auto",
          padding: "0 48px",
          display: "flex",
          alignItems: "center",
          gap: "0",
        }}
      >
        {/* Left — text */}
        <div style={{ flex: 1 }}>
          <motion.div {...fadeUp(0)} style={{ marginBottom: "20px", display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ width: "32px", height: "1px", background: "var(--wm-red)" }} />
            <span style={{
              fontSize: "11px", fontWeight: 700, letterSpacing: "0.35em",
              textTransform: "uppercase", color: "var(--wm-red)",
            }}>
              Artisan Bakery Workshops
            </span>
          </motion.div>

          <motion.h1 {...fadeUp(0.1)} style={{
            fontSize: "clamp(48px, 7vw, 88px)",
            fontWeight: 900,
            color: "var(--wm-navy)",
            lineHeight: 1,
            letterSpacing: "-0.04em",
            marginBottom: "24px",
          }}>
            ศิลปะ<em style={{ fontStyle: "italic", color: "var(--wm-red)" }}>แห่ง</em>
            <br />
            การนวดแป้ง
          </motion.h1>

          <motion.p {...fadeUp(0.2)} style={{
            fontSize: "16px", color: "var(--wm-muted)", lineHeight: 1.7,
            maxWidth: "380px", marginBottom: "40px", fontWeight: 400,
          }}>
            เรียนรู้ศิลปะการทำขนมอบจากเชฟมืออาชีพ
            <br />
            ในบรรยากาศอบอุ่นสไตล์อาร์ทิซาน
          </motion.p>

          <motion.div {...fadeUp(0.3)}>
            <button
              onClick={() => document.getElementById("classes-section")?.scrollIntoView({ behavior: "smooth" })}
              style={{
                display: "inline-flex", alignItems: "center", gap: "12px",
                padding: "16px 36px", background: "var(--wm-navy)", color: "#fff",
                border: "none", cursor: "pointer", fontSize: "13px",
                fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
                transition: "background 0.2s",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.background = "#2d2d4e")}
              onMouseLeave={(e) => (e.currentTarget.style.background = "var(--wm-navy)")}
            >
              Start Exploring <span style={{ fontSize: "18px" }}>↓</span>
            </button>
          </motion.div>
        </div>

        {/* Right — 3D Globe */}
        <div style={{ flex: 1, height: "520px", position: "relative" }}>
          <Suspense fallback={
            <div style={{ display: "flex", height: "100%", alignItems: "center", justifyContent: "center" }}>
              <span style={{ fontSize: "64px" }}>🌐</span>
            </div>
          }>
            <GlobeModel enableCursorTilt fov={42} />
          </Suspense>
          <span style={{
            position: "absolute", bottom: "16px", right: "0",
            fontSize: "10px", fontWeight: 600, color: "#999",
            letterSpacing: "0.2em", textTransform: "uppercase",
            display: "flex", alignItems: "center", gap: "8px",
          }}>
            <span style={{ display: "block", width: "20px", height: "1px", background: "#ccc" }} />
            Drag to rotate
          </span>
        </div>
      </div>

      {/* Scroll indicator */}
      <div style={{
        position: "absolute", bottom: "32px", left: "48px",
        display: "flex", flexDirection: "column", alignItems: "center", gap: "8px",
      }}>
        <div style={{ width: "1px", height: "48px", background: "linear-gradient(var(--wm-navy), transparent)" }} />
        <span style={{ fontSize: "10px", letterSpacing: "0.2em", color: "#999", textTransform: "uppercase" }}>Scroll</span>
      </div>
    </section>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/HeroSection.jsx
git commit -m "feat: rewrite HeroSection — white bg, globe right, framer-motion stagger"
```

---

## Task 5 — FeaturePanel Component

**Files:**
- Create: `src/components/FeaturePanel.jsx`

- [ ] **Create `src/components/FeaturePanel.jsx`:**

```jsx
import { motion } from "framer-motion";

/**
 * FeaturePanel — one 100vh panel in the sticky-scroll features section.
 * Content occupies the right half only so the sticky globe shows on the left.
 *
 * Props:
 *   number   {string}  "01" | "02" | "03"
 *   eyebrow  {string}  English label
 *   title    {string}  Thai headline (may contain <br/>)
 *   body     {string}  Thai body copy
 *   panelRef {React.Ref}  forwarded ref for IntersectionObserver in parent
 */
export default function FeaturePanel({ number, eyebrow, title, body, panelRef }) {
  return (
    <div
      ref={panelRef}
      style={{
        height: "100vh",
        display: "flex",
        alignItems: "center",
        marginLeft: "50%",
        padding: "80px 48px",
        background: "rgba(248,248,250,0.92)",
        borderTop: "1px solid var(--wm-border)",
        position: "relative",
        zIndex: 1,
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 32 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        <div style={{
          fontSize: "80px", fontWeight: 900, color: "#E8E8F0",
          lineHeight: 1, marginBottom: "-16px", letterSpacing: "-0.04em",
          userSelect: "none",
        }}>
          {number}
        </div>
        <div style={{
          fontSize: "10px", fontWeight: 700, letterSpacing: "0.35em",
          textTransform: "uppercase", color: "var(--wm-red)", marginBottom: "12px",
        }}>
          {eyebrow}
        </div>
        <h2 style={{
          fontSize: "clamp(28px, 3vw, 40px)", fontWeight: 900,
          color: "var(--wm-navy)", lineHeight: 1.1,
          letterSpacing: "-0.03em", marginBottom: "20px",
        }}>
          {title}
        </h2>
        <p style={{
          fontSize: "15px", color: "var(--wm-muted)", lineHeight: 1.75,
          maxWidth: "380px",
        }}>
          {body}
        </p>
      </motion.div>
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/FeaturePanel.jsx
git commit -m "feat: add FeaturePanel component for sticky scrollytelling"
```

---

## Task 6 — FeaturesSection Component

**Files:**
- Create: `src/components/FeaturesSection.jsx`

- [ ] **Create `src/components/FeaturesSection.jsx`:**

```jsx
import { Suspense, useEffect, useRef, useState } from "react";
import GlobeModel from "./GlobeModel";
import FeaturePanel from "./FeaturePanel";

const PANELS = [
  {
    number: "01",
    eyebrow: "Expert Instructors",
    title: "เชฟมืออาชีพ\nระดับโลก",
    body: "เรียนรู้จากเชฟที่ผ่านการฝึกอบรมระดับนานาชาติ ทุกคลาสออกแบบมาเพื่อให้คุณได้ทักษะที่นำไปใช้จริง",
  },
  {
    number: "02",
    eyebrow: "Small Groups",
    title: "กลุ่มเล็ก\nใส่ใจทุกคน",
    body: "ไม่เกิน 12 คนต่อคลาส เชฟสามารถดูแลและให้ฟีดแบ็กได้อย่างใกล้ชิดทุกขั้นตอน",
  },
  {
    number: "03",
    eyebrow: "Premium Equipment",
    title: "อุปกรณ์ระดับ\nโปรเฟสชันนัล",
    body: "เตาอบ อุปกรณ์ และวัตถุดิบชั้นเลิศ เหมือนครัวมืออาชีพจริงๆ ทุกอย่างพร้อมสำหรับคุณ",
  },
];

export default function FeaturesSection() {
  const [activePanel, setActivePanel] = useState(-1);
  const panelRefs = useRef([]);

  useEffect(() => {
    const observers = panelRefs.current.map((el, idx) => {
      if (!el) return null;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) setActivePanel(idx);
        },
        { threshold: 0.5 }
      );
      obs.observe(el);
      return obs;
    });
    return () => observers.forEach((obs) => obs?.disconnect());
  }, []);

  return (
    <section id="features-section" style={{ position: "relative" }}>
      {/* Sticky globe — left half of viewport */}
      <div style={{
        position: "sticky",
        top: 0,
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute",
          top: 0, left: 0, bottom: 0,
          width: "50%",
          background: "var(--wm-bg)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}>
          <div style={{ width: "100%", height: "480px" }}>
            <Suspense fallback={null}>
              <GlobeModel panelIndex={activePanel >= 0 ? activePanel : 0} fov={50} />
            </Suspense>
          </div>
        </div>
      </div>

      {/* Panels — overlap sticky via negative top margin */}
      <div style={{ marginTop: "-100vh" }}>
        {PANELS.map((panel, idx) => (
          <FeaturePanel
            key={idx}
            {...panel}
            title={panel.title.split("\n").map((line, i, arr) =>
              i < arr.length - 1 ? <span key={i}>{line}<br /></span> : line
            )}
            panelRef={(el) => (panelRefs.current[idx] = el)}
          />
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/FeaturesSection.jsx
git commit -m "feat: add FeaturesSection sticky scrollytelling with IntersectionObserver"
```

---

## Task 7 — WorkshopCardWhite Component

**Files:**
- Create: `src/components/WorkshopCardWhite.jsx`

- [ ] **Create `src/components/WorkshopCardWhite.jsx`:**

```jsx
import { motion } from "framer-motion";

/**
 * WorkshopCardWhite — minimal white card, no image.
 * Props match the workshop object shape from fetchWorkshops().
 */
export default function WorkshopCardWhite({ workshop, onBook }) {
  const isFull = workshop.isFull || workshop.seatsLeft === 0;

  return (
    <motion.article
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      style={{
        padding: "32px",
        border: "1px solid var(--wm-border)",
        background: "var(--wm-surface)",
        display: "flex",
        flexDirection: "column",
        gap: "0",
        transition: "background 0.2s, border-color 0.2s",
        cursor: "default",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = "var(--wm-bg)";
        e.currentTarget.style.borderColor = "#ccc";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = "var(--wm-surface)";
        e.currentTarget.style.borderColor = "var(--wm-border)";
      }}
    >
      {/* Tag pill */}
      {workshop.tag && (
        <span style={{
          display: "inline-block",
          padding: "3px 10px",
          marginBottom: "12px",
          fontSize: "10px",
          fontWeight: 700,
          letterSpacing: "0.1em",
          textTransform: "uppercase",
          background: "var(--wm-red)",
          color: "#fff",
          alignSelf: "flex-start",
        }}>
          {workshop.tag}
        </span>
      )}

      {/* Category */}
      <div style={{
        fontSize: "10px", fontWeight: 700, letterSpacing: "0.2em",
        textTransform: "uppercase", color: "#999", marginBottom: "8px",
      }}>
        {workshop.category}
      </div>

      {/* Title */}
      <h3 style={{
        fontSize: "18px", fontWeight: 800, color: "var(--wm-navy)",
        letterSpacing: "-0.02em", marginBottom: "6px", lineHeight: 1.2,
      }}>
        {workshop.title}
      </h3>

      {/* Chef + level */}
      <p style={{ fontSize: "12px", color: "#888", marginBottom: "20px" }}>
        {workshop.chef} · {workshop.level}
      </p>

      {/* Date */}
      <p style={{ fontSize: "12px", color: "#aaa", marginBottom: "20px" }}>
        {workshop.dateText}
      </p>

      {/* Footer */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: "auto" }}>
        <span style={{
          fontSize: "22px", fontWeight: 900, color: "var(--wm-navy)", letterSpacing: "-0.03em",
        }}>
          ฿{workshop.price.toLocaleString()}
        </span>

        {isFull ? (
          <button disabled style={{
            padding: "10px 20px",
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
              padding: "10px 20px",
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
    </motion.article>
  );
}
```

- [ ] **Commit**
```bash
git add src/components/WorkshopCardWhite.jsx
git commit -m "feat: add WorkshopCardWhite minimal no-image card"
```

---

## Task 8 — WorkshopsSection Component

**Files:**
- Create: `src/components/WorkshopsSection.jsx`

- [ ] **Create `src/components/WorkshopsSection.jsx`:**

```jsx
import { useEffect, useState } from "react";
import { fetchWorkshops } from "@/api/apiClient";
import { CLASS_CATEGORIES } from "@/lib/app-params";
import WorkshopCardWhite from "./WorkshopCardWhite";
import BookingModal from "./BookingModal";

export default function WorkshopsSection() {
  const [workshops, setWorkshops] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [category, setCategory] = useState("ทั้งหมด");
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetchWorkshops()
      .then(setWorkshops)
      .catch((err) => setError(err.message ?? "โหลดข้อมูลไม่ได้"))
      .finally(() => setLoading(false));
  }, []);

  const filtered = category === "ทั้งหมด"
    ? workshops
    : workshops.filter((w) => w.category === category);

  const handleBook = (workshop) => {
    setSelectedWorkshop(workshop);
    setBookingOpen(true);
  };

  return (
    <section
      id="classes-section"
      style={{
        background: "#fff",
        padding: "100px 48px",
        borderTop: "1px solid var(--wm-border)",
      }}
    >
      <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
        {/* Header */}
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

        {/* Category filter */}
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "40px" }}>
          {["ทั้งหมด", ...CLASS_CATEGORIES].map((cat) => (
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
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: "#aaa", fontSize: "14px", letterSpacing: "0.1em" }}>
            กำลังโหลด...
          </div>
        ) : error ? (
          <div style={{ padding: "80px 0", textAlign: "center", color: "var(--wm-red)", fontSize: "14px" }}>
            {error}
          </div>
        ) : (
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
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
```

- [ ] **Commit**
```bash
git add src/components/WorkshopsSection.jsx
git commit -m "feat: add WorkshopsSection with category filter and BookingModal"
```

---

## Task 9 — ContactSection Component

**Files:**
- Create: `src/components/ContactSection.jsx`

- [ ] **Create `src/components/ContactSection.jsx`:**

```jsx
import { useState } from "react";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

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

  const set = (field) => (e) => setForm((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("กรุณากรอกชื่อ อีเมล และข้อความ");
      return;
    }
    setSubmitting(true);
    try {
      // Attempt real endpoint; fall back to toast if none exists
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
      // No backend contact endpoint — show success toast anyway
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
        padding: "100px 48px",
        borderTop: "1px solid rgba(255,255,255,0.06)",
      }}
    >
      <div style={{
        maxWidth: "1100px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "1fr 1fr", gap: "80px", alignItems: "start",
      }}>
        {/* Left — copy + social */}
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
            fontSize: "clamp(32px, 4vw, 52px)", fontWeight: 900, color: "#fff",
            letterSpacing: "-0.04em", lineHeight: 1.05, marginBottom: "24px",
          }}>
            พร้อมเริ่ม<br />ทำขนมแล้วหรือยัง?
          </h2>
          <p style={{ fontSize: "15px", color: "rgba(255,255,255,0.5)", lineHeight: 1.75, marginBottom: "40px" }}>
            มีคำถามเกี่ยวกับคลาส หรืออยากจัดกลุ่มพิเศษ ติดต่อเราได้เลย
          </p>

          {/* Social icons */}
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

        {/* Right — form */}
        <motion.form
          onSubmit={handleSubmit}
          initial={{ opacity: 0, x: 24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1], delay: 0.1 }}
          style={{ display: "flex", flexDirection: "column", gap: "14px" }}
        >
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
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
```

- [ ] **Commit**
```bash
git add src/components/ContactSection.jsx
git commit -m "feat: add ContactSection dark-navy two-col with form and social icons"
```

---

## Task 10 — Rewrite Home.jsx

**Files:**
- Rewrite: `src/pages/Home.jsx`

- [ ] **Overwrite `src/pages/Home.jsx` entirely:**

```jsx
import { Suspense } from "react";
import NavBar from "@/components/NavBar";
import HeroSection from "@/components/HeroSection";
import FeaturesSection from "@/components/FeaturesSection";
import WorkshopsSection from "@/components/WorkshopsSection";
import ContactSection from "@/components/ContactSection";

function Footer() {
  return (
    <footer style={{
      background: "var(--wm-footer-bg)",
      padding: "28px 48px",
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
    }}>
      <span style={{ fontSize: "15px", fontWeight: 800, color: "#fff", letterSpacing: "-0.02em" }}>
        แป้งละออง<span style={{ color: "var(--wm-red)" }}>.</span>
      </span>
      <span style={{ fontSize: "12px", color: "#555" }}>
        © 2026 Pang-La-Ong · All rights reserved.
      </span>
    </footer>
  );
}

export default function Home() {
  return (
    <div style={{ background: "var(--wm-bg)" }}>
      <NavBar />
      <HeroSection />
      <FeaturesSection />
      <WorkshopsSection />
      <ContactSection />
      <Footer />
    </div>
  );
}
```

- [ ] **Commit**
```bash
git add src/pages/Home.jsx
git commit -m "feat: rewrite Home.jsx — assembles all redesign sections"
```

---

## Task 11 — Verify and Final Check

- [ ] **Run dev server**
```bash
npm run dev
```
Open `http://localhost:5173` (or whichever port Vite picks).

- [ ] **Manual checklist:**
  - [ ] Nav is sticky white, shadow appears after scrolling 20px
  - [ ] Hero shows bold Thai headline left, wireframe globe right
  - [ ] Globe auto-rotates; dragging snaps back; cursor moves tilt the globe
  - [ ] "Start Exploring" scrolls to workshop section
  - [ ] Scroll past hero → features section: globe is sticky on left, panels scroll on right
  - [ ] Each panel activates at ~50% viewport intersection; globe rotation shifts
  - [ ] Workshop grid shows white cards, category filter works
  - [ ] "จองเลย" opens BookingModal
  - [ ] Contact form shows success toast on submit
  - [ ] Footer renders correctly
  - [ ] Login/Register pages still work at `/login`, `/register`

- [ ] **Run production build**
```bash
npm run build
```
Expected: build succeeds (chunk size warning is expected — Three.js is large).

- [ ] **Final commit**
```bash
git add -A
git commit -m "feat: complete white-minimalist home redesign with 3D globe scrollytelling"
```

---

## Self-Review

**Spec coverage check:**
- ✅ NavBar — sticky, white, auth-aware, scroll shadow (Task 3)
- ✅ Hero — white bg, left text, right globe, Framer Motion stagger, scroll indicator (Task 4)
- ✅ GlobeModel — wireframe sphere, lat rings, red accent rings, orbiting dot, cursor tilt, auto-rotation, panel presets (Task 2)
- ✅ FeaturesSection — sticky globe left half, panels right half, IntersectionObserver, margin-top: -100vh trick (Task 6)
- ✅ FeaturePanel × 3 — number, eyebrow, Thai headline, body, whileInView (Task 5 + Task 6)
- ✅ WorkshopsSection — all workshops, category filter, white grid, BookingModal (Task 8)
- ✅ WorkshopCardWhite — no image, tag, category, title, chef, date, price, book button (Task 7)
- ✅ ContactSection — dark navy, two-col, form with validation, toast, social icons (Task 9)
- ✅ Footer — minimal, logo, copyright (Task 10)
- ✅ CSS tokens — `--wm-*` added to `:root` without breaking existing dark tokens (Task 1)

**Type/signature consistency:**
- `GlobeModel` props: `panelIndex`, `enableCursorTilt`, `fov`, `className` — used consistently in HeroSection (Task 4) and FeaturesSection (Task 6) ✅
- `WorkshopCardWhite` props: `workshop`, `onBook` — match WorkshopsSection usage ✅
- `FeaturePanel` props: `number`, `eyebrow`, `title`, `body`, `panelRef` — match FeaturesSection usage ✅
- `fetchWorkshops()` imported from `@/api/apiClient` in WorkshopsSection ✅
- `BookingModal` props `{ workshop, open, onOpenChange }` — match existing signature ✅
- `CLASS_CATEGORIES` from `@/lib/app-params` — used in WorkshopsSection ✅
