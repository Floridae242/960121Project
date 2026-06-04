/**
 * bookingRoutes.js — Route สำหรับระบบการจอง
 *
 * ไฟล์นี้กำหนด endpoint สำหรับสร้างการจองและดูประวัติการจองของผู้ใช้
 * ทุก route ในไฟล์นี้ต้องผ่าน requireAuth middleware ก่อนเสมอ
 * เพราะการจองต้องรู้ว่าเป็นผู้ใช้คนไหน — ไม่อนุญาต anonymous booking
 */

const express = require("express");
const router = express.Router();
const bookingController = require("../controllers/bookingController");
const { requireAuth } = require("../middleware/auth");

// POST /api/bookings — สร้างการจองใหม่ สถานะ 'pending' รอชำระเงิน (ต้อง login ก่อน)
router.post("/", requireAuth, bookingController.create);

// POST /api/bookings/:ref/confirm — ยืนยันการชำระเงิน (pending → confirmed)
router.post("/:ref/confirm", requireAuth, bookingController.confirm);

// GET /api/bookings/me — ดูประวัติการจองของตัวเอง (ต้อง login ก่อน)
router.get("/me", requireAuth, bookingController.getMyBookings);

module.exports = router;
