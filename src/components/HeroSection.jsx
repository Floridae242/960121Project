/**
 * HeroSection.jsx — Hero Banner หลักของหน้าแรก
 *
 * แสดงพื้นหลัง gradient สีอำพัน พร้อม 3D croissant ที่ลอยขึ้นลง
 * แบ่งเป็น 2 คอลัมน์: ซ้าย = ข้อความ, ขวา = โมเดล 3D
 * บน mobile จะซ้อนกันแนวตั้ง
 */

import { Suspense } from "react";
import FloatingCroissant from "./FloatingCroissant";

/**
 * HeroSection — banner หลักพร้อม 3D interactive croissant
 */
export default function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden rounded-[2rem] shadow-sm">

      {/* พื้นหลัง gradient สีอำพันแทน static image */}
      <div className="absolute inset-0 bg-gradient-to-br from-amber-900 via-amber-800 to-amber-950" />

      {/* grain texture overlay — ให้ความรู้สึก artisan */}
      <div className="absolute inset-0 opacity-20"
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E\")" }}
      />

      {/* Bottom gradient fade เพื่อ blend กับ amber-50 ด้านล่าง */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-amber-50 via-amber-50/30 to-transparent z-10" />

      {/* Layout หลัก — 2 คอลัมน์บน desktop, แนวตั้งบน mobile */}
      <div className="relative z-10 flex flex-col items-center md:flex-row md:items-center md:justify-between px-8 md:px-14 py-12 md:py-6 gap-6">

        {/* คอลัมน์ซ้าย — ข้อความ */}
        <div className="flex flex-col items-center text-center md:items-start md:text-left md:w-1/2 gap-4">
          <p className="text-xs font-bold uppercase tracking-[0.25em] text-amber-200/90 md:text-sm">
            Artisan Bakery Workshops
          </p>

          <h1 className="text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
            ศิลปะแห่ง<br className="hidden md:block" />การนวดแป้ง
          </h1>

          <p className="max-w-sm text-xs font-medium leading-relaxed text-amber-100/80 sm:text-sm">
            เรียนรู้ศิลปะการทำขนมอบจากเชฟมืออาชีพ<br />
            ในบรรยากาศอบอุ่นสไตล์อาร์ทิซาน
          </p>
        </div>

        {/* คอลัมน์ขวา — 3D Croissant */}
        <div className="w-full h-[240px] md:w-1/2 md:h-[380px]">
          {/*
            Suspense จำเป็น — FloatingCroissant โหลด GLB แบบ async
            fallback แสดง placeholder ขณะโหลดโมเดล
          */}
          <Suspense fallback={
            <div className="flex h-full items-center justify-center">
              <span className="text-6xl animate-bounce">🥐</span>
            </div>
          }>
            <FloatingCroissant />
          </Suspense>
        </div>

      </div>
    </section>
  );
}
