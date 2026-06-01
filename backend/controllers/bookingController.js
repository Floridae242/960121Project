/**
 * bookingController.js — Controller สำหรับจัดการ Request ด้านการจอง
 *
 * ไฟล์นี้รับ HTTP request จาก bookingRoutes ที่ผ่าน requireAuth มาแล้ว
 * ตรวจสอบ input ที่จำเป็น แล้วส่งต่อให้ bookingService ดำเนินการ
 * ข้อมูล user ใน req.user ถูกตั้งค่าโดย requireAuth middleware
 */

const bookingService = require("../services/bookingService");

/**
 * create — สร้างการจองใหม่สำหรับผู้ใช้ที่ login อยู่
 * รับ workshopId, slotId และ seats (array) จาก request body
 * ราคารวมคำนวณที่ฝั่ง server เสมอ — ไม่รับจาก client
 */
async function create(req, res, next) {
  try {
    const { workshopId, slotId, seats } = req.body;

    // ตรวจสอบว่ามีข้อมูลครบและ seats เป็น array ที่ไม่ว่างเปล่า
    if (!workshopId || !slotId || !Array.isArray(seats) || seats.length === 0) {
      return res.status(400).json({
        success: false,
        error: "workshopId, slotId, and seats (array) are required",
      });
    }

    // req.user.id มาจาก JWT ที่ verify แล้ว — ไม่รับ userId จาก client
    const booking = await bookingService.create({
      userId: req.user.id,
      workshopId,
      slotId,
      seats,
    });

    // ส่ง 201 Created เมื่อสร้างการจองสำเร็จ
    res.status(201).json({ success: true, data: booking });
  } catch (err) {
    next(err);
  }
}

/**
 * getMyBookings — ดึงประวัติการจองทั้งหมดของผู้ใช้ที่ login อยู่
 * ใช้ req.user.id จาก JWT โดยไม่รับ userId จาก query string
 */
async function getMyBookings(req, res, next) {
  try {
    const bookings = await bookingService.getByUserId(req.user.id);
    res.json({ success: true, data: bookings });
  } catch (err) {
    next(err);
  }
}

module.exports = { create, getMyBookings };
