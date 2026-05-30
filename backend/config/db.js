/**
 * db.js — การเชื่อมต่อฐานข้อมูล MySQL
 *
 * ไฟล์นี้สร้างและ export connection pool สำหรับ MySQL
 * โดยใช้ mysql2/promise เพื่อรองรับ async/await
 * Connection pool ช่วยให้สามารถใช้ connection ร่วมกันได้
 * โดยไม่ต้องเปิด/ปิดการเชื่อมต่อใหม่ทุกครั้ง
 */

const mysql = require("mysql2/promise");

// สร้าง pool ของ connections ที่พร้อมใช้งาน
// ค่า config ทั้งหมดมาจาก environment variables เพื่อความปลอดภัย
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 3306,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  // รอจนกว่าจะมี connection ว่าง แทนที่จะ throw error ทันที
  waitForConnections: true,
  // จำนวน connection สูงสุดที่อนุญาตในพร้อมกัน
  connectionLimit: 10,
});

module.exports = pool;
