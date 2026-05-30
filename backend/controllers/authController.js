/**
 * authController.js — Controller สำหรับจัดการ Request ด้าน Authentication
 *
 * ไฟล์นี้ทำหน้าที่รับ HTTP request จาก authRoutes
 * ตรวจสอบความถูกต้องของข้อมูลเบื้องต้น (field validation)
 * แล้วส่งต่อไปให้ authService ดำเนินการจริง
 * ไม่มี business logic อยู่ในชั้นนี้ — controller ทำหน้าที่แค่ "รับ ตรวจ ส่ง"
 */

const authService = require("../services/authService");

/**
 * register — สร้างบัญชีผู้ใช้ใหม่
 * รับ name, email, password จาก request body
 * ส่งกลับ JWT token และข้อมูล user เมื่อสำเร็จ
 */
async function register(req, res, next) {
  try {
    const { name, email, password } = req.body;

    // ตรวจสอบว่ามีข้อมูลครบทุก field ก่อนส่งไป service
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: "name, email, and password are required" });
    }

    const result = await authService.register({ name, email, password });

    // ส่ง 201 Created เมื่อสร้าง resource ใหม่สำเร็จ
    res.status(201).json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

/**
 * login — ยืนยันตัวตนและออก JWT token
 * รับ email, password จาก request body
 * ส่งกลับ JWT token และข้อมูล user เมื่อผ่านการยืนยันตัวตน
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    // ตรวจสอบว่ามีข้อมูลครบทั้ง email และ password
    if (!email || !password) {
      return res.status(400).json({ success: false, error: "email and password are required" });
    }

    const result = await authService.login({ email, password });
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

module.exports = { register, login };
