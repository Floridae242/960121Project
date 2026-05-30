/**
 * workshopController.js — Controller สำหรับจัดการ Request ด้าน Workshop
 *
 * ไฟล์นี้รับ HTTP request จาก workshopRoutes
 * ทำ validation เบื้องต้นบน URL parameter
 * แล้วส่งต่อให้ workshopService ดึงข้อมูลจากฐานข้อมูล
 * ไม่มี SQL query อยู่ในชั้นนี้โดยตรง
 */

const workshopService = require("../services/workshopService");

/**
 * getAll — ดึง workshop ทั้งหมดเรียงตามยอดนิยม
 * ไม่ต้องการ parameter ใด ๆ — ดึงทั้งหมดแบบ public
 */
async function getAll(req, res, next) {
  try {
    const workshops = await workshopService.getAll();
    res.json({ success: true, data: workshops });
  } catch (err) {
    next(err);
  }
}

/**
 * getById — ดึงรายละเอียด workshop รายการเดียว พร้อม time slots
 * ตรวจสอบ ID จาก URL parameter ว่าเป็นตัวเลขที่ถูกต้องก่อน
 */
async function getById(req, res, next) {
  try {
    // แปลง param จาก string เป็น integer — ป้องกัน NaN เข้า query
    const id = parseInt(req.params.id, 10);
    if (isNaN(id)) {
      return res.status(400).json({ success: false, error: "Invalid workshop ID" });
    }

    const workshop = await workshopService.getById(id);

    // ถ้า service ส่ง null กลับมา แสดงว่าไม่พบ workshop นั้นในฐานข้อมูล
    if (!workshop) {
      return res.status(404).json({ success: false, error: "Workshop not found" });
    }

    res.json({ success: true, data: workshop });
  } catch (err) {
    next(err);
  }
}

module.exports = { getAll, getById };
