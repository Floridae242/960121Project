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
});
