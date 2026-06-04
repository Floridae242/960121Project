/**
 * bookingService.js — Business Logic สำหรับระบบการจอง
 *
 * ไฟล์นี้จัดการการสร้างการจองและดึงประวัติการจอง
 * การสร้างการจองใช้ database transaction เพื่อป้องกัน race condition
 * เมื่อมีผู้ใช้หลายคนพยายามจองที่นั่งสุดท้ายพร้อมกัน
 * ราคารวมคำนวณที่ server เสมอ — ไม่รับจาก client
 */

const db = require("../config/db");

// ระยะเวลาที่ให้ลูกค้าชำระเงินก่อนการจองจะหมดอายุและถูกยกเลิกอัตโนมัติ (นาที)
const PAYMENT_WINDOW_MINUTES = 10;

/**
 * create — สร้างการจองใหม่ภายใน database transaction (สถานะเริ่มต้น = 'pending')
 * ใช้ SELECT ... FOR UPDATE เพื่อล็อค workshop row ป้องกัน overbooking
 * ที่นั่งถูกจับจองไว้ชั่วคราว — ถ้าไม่ชำระเงินภายใน 10 นาทีจะถูกยกเลิกและคืนที่นั่ง
 * rollback ทันทีถ้าเกิด error ใด ๆ ในระหว่าง transaction
 */
async function create({ userId, workshopId, slotId, seats }) {
  const seatCount = seats.length;

  // ขอ connection จาก pool เพื่อใช้ใน transaction
  const connection = await db.getConnection();

  try {
    await connection.beginTransaction();

    // ขั้นที่ 1: ล็อค workshop row สำหรับ transaction นี้ ป้องกันการอ่านพร้อมกัน
    const [workshops] = await connection.query(
      "SELECT id, price, max_capacity FROM workshops WHERE id = ? FOR UPDATE",
      [workshopId]
    );

    // ตรวจสอบว่า workshop มีอยู่จริงก่อนดำเนินการต่อ
    if (workshops.length === 0) {
      const err = new Error("Workshop not found");
      err.status = 404;
      throw err;
    }
    const workshop = workshops[0];

    // ขั้นที่ 2: นับที่นั่งที่ถูกจับจองใน slot นี้
    //   = ที่ confirmed แล้ว + ที่ pending ที่ยัง "ไม่หมดเวลา" (ยังอยู่ในช่วง 10 นาที)
    //   pending ที่หมดเวลาแล้วจะไม่ถูกนับ → ที่นั่งถูกปล่อยคืนทันที
    const [capacityRows] = await connection.query(
      `SELECT COALESCE(SUM(seat_count), 0) AS booked
       FROM bookings
       WHERE workshop_id = ? AND slot_id = ?
         AND (status = 'confirmed'
              OR (status = 'pending' AND created_at > NOW() - INTERVAL ? MINUTE))`,
      [workshopId, slotId, PAYMENT_WINDOW_MINUTES]
    );
    const currentlyBooked = Number(capacityRows[0].booked);

    // ขั้นที่ 3: ตรวจสอบ capacity — ป้องกัน overbooking
    if (currentlyBooked + seatCount > workshop.max_capacity) {
      const err = new Error(
        `ที่นั่งไม่เพียงพอ — มีที่ว่าง ${workshop.max_capacity - currentlyBooked} ที่นั่ง`
      );
      err.status = 409; // Conflict — ทรัพยากรไม่พร้อมให้จอง
      throw err;
    }

    // ขั้นที่ 4: คำนวณราคารวมที่ server — ไม่เชื่อถือตัวเลขจาก client
    const totalPrice = workshop.price * seatCount;

    // ขั้นที่ 5: สร้าง booking reference ที่ unique โดยใช้ timestamp + userId
    const bookingRef = `BK-${Date.now()}-${userId}`;

    // ขั้นที่ 6: บันทึกการจองเป็นสถานะ 'pending' (รอชำระเงิน) — ทุก value ใช้ parameterized query
    await connection.query(
      `INSERT INTO bookings
         (booking_ref, user_id, workshop_id, slot_id, seats_json, seat_count, total_price, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [bookingRef, userId, workshopId, slotId, JSON.stringify(seats), seatCount, totalPrice]
    );

    // commit เมื่อผ่านทุกขั้นตอนสำเร็จ
    await connection.commit();

    return {
      bookingId: bookingRef,
      status: "pending",
      workshopId,
      slotId,
      seats,
      seatCount,
      totalPrice,
      // ข้อมูลสำหรับนับถอยหลังฝั่ง client
      paymentWindowMinutes: PAYMENT_WINDOW_MINUTES,
      expiresAt: new Date(Date.now() + PAYMENT_WINDOW_MINUTES * 60_000).toISOString(),
    };
  } catch (err) {
    // rollback ทันทีถ้าเกิด error ใด ๆ — ป้องกันข้อมูลครึ่งทาง
    await connection.rollback();
    throw err;
  } finally {
    // คืน connection กลับ pool เสมอ ไม่ว่าจะสำเร็จหรือไม่
    connection.release();
  }
}

/**
 * getByUserId — ดึงประวัติการจองทั้งหมดของผู้ใช้ เรียงจากล่าสุดก่อน
 * JOIN กับ workshops และ workshop_slots เพื่อได้ข้อมูลที่แสดงผลได้ทันที
 */
async function getByUserId(userId) {
  const [rows] = await db.query(
    `SELECT
       b.booking_ref  AS bookingId,
       b.status,
       b.seats_json   AS seats,
       b.seat_count   AS seatCount,
       b.total_price  AS totalPrice,
       b.created_at   AS bookedAt,
       w.title        AS workshopTitle,
       w.emoji,
       ws.slot_text   AS slot
     FROM bookings b
     JOIN workshops w       ON w.id = b.workshop_id
     JOIN workshop_slots ws ON ws.id = b.slot_id
     WHERE b.user_id = ?
     ORDER BY b.created_at DESC`,
    [userId]
  );

  // แปลง seats_json จาก string กลับเป็น array ก่อนส่งออก
  return rows.map((r) => ({ ...r, seats: JSON.parse(r.seats) }));
}

/**
 * confirm — ยืนยันการชำระเงิน (pending → confirmed)
 * เรียกเมื่อลูกค้าชำระเงินสำเร็จภายในเวลาที่กำหนด
 * - ถ้าหมดเวลาแล้ว (เกิน 10 นาที) จะยกเลิกการจองและแจ้ง error 410
 * - ตรวจ user_id เพื่อให้ยืนยันได้เฉพาะการจองของตัวเอง
 */
async function confirm({ bookingRef, userId }) {
  // ดึงสถานะการจอง พร้อมตรวจว่าหมดเวลาหรือยัง (คำนวณจาก created_at)
  const [rows] = await db.query(
    `SELECT id, status,
            (created_at <= NOW() - INTERVAL ? MINUTE) AS expired
     FROM bookings
     WHERE booking_ref = ? AND user_id = ?`,
    [PAYMENT_WINDOW_MINUTES, bookingRef, userId]
  );

  if (rows.length === 0) {
    const err = new Error("ไม่พบการจองนี้");
    err.status = 404;
    throw err;
  }

  const booking = rows[0];

  // ชำระเงินไปแล้ว — คืนผลเดิม (idempotent)
  if (booking.status === "confirmed") {
    return { bookingId: bookingRef, status: "confirmed" };
  }

  // ถูกยกเลิกไปแล้ว
  if (booking.status === "cancelled") {
    const err = new Error("การจองนี้ถูกยกเลิกไปแล้ว");
    err.status = 410; // Gone
    throw err;
  }

  // pending แต่หมดเวลา → ยกเลิกแล้วแจ้งว่าเลยกำหนด
  if (booking.expired) {
    await db.query(
      "UPDATE bookings SET status = 'cancelled' WHERE id = ? AND status = 'pending'",
      [booking.id]
    );
    const err = new Error("หมดเวลาชำระเงิน การจองถูกยกเลิกและคืนที่นั่งแล้ว");
    err.status = 410; // Gone
    throw err;
  }

  // pending และยังไม่หมดเวลา → ยืนยันการชำระเงิน
  await db.query(
    "UPDATE bookings SET status = 'confirmed' WHERE id = ? AND status = 'pending'",
    [booking.id]
  );
  return { bookingId: bookingRef, status: "confirmed" };
}

/**
 * expireOverdue — ยกเลิกการจองที่ค้างชำระเกินเวลาทั้งหมด (ใช้โดย background sweeper)
 * คืนค่า: จำนวนรายการที่ถูกยกเลิก
 */
async function expireOverdue() {
  const [result] = await db.query(
    `UPDATE bookings
     SET status = 'cancelled'
     WHERE status = 'pending' AND created_at <= NOW() - INTERVAL ? MINUTE`,
    [PAYMENT_WINDOW_MINUTES]
  );
  return result.affectedRows || 0;
}

module.exports = { create, getByUserId, confirm, expireOverdue, PAYMENT_WINDOW_MINUTES };
