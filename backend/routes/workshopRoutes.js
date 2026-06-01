/**
 * workshopRoutes.js — Route สำหรับข้อมูล Workshop
 *
 * ไฟล์นี้กำหนด endpoint สำหรับดึงข้อมูล workshop ทั้งหมดและรายละเอียดแต่ละ workshop
 * route เหล่านี้เป็น public — ผู้ที่ยังไม่ login ก็สามารถดูได้
 * เพื่อให้ผู้ใช้ตัดสินใจก่อนสมัครสมาชิก
 */

const express = require("express");
const router = express.Router();
const workshopController = require("../controllers/workshopController");

// GET /api/workshops — ดึง workshop ทั้งหมด เรียงตามยอดนิยม
router.get("/", workshopController.getAll);

// GET /api/workshops/:id — ดึงรายละเอียด workshop พร้อม time slots
router.get("/:id", workshopController.getById);

module.exports = router;
