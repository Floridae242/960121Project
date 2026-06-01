/**
 * vite.config.js — การตั้งค่า Vite สำหรับ Pang-La-Ong Frontend
 *
 * ไฟล์นี้กำหนดการตั้งค่า build tool สำหรับ React application
 * รวมถึง path alias (@) และ dev server proxy
 * proxy จำเป็นเพื่อให้ frontend ที่รันบน port 5173 สามารถเรียก
 * API ที่รันบน port 3000 ได้โดยไม่ติด CORS ใน development
 */

import path from "node:path";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [
    // เปิดใช้งาน React Fast Refresh และ JSX transform
    react(),
  ],

  resolve: {
    alias: {
      // @ ชี้ไปที่ src/ ทำให้ import สั้นลง เช่น @/api/apiClient
      "@": path.resolve(__dirname, "./src"),
    },
  },

  server: {
    proxy: {
      // ส่ง request ทุก path ที่ขึ้นต้นด้วย /api ไปให้ Express backend
      // ป้องกันปัญหา CORS ใน development โดยไม่ต้องแก้ไข backend
      "/api": {
        target: "http://localhost:3000",
        changeOrigin: true,
      },
    },
  },

  build: {
    // three.js chunk ใหญ่โดยตั้งใจ แต่โหลดแบบ async เท่านั้น จึงไม่เตือน
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        /**
         * แยกเฉพาะ vendor "หนักและใช้ร่วมกัน" เป็น chunk ตามกลุ่ม
         * ตั้งใจไม่ทำ catch-all "vendor" เพราะจะ override การ split อัตโนมัติของ Rollup
         * และดึง dep ที่ใช้เฉพาะ lazy route (Stripe, react-hook-form, zod) กลับมา eager
         * → ปล่อยให้ Rollup จัด dep ที่เหลือไปอยู่กับ chunk ของ route ที่ใช้มันเอง
         */
        manualChunks(id) {
          if (!id.includes("node_modules")) return undefined;
          // three.js + react-three — โหลดเฉพาะตอน hero 3D ถูก mount (async)
          if (id.includes("three") || id.includes("@react-three")) return "three";
          if (id.includes("framer-motion")) return "motion";
          if (id.includes("recharts") || id.includes("/d3-")) return "charts";
          if (id.includes("leaflet")) return "maps";
          if (id.includes("jspdf") || id.includes("html2canvas")) return "pdf";
          // react core (leaf chunk) — แชร์ทุก route จึง group ไว้เพื่อ cache
          if (
            id.includes("node_modules/react-dom/") ||
            id.includes("node_modules/react/") ||
            id.includes("node_modules/scheduler/")
          ) {
            return "react-vendor";
          }
          // ที่เหลือ: undefined → ให้ Rollup split ตามการใช้งานจริง (eager vs lazy)
          return undefined;
        },
      },
    },
  },
});
