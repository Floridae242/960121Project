/**
 * apiClient.js — HTTP Client กลางสำหรับสื่อสารกับ Pang-La-Ong API
 *
 * ไฟล์นี้รวม logic การเรียก API ทั้งหมดไว้ในที่เดียว
 * จัดการ JWT token อัตโนมัติ (อ่านจาก localStorage และแนบใน header)
 * แปลง response จาก { success, data } envelope ให้เหลือแค่ data
 * และ throw Error ที่มี status code เมื่อ request ไม่สำเร็จ
 * Vite dev server จะ proxy /api → http://localhost:3000 ให้อัตโนมัติ
 */

const BASE_URL = "/api";

/**
 * getToken — อ่าน JWT token จาก localStorage อย่างปลอดภัย
 * ครอบด้วย try/catch เผื่อ localStorage ถูกปิดใน private mode
 */
function getToken() {
  try {
    return localStorage.getItem("panglaong-token");
  } catch {
    return null;
  }
}

/**
 * authHeaders — สร้าง Authorization header ถ้ามี token อยู่
 * ถ้าไม่มี token จะคืน object ว่างเพื่อไม่ให้มี header ที่ไม่จำเป็น
 */
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * request — ฟังก์ชัน fetch กลางที่ทุก API call ใช้
 * แนบ Content-Type และ Authorization header อัตโนมัติ
 * throw Error พร้อม status code ถ้า response ไม่ ok
 */
async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...authHeaders(),
      // options.headers ทับได้ เผื่อต้องการ override เฉพาะ request
      ...options.headers,
    },
    ...options,
  });

  const json = await res.json();

  // ถ้า HTTP status ไม่ใช่ 2xx ให้ throw error พร้อม message จาก server
  if (!res.ok) {
    const err = new Error(json.error || `Request failed (${res.status})`);
    err.status = res.status;
    throw err;
  }

  // คืนเฉพาะ data ส่วนใน — ไม่คืน envelope { success, data }
  return json.data;
}

// ── Authentication ────────────────────────────────────────────────────────────

/**
 * apiRegister — สมัครสมาชิกใหม่และบันทึก token ลง localStorage
 * ส่งคืน user object เพื่อให้ AuthContext อัปเดต state
 */
export async function apiRegister({ name, email, password }) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  // บันทึก token ทันทีหลังสมัครสำเร็จ — ผู้ใช้จะ login อัตโนมัติ
  localStorage.setItem("panglaong-token", data.token);
  return data.user;
}

/**
 * apiLogin — เข้าสู่ระบบและบันทึก token ลง localStorage
 * ส่งคืน user object เพื่อให้ AuthContext อัปเดต state
 */
export async function apiLogin({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  // เขียนทับ token เก่าถ้ามีอยู่แล้ว
  localStorage.setItem("panglaong-token", data.token);
  return data.user;
}

/**
 * apiLogout — ลบ token ออกจาก localStorage
 * ไม่ต้องเรียก API เพราะ JWT เป็น stateless
 */
export function apiLogout() {
  localStorage.removeItem("panglaong-token");
}

// ── Workshops ─────────────────────────────────────────────────────────────────

/**
 * fetchWorkshops — ดึง workshop ทั้งหมดพร้อมแนบ tag และ rank สำหรับ UI
 * tag "ยอดนิยม" แสดงเมื่อจองเกินครึ่ง, "คลาสเต็ม" เมื่อเต็มแล้ว
 */
export async function fetchWorkshops() {
  const workshops = await request("/workshops");
  return workshops.map((w, i) => ({
    ...w,
    isFull: Boolean(w.isFull),
    // กำหนด tag ตาม occupancy — ใช้แสดง badge บน card
    tag: w.isFull
      ? "คลาสเต็ม"
      : w.bookedSeats > w.totalSeats / 2
      ? "ยอดนิยม"
      : null,
    tagColor: w.isFull ? "neutral" : w.bookedSeats > w.totalSeats / 2 ? "green" : null,
    rank: `#${i + 1}`,
    // slots จะว่างสำหรับ list view — ดึงเพิ่มเมื่อเปิด detail
    slots: [],
  }));
}

/**
 * fetchWorkshopById — ดึงรายละเอียด workshop รายการเดียว พร้อม time slots
 */
export async function fetchWorkshopById(id) {
  return request(`/workshops/${id}`);
}

// ── Bookings ──────────────────────────────────────────────────────────────────

/**
 * createBooking — ส่งคำขอจองไปยัง API (ต้อง login ก่อน)
 * API จะตรวจสอบ capacity และคำนวณราคาที่ฝั่ง server
 */
export async function createBooking({ workshopId, slotId, seats }) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify({ workshopId, slotId, seats }),
  });
}

/**
 * fetchMyBookings — ดึงประวัติการจองของผู้ใช้ที่ login อยู่
 */
export async function fetchMyBookings() {
  return request("/bookings/me");
}
