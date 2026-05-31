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
// ใช้ socketPath เมื่อมีกำหนดไว้ใน .env — แก้ปัญหา macOS Homebrew MySQL
// ที่ listen ผ่าน Unix socket แทน TCP port
const poolConfig = {
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
};

if (process.env.DB_SOCKET) {
  // macOS Homebrew MySQL: เชื่อมต่อผ่าน Unix socket
  poolConfig.socketPath = process.env.DB_SOCKET;
} else {
  // Linux / production: เชื่อมต่อผ่าน TCP
  poolConfig.host = process.env.DB_HOST;
  poolConfig.port = process.env.DB_PORT || 3306;
}

const pool = mysql.createPool(poolConfig);

module.exports = pool;
