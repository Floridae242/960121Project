/**
 * workshopService.js — Business Logic สำหรับข้อมูล Workshop
 *
 * ไฟล์นี้ดึงข้อมูล workshop จากฐานข้อมูล
 * โดย bookedSeats, seatsLeft และ isFull คำนวณแบบ live จาก booking จริง
 * ไม่ได้เก็บค่าเหล่านี้ไว้ใน column แยก — เพื่อป้องกันข้อมูลไม่ตรงกัน
 *
 * bug ที่แก้ไข: getAll() เคยเรียก attachSlots() ซึ่งเป็น async function
 * ทำให้ rows.map() ส่งคืน Promise[] แทนที่จะเป็นค่าจริง
 * แก้โดยเปลี่ยน attachSlots ให้เป็น synchronous สำหรับ list view
 */

const db = require("../config/db");

/**
 * BASE_QUERY — SQL base สำหรับดึงข้อมูล workshop พร้อม capacity ที่คำนวณ live
 * ใช้ LEFT JOIN กับ bookings เพื่อนับ seat ที่จองแล้ว (เฉพาะ confirmed เท่านั้น)
 */
const BASE_QUERY = `
  SELECT
    w.id,
    w.title,
    w.chef,
    w.level,
    w.price,
    w.max_capacity                                     AS totalSeats,
    w.category,
    w.emoji,
    w.image,
    w.description,
    COALESCE(SUM(b.seat_count), 0)                     AS bookedSeats,
    w.max_capacity - COALESCE(SUM(b.seat_count), 0)   AS seatsLeft,
    (w.max_capacity <= COALESCE(SUM(b.seat_count), 0)) AS isFull
  FROM workshops w
  LEFT JOIN bookings b
    ON b.workshop_id = w.id AND b.status = 'confirmed'
`;

/**
 * getAll — ดึง workshop ทั้งหมด เรียงตามยอดนิยม (bookedSeats สูงสุดก่อน)
 * ใช้ synchronous map เพื่อแนบ rank โดยไม่ต้องรอ Promise
 */
async function getAll() {
  const [rows] = await db.query(
    `${BASE_QUERY} GROUP BY w.id ORDER BY bookedSeats DESC`
  );

  // แปลง isFull จาก 0/1 ของ MySQL ให้เป็น boolean และแนบ rank ลำดับ
  // ใช้ synchronous map — ไม่ต้องการ async เพราะไม่มี I/O ในขั้นตอนนี้
  return rows.map((w, i) => ({
    ...w,
    isFull: Boolean(w.isFull),
    rank: `#${i + 1}`,
  }));
}

/**
 * getById — ดึงรายละเอียด workshop เดียว พร้อม time slots ที่ผู้ใช้สามารถเลือกได้
 * ส่งคืน null ถ้าไม่พบ workshop นั้น เพื่อให้ controller จัดการ 404
 */
async function getById(id) {
  const [rows] = await db.query(
    `${BASE_QUERY} WHERE w.id = ? GROUP BY w.id`,
    [id]
  );

  // ไม่พบ workshop — ส่ง null กลับแทนการ throw เพื่อให้ controller ตัดสินใจ
  if (rows.length === 0) return null;

  // ดึง time slots แยกต่างหาก — รวมอยู่ใน detail view เท่านั้น
  const [slots] = await db.query(
    "SELECT id, slot_text FROM workshop_slots WHERE workshop_id = ?",
    [id]
  );

  return { ...rows[0], isFull: Boolean(rows[0].isFull), slots };
}

module.exports = { getAll, getById };
