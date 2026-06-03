/**
 * authService.js — Business Logic สำหรับระบบ Authentication
 *
 * ไฟล์นี้จัดการ logic การสมัครสมาชิกและเข้าสู่ระบบ
 * รวมถึงการ hash password, ตรวจสอบ email ซ้ำ,
 * เปรียบเทียบ password และออก JWT token
 * ทุก query ใช้ parameterized statement — ไม่มี SQL injection
 */

const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

/**
 * register — สร้างบัญชีผู้ใช้ใหม่และออก JWT token
 * ตรวจสอบ email ซ้ำก่อน แล้ว hash password ด้วย bcrypt
 */
async function register({ name, email, password }) {
  // ตรวจสอบว่า email นี้ถูกใช้งานแล้วหรือยัง
  const [existing] = await db.query("SELECT id FROM users WHERE email = ?", [email]);
  if (existing.length > 0) {
    const err = new Error("Email already registered");
    err.status = 409; // Conflict — resource นั้นมีอยู่แล้ว
    throw err;
  }

  // hash password ด้วย cost factor 10 — สมดุลระหว่างความปลอดภัยและความเร็ว
  const password_hash = await bcrypt.hash(password, 10);

  // บันทึก user ใหม่ลงฐานข้อมูล — ไม่เก็บ password ตัวจริงเด็ดขาด
  const [result] = await db.query(
    "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
    [name, email, password_hash]
  );

  // ออก token ทันทีหลังสมัคร ไม่ต้อง login ซ้ำ
  const token = signToken({ id: result.insertId, name, email });
  return { token, user: { name, email } };
}

/**
 * login — ยืนยันตัวตนด้วย email/password และออก JWT token ใหม่
 * ใช้ error message เดียวกันสำหรับทั้ง "ไม่พบ email" และ "password ผิด"
 * เพื่อป้องกัน user enumeration attack
 */
async function login({ email, password }) {
  const [rows] = await db.query(
    "SELECT id, name, email, password_hash FROM users WHERE email = ?",
    [email]
  );

  // เตรียม error ไว้ล่วงหน้า — ใช้ message เดียวกันสองกรณีเพื่อความปลอดภัย
  const invalid = new Error("Invalid email or password");
  invalid.status = 401;

  // กรณีที่ 1: ไม่พบ email นี้ในระบบ
  if (rows.length === 0) throw invalid;

  const user = rows[0];

  // กรณีที่ 2: email ถูกแต่ password ไม่ตรง
  const match = await bcrypt.compare(password, user.password_hash);
  if (!match) throw invalid;

  // ออก token ใหม่ทุกครั้งที่ login สำเร็จ
  const token = signToken({ id: user.id, name: user.name, email: user.email });
  return { token, user: { name: user.name, email: user.email } };
}

/**
 * signToken — สร้าง JWT token จาก payload ที่กำหนด
 * secret และอายุ token มาจาก environment variables
 */
function signToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  });
}

module.exports = { register, login };
