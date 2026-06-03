/**
 * app-params.js — ค่าคงที่ (constants) ส่วนกลางของแอป
 * รวมชื่อแอป, บัญชี demo สำหรับทดสอบ และรายการหมวดหมู่คลาส
 */

// ชื่อแอปสำหรับแสดงผล (ไทย / อังกฤษ)
export const APP_NAME = "แป้งละออง";
export const APP_SUBTITLE = "Pang-La-Ong";

// บัญชีตัวอย่างไว้กรอกอัตโนมัติ/ทดสอบการล็อกอินตอน demo
export const DEMO_USER = {
  email: "demo@panglaong.app",
  password: "123456",
  name: "Guest Baker",
};

// หมวดหมู่คลาส (ใช้เป็น fallback — ปกติ WorkshopsSection จะดึงหมวดหมู่จากข้อมูลจริง)
export const CLASS_CATEGORIES = ["ขนมปัง", "เค้ก", "ครัวซองต์", "ขนมไทย", "คลาสเด็ก"];
