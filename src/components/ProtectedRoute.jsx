/**
 * ProtectedRoute.jsx — ตัวห่อ route ที่ต้องล็อกอินก่อนเข้าถึง
 *
 * ใช้ครอบหน้าที่ต้องยืนยันตัวตน (เช่น /booking)
 * ถ้ายังไม่ล็อกอิน → แสดงหน้าแจ้งเตือนพร้อมลิงก์ไป /login
 * (แนบ ?next= เพื่อพากลับมาหน้าเดิมหลังล็อกอินสำเร็จ)
 * ถ้าล็อกอินแล้ว → แสดงเนื้อหา (children) ตามปกติ
 */
import { useLocation } from "react-router-dom";

import UserNotRegisteredError from "@/components/UserNotRegisteredError";
import { useAuth } from "@/lib/AuthContext";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const { isAuthenticated } = useAuth();

  // ยังไม่ล็อกอิน — บล็อกการเข้าถึงและพาไปหน้า login (จำ path ปัจจุบันไว้ใน next)
  if (!isAuthenticated) {
    return <UserNotRegisteredError redirectTo={`/login?next=${encodeURIComponent(location.pathname)}`} />;
  }

  // ล็อกอินแล้ว — อนุญาตให้เข้าถึงเนื้อหาที่ป้องกันไว้
  return children;
}
