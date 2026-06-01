/**
 * authRoutes.js — Route สำหรับระบบ Authentication
 *
 * ไฟล์นี้กำหนด endpoint ที่เกี่ยวกับการสมัครสมาชิกและเข้าสู่ระบบ
 * route เหล่านี้เป็น public — ไม่ต้องการ JWT ในการเข้าถึง
 * เนื่องจากเป็นขั้นตอนที่ผู้ใช้ยังไม่มี token
 */

const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// POST /api/auth/register — สมัครสมาชิกใหม่ด้วย name, email, password
router.post("/register", authController.register);

// POST /api/auth/login — เข้าสู่ระบบด้วย email และ password
router.post("/login", authController.login);

module.exports = router;
