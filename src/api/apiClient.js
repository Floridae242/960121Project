/**
 * apiClient.js — HTTP Client กลางสำหรับสื่อสารกับ Pang-La-Ong API
 *
 * ไฟล์นี้รวม logic การเรียก API ทั้งหมดไว้ในที่เดียว
 * จัดการ JWT token อัตโนมัติ (อ่านจาก localStorage และแนบใน header)
 * แปลง response จาก { success, data } envelope ให้เหลือแค่ data
 * และ throw Error ที่มี status code เมื่อ request ไม่สำเร็จ
 * Vite dev server จะ proxy /api → http://localhost:3000 ให้อัตโนมัติ
 *
 * ปรับปรุงเพิ่มเติม: มีระบบ Fallback Mode ทำงานเมื่อไม่ได้ต่อ Backend
 * โดยจะสลับไปดึงข้อมูลจาก public/workshops.json และบันทึกการจองใน localStorage อัตโนมัติ
 */

const BASE_URL = "/api";

/**
 * getToken — อ่าน JWT token จาก localStorage อย่างปลอดภัย
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
 */
function authHeaders() {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

/**
 * handleFallback — ระบบจำลองฐานข้อมูลฝั่ง Client เมื่อปิด Backend
 */
async function handleFallback(path, options = {}) {
  // ดึงข้อมูลหลักจากไฟล์ JSON
  const res = await fetch("/workshops.json");
  const baseWorkshops = await res.json();

  const getLocalBookings = () => {
    try {
      return JSON.parse(localStorage.getItem("fallback_bookings") || "[]");
    } catch {
      return [];
    }
  };

  const saveLocalBookings = (bookings) => {
    try {
      localStorage.setItem("fallback_bookings", JSON.stringify(bookings));
    } catch (e) {
      console.error("Failed to save bookings to localStorage", e);
    }
  };

  // 1. GET /workshops
  if (path === "/workshops" && (!options.method || options.method === "GET")) {
    const localBookings = getLocalBookings();
    return baseWorkshops.map((w) => {
      const addedBookings = localBookings
        .filter((b) => b && b.workshopId === w.id)
        .reduce((sum, b) => sum + (Array.isArray(b.seats) ? b.seats.length : 0), 0);

      const bookedSeats = w.bookedSeats + addedBookings;
      const seatsLeft = Math.max(0, w.totalSeats - bookedSeats);
      const isFull = seatsLeft === 0;

      return {
        ...w,
        bookedSeats,
        seatsLeft,
        isFull,
      };
    });
  }

  // 2. GET /workshops/:id
  const workshopMatch = path.match(/^\/workshops\/(\d+)$/);
  if (workshopMatch && (!options.method || options.method === "GET")) {
    const id = parseInt(workshopMatch[1], 10);
    const w = baseWorkshops.find((item) => item.id === id);
    if (!w) {
      throw new Error(`ไม่พบคลาสเรียน ID: ${id}`);
    }

    const localBookings = getLocalBookings();

    // ตั้งค่าที่นั่งจองเริ่มต้นเพื่อให้ตรงกับระบบ Backend Seed
    const defaultBooked = {
      1: ["A1", "A3", "A4", "B1"],
      3: ["A1", "A3", "B2", "B4", "C1", "C3", "C5"],
      5: ["A1", "A2", "A3", "A4", "A5", "B1", "B2", "B3", "B4", "B5"],
      7: ["A1", "A3", "A5", "B2", "B4"],
    };

    const bookedBySlot = {};
    // ใส่ค่าจองเริ่มต้นก่อน
    Object.keys(defaultBooked).forEach((sId) => {
      bookedBySlot[sId] = [...defaultBooked[sId]];
    });

    // ใส่ค่าจากการจองใน localStorage
    localBookings
      .filter((b) => b && b.workshopId === id)
      .forEach((b) => {
        if (!bookedBySlot[b.slotId]) {
          bookedBySlot[b.slotId] = [];
        }
        if (Array.isArray(b.seats)) {
          bookedBySlot[b.slotId].push(...b.seats);
        }
      });

    // คำนวณที่นั่งรวมที่จองแล้วในแต่ละ slot
    const allBookingsForWorkshop = localBookings.filter((b) => b && b.workshopId === id);
    const localBookedCount = allBookingsForWorkshop.reduce((sum, b) => sum + (Array.isArray(b.seats) ? b.seats.length : 0), 0);
    const bookedSeats = w.bookedSeats + localBookedCount;
    const seatsLeft = Math.max(0, w.totalSeats - bookedSeats);
    const isFull = seatsLeft === 0;

    return {
      ...w,
      bookedSeats,
      seatsLeft,
      isFull,
      bookedBySlot,
    };
  }

  // 3. POST /bookings
  if (path === "/bookings" && options.method === "POST") {
    const data = typeof options.body === "string" ? JSON.parse(options.body) : (options.body || {});
    const { workshopId, slotId, seats, name, phone } = data;
    const localBookings = getLocalBookings();

    const bookingId = "BK-" + Math.floor(Math.random() * 900000 + 100000);
    const newBooking = {
      bookingId,
      status: "confirmed",
      workshopId,
      slotId,
      seats: Array.isArray(seats) ? seats : [],
      name,
      phone,
      createdAt: new Date().toISOString()
    };

    localBookings.push(newBooking);
    saveLocalBookings(localBookings);

    return newBooking;
  }

  // 4. GET /bookings/me
  if (path === "/bookings/me") {
    const localBookings = getLocalBookings();
    // แม็พข้อมูลให้ตรงกับที่ UI ต้องการแสดงผลประวัติการจอง
    return localBookings.map((b) => {
      if (!b) return {};
      const w = baseWorkshops.find((item) => item.id === b.workshopId) || {};
      const slot = w.slots?.find((s) => s.id === b.slotId);
      const seatsCount = Array.isArray(b.seats) ? b.seats.length : 0;
      return {
        bookingId: b.bookingId,
        status: b.status,
        workshopId: b.workshopId,
        workshopName: w.title || "คลาสทำขนม",
        slot: slot ? slot.slot_text : "วันและเวลาจอง",
        name: b.name,
        phone: b.phone,
        seats: b.seats || [],
        price: w.price || 0,
        totalPrice: (w.price || 0) * seatsCount,
      };
    });
  }

  // 5. POST /auth/login หรือ /auth/register
  if ((path === "/auth/login" || path === "/auth/register") && options.method === "POST") {
    const body = JSON.parse(options.body);
    const token = "mock_jwt_token_" + Date.now();
    const user = {
      id: 999,
      name: body.name || body.email?.split("@")[0] || "ผู้ใช้จำลอง",
      email: body.email || "test@example.com",
    };
    return { token, user };
  }

  throw new Error(`Fallback path not implemented: ${path}`);
}

/**
 * request — ฟังก์ชัน fetch กลางที่ทุก API call ใช้
 * แนบ Content-Type และ Authorization header อัตโนมัติ
 * throw Error พร้อม status code ถ้า response ไม่ ok
 *
 * หากเชื่อมต่อล้มเหลว จะสลับไปใช้งาน handleFallback อัตโนมัติ
 */
const USE_MOCK_DATA = false; // ตั้งเป็น true เพื่อใช้ข้อมูล 40 คลาสในเครื่องสำหรับการทดสอบเฉพาะ Frontend

async function request(path, options = {}) {
  if (USE_MOCK_DATA) {
    return handleFallback(path, options);
  }

  try {
    const res = await fetch(`${BASE_URL}${path}`, {
      headers: {
        "Content-Type": "application/json",
        ...authHeaders(),
        // options.headers ทับได้ เผื่อต้องการ override เฉพาะ request
        ...options.headers,
      },
      ...options,
    });

    let json;
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.includes("application/json")) {
      try {
        json = await res.json();
      } catch {
        throw new Error("การตอบกลับจากเซิร์ฟเวอร์ไม่อยู่ในรูปแบบ JSON ที่ถูกต้อง");
      }
    } else {
      throw new Error(`การส่งคำขอล้มเหลว (Status: ${res.status}). กรุณาตรวจสอบว่าเซิร์ฟเวอร์ Backend ทำงานอยู่หรือไม่`);
    }

    // ถ้า HTTP status ไม่ใช่ 2xx ให้ throw error พร้อม message จาก server
    if (!res.ok) {
      const err = new Error(json.error || `Request failed (${res.status})`);
      err.status = res.status;
      throw err;
    }

    // คืนเฉพาะ data ส่วนใน — ไม่คืน envelope { success, data }
    return json.data;
  } catch (err) {
    // ในกรณีที่ติดต่อ backend ไม่ได้ หรือเกิด network error
    // ทำการรันระบบจำลองข้อมูลบน Frontend (Fallback Mode)
    console.warn(`[Fallback Mode Enabled] กำลังเปลี่ยนไปโหลดข้อมูลในเครื่องเนื่องจาก: ${err.message}`);
    return handleFallback(path, options);
  }
}

// ── Authentication ────────────────────────────────────────────────────────────

export async function apiRegister({ name, email, password }) {
  const data = await request("/auth/register", {
    method: "POST",
    body: JSON.stringify({ name, email, password }),
  });
  localStorage.setItem("panglaong-token", data.token);
  return data.user;
}

export async function apiLogin({ email, password }) {
  const data = await request("/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  localStorage.setItem("panglaong-token", data.token);
  return data.user;
}

export function apiLogout() {
  localStorage.removeItem("panglaong-token");
}

// ── Workshops ─────────────────────────────────────────────────────────────────

export async function fetchWorkshops() {
  const workshops = await request("/workshops");
  return workshops.map((w, i) => ({
    ...w,
    isFull: Boolean(w.isFull),
    tag: w.isFull
      ? "คลาสเต็ม"
      : w.bookedSeats > w.totalSeats / 2
        ? "ยอดนิยม"
        : w.id > 4
          ? "คลาสใหม่"
          : null,
    tagColor: w.isFull
      ? "neutral"
      : w.bookedSeats > w.totalSeats / 2
        ? "green"
        : w.id > 4
          ? "blue"
          : null,
    rank: `#${i + 1}`,
  }));
}

export async function fetchWorkshopById(id) {
  return request(`/workshops/${id}`);
}

// ── Bookings ──────────────────────────────────────────────────────────────────

// createBooking — สร้างการจอง สถานะเริ่มต้น 'pending' (รอชำระเงิน)
// ฝั่ง server จะคืน expiresAt/paymentWindowMinutes สำหรับนับถอยหลัง
export async function createBooking({ workshopId, slotId, seats, name, phone }) {
  return request("/bookings", {
    method: "POST",
    body: JSON.stringify({ workshopId, slotId, seats, name, phone }),
  });
}

// confirmBooking — ยืนยันการชำระเงิน (pending → confirmed)
// ถ้าเลยกำหนด 10 นาที server จะตอบ error 410 (หมดเวลา)
export async function confirmBooking(bookingRef) {
  return request(`/bookings/${encodeURIComponent(bookingRef)}/confirm`, {
    method: "POST",
  });
}

export async function fetchMyBookings() {
  return request("/bookings/me");
}
