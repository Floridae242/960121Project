/**
 * errorHandler.js — Global Error Handler Middleware
 *
 * ไฟล์นี้จัดการ error ทุกชนิดที่ถูกส่งมาผ่าน next(err)
 * จากทุก controller และ middleware ในระบบ
 * ใน production จะซ่อนรายละเอียด error ภายในเพื่อความปลอดภัย
 * ใน development จะแสดง error message เต็มเพื่อช่วยการ debug
 * ต้องเป็น middleware ตัวสุดท้ายใน Express pipeline เสมอ
 */

/**
 * errorHandler — Express error middleware (ต้องมี 4 parameter เสมอ)
 * จับ error ทุกชนิดจากทั่วทั้งแอป แล้วส่ง response ที่เหมาะสมกลับไป
 */
function errorHandler(err, req, res, next) {
  // Log รายละเอียด error แบบเต็มไว้สำหรับนักพัฒนา ไม่ส่งไปให้ client
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}`, err);

  const status = err.status || 500;

  // ใน production ซ่อน internal error — แสดงเฉพาะ error ที่ตั้งใจส่งออก (status < 500)
  const message =
    process.env.NODE_ENV === "production"
      ? status === 500
        ? "Internal server error"
        : err.message
      : err.message;

  res.status(status).json({ success: false, error: message });
}

module.exports = errorHandler;
