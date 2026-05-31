/**
 * FloatingCroissant.jsx — 3D Croissant Component สำหรับ HeroSection
 *
 * แสดงโมเดล 3D croissant ที่ลอยขึ้นลงอัตโนมัติและหมุนได้ด้วยเมาส์
 * โหลดโมเดลจาก /public/croissant.glb ด้วย useGLTF
 * ใช้ PresentationControls เพื่อให้ผู้ใช้หมุนโมเดลได้โดยไม่ล็อคกล้อง
 */

import { useRef, Suspense } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { useGLTF, PresentationControls, Stage } from "@react-three/drei";

/**
 * CroissantModel — โหลดและแสดง GLB model พร้อม floating animation
 * ใช้ useFrame เพื่อ animate Y position ด้วย Math.sin ทุก frame
 */
function CroissantModel() {
  const { scene } = useGLTF("/croissant.glb");
  const ref = useRef();

  // floating animation — ขยับขึ้นลงเบา ๆ ทุก frame
  useFrame(({ clock }) => {
    if (!ref.current) return;
    ref.current.position.y = Math.sin(clock.elapsedTime * 0.8) * 0.15;
    ref.current.rotation.y += 0.003; // หมุนช้า ๆ รอบแกน Y
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      scale={2.2}
      position={[0, 0, 0]}
    />
  );
}

/**
 * FloatingCroissant — Canvas หลักที่ครอบ 3D scene ทั้งหมด
 * PresentationControls ให้ผู้ใช้ลาก/หมุนโมเดลได้และดีดกลับเอง
 * Stage จัดแสงและ shadow ให้อัตโนมัติ
 */
export default function FloatingCroissant({ className = "" }) {
  return (
    <div className={`w-full h-full ${className}`}>
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: "transparent" }}
      >
        {/* แสงพื้นฐาน — ทำให้โมเดลไม่มืดเกินไป */}
        <ambientLight intensity={0.6} />

        {/* แสงหลัก — สร้าง highlight และ shadow ให้ดูสมจริง */}
        <directionalLight
          position={[5, 8, 5]}
          intensity={1.2}
          castShadow
        />

        {/* แสงเสริมด้านหลัง — ลด shadow ที่หนักเกินไป */}
        <directionalLight position={[-3, 2, -3]} intensity={0.4} />

        {/* PresentationControls — ผู้ใช้ลากหมุนได้ ดีดกลับตำแหน่งเดิมเอง */}
        <PresentationControls
          global
          rotation={[0.1, 0.2, 0]}
          polar={[-Math.PI / 4, Math.PI / 4]}
          azimuth={[-Math.PI / 4, Math.PI / 4]}
          config={{ mass: 2, tension: 400 }}
          snap={{ mass: 4, tension: 300 }}
        >
          {/* Suspense รอโหลด GLB ก่อนแสดง — ป้องกัน error ขณะโหลด */}
          <Suspense fallback={null}>
            <CroissantModel />
          </Suspense>
        </PresentationControls>
      </Canvas>
    </div>
  );
}

// preload GLB ทันทีที่ไฟล์นี้ถูก import — ลดเวลารอตอนเปิดหน้า
useGLTF.preload("/croissant.glb");
