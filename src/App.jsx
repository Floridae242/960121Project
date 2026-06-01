/**
 * App.jsx — Root Component และ Router หลักของแอปพลิเคชัน
 *
 * ไฟล์นี้กำหนดโครงสร้าง routing ทั้งหมดของแอป Pang-La-Ong
 * ครอบทุกอย่างด้วย AuthProvider เพื่อให้ทุก page เข้าถึง auth state ได้
 * และมี Toaster สำหรับแสดง notification ทั่วทั้งแอป
 */

import { BrowserRouter as Router, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "sonner";

// AuthProvider ต้องครอบ Router เพื่อให้ auth context ใช้งานได้ใน hook ที่เรียก navigate
import { AuthProvider } from "@/lib/AuthContext";
import PageNotFound from "./lib/PageNotFound";
import Booking from "./pages/Booking";
import ForgotPassword from "./pages/ForgotPassword";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ResetPassword from "./pages/ResetPassword";

/**
 * App — root component ที่ประกอบ provider, router และ page ทั้งหมดเข้าด้วยกัน
 * Toaster วางไว้นอก Routes เพื่อให้แสดง toast ได้จากทุก page
 */
function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* หน้าหลัก — แสดงรายการ workshop */}
          <Route path="/" element={<Home />} />

          {/* หน้าจองคลาส — ต้อง login ก่อน (จัดการใน component) */}
          <Route path="/booking" element={<Booking />} />

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
      </Router>

      {/* Toaster วางนอก Router — แสดงได้ทุก page โดยไม่ unmount เมื่อเปลี่ยน route */}
      <Toaster richColors position="top-right" />
    </AuthProvider>
  );
}

export default App;
