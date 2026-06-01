/**
 * auth.js — Middleware สำหรับตรวจสอบ JWT Token
 *
 * ไฟล์นี้ทำหน้าที่ป้องกัน route ที่ต้องการการยืนยันตัวตน
 * โดยตรวจสอบ Authorization header และ verify JWT token
 * หากผ่านการตรวจสอบ จะแนบข้อมูล user ไว้ใน req.user
 * เพื่อให้ controller ถัดไปสามารถใช้งานได้โดยตรง
 */

const jwt = require("jsonwebtoken");

/**
 * requireAuth — middleware ที่บังคับให้ request มี JWT ที่ถูกต้อง
 * ใช้กับ route ที่ต้องการ login ก่อนจึงจะเข้าถึงได้
 */
function requireAuth(req, res, next) {
  const header = req.headers.authorization;

  // ตรวจสอบว่ามี Authorization header และขึ้นต้นด้วย "Bearer "
  if (!header || !header.startsWith("Bearer ")) {
    return res.status(401).json({ success: false, error: "Authentication required" });
  }

  // ตัด "Bearer " ออกเพื่อเอา token จริง ๆ
  const token = header.slice(7);

  try {
    // verify จะ throw ถ้า token หมดอายุหรือลายเซ็นไม่ถูกต้อง
    req.user = jwt.verify(token, process.env.JWT_SECRET);
    next();
  } catch {
    // ไม่แยกแยะว่า token หมดอายุหรือลายเซ็นผิด — ให้ข้อมูลน้อยที่สุด
    res.status(401).json({ success: false, error: "Invalid or expired token" });
  }
}

module.exports = { requireAuth };
