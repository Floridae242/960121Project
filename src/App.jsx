/**
 * App.jsx — Root Component และ Router หลักของแอปพลิเคชัน
 *
 * ไฟล์นี้กำหนดโครงสร้าง routing ทั้งหมดของแอป Pang-La-Ong
 * ครอบทุกอย่างด้วย AuthProvider เพื่อให้ทุก page เข้าถึง auth state ได้
 * และมี Toaster สำหรับแสดง notification ทั่วทั้งแอป
 */

import { lazy, Suspense } from "react";
import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

// AuthProvider ต้องครอบ Router เพื่อให้ auth context ใช้งานได้ใน hook ที่เรียก navigate
import { AuthProvider } from "@/lib/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import PageNotFound from "./lib/PageNotFound";

// Home เป็น landing route (entry ที่พบบ่อยสุด) — โหลดทันทีไม่ให้มี loading flash
import Home from "./pages/Home";

// หน้า auth/booking แยกเป็น chunk แยก โหลดเฉพาะตอนเข้าถึง route นั้น
// ดึง Stripe, react-hook-form, zod ฯลฯ ออกจาก landing bundle
const Booking = lazy(() => import("./pages/Booking"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const ForgotPassword = lazy(() => import("./pages/ForgotPassword"));
const ResetPassword = lazy(() => import("./pages/ResetPassword"));

// fallback ระหว่างโหลด chunk ของ page
function RouteFallback() {
  return (
    <div style={{
      minHeight: "100vh", display: "flex", alignItems: "center", justifyContent: "center",
      background: "var(--wm-bg)", color: "var(--wm-muted)",
      fontSize: "13px", letterSpacing: "0.2em", textTransform: "uppercase",
    }}>
      กำลังโหลด...
    </div>
  );
}

/**
 * App — root component ที่ประกอบ provider, router และ page ทั้งหมดเข้าด้วยกัน
 * Toaster วางไว้นอก Routes เพื่อให้แสดง toast ได้จากทุก page
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<RouteFallback />}>
          <Routes>
            {/* หน้าหลัก — แสดงรายการ workshop */}
            <Route path="/" element={<Home />} />

            {/* หน้าจองคลาส — ต้อง login ก่อน */}
            <Route path="/booking" element={<ProtectedRoute><Booking /></ProtectedRoute>} />

            {/* หน้า auth — เปิดให้ทุกคนเข้าถึงได้ */}
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />

            {/* redirect /home → / เพื่อรองรับ link เก่า */}
            <Route path="/home" element={<Navigate to="/" replace />} />

            {/* จับทุก path ที่ไม่ตรงกับ route ด้านบน */}
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </Router>

      {/* Toaster วางนอก Router — แสดงได้ทุก page โดยไม่ unmount เมื่อเปลี่ยน route */}
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;
