/**
 * server.js — จุดเริ่มต้นของ Pang-La-Ong API Server
 *
 * ไฟล์นี้ทำหน้าที่เป็น entry point ของ Express application
 * โดยจะโหลด environment variables, ติดตั้ง middleware ที่จำเป็น,
 * เชื่อมต่อ route handlers ทั้งหมด และเปิด HTTP server
 * ทุก request จะผ่านไฟล์นี้ก่อนเสมอ
 */

require("dotenv").config();

if (!process.env.JWT_SECRET) {
  console.error("FATAL: JWT_SECRET is missing from .env");
  process.exit(1);
}

const path = require("path");
const express = require("express");
const cors = require("cors");

// โหลด route handlers จากแต่ละโมดูล
const authRoutes = require("./routes/authRoutes");
const workshopRoutes = require("./routes/workshopRoutes");
const bookingRoutes = require("./routes/bookingRoutes");

// โหลด global error handler ที่จะจับ error ทุกชนิดที่ไม่ถูก handle
const errorHandler = require("./middleware/errorHandler");

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_BUILD_PATH = path.resolve(__dirname, "../dist");

const corsOptions = process.env.NODE_ENV === "production" ? {
  origin: true,
  credentials: true,
} : {
  origin: /^http:\/\/localhost:(517[0-9])$/,
  credentials: true,
};

app.use(cors(corsOptions));

// แปลง request body จาก JSON string ให้เป็น JavaScript object อัตโนมัติ
app.use(express.json({ limit: '10kb' }));

// เชื่อมต่อ route groups เข้ากับ path prefix ที่เหมาะสม
app.use("/api/auth", authRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/bookings", bookingRoutes);

// Serve built frontend in production from root/dist
app.use(express.static(CLIENT_BUILD_PATH));
app.get("*", (req, res, next) => {
  if (req.originalUrl.startsWith("/api")) {
    return next();
  }
  res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
});

// จัดการ request ที่ไม่ตรงกับ route ใดเลย — ส่ง 404 กลับ
app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

// Global error handler ต้องอยู่ท้ายสุดเสมอ และต้องมี 4 parameters
app.use(errorHandler);

// เปิด server ให้รับ request บน port ที่กำหนด
app.listen(PORT, () => {
  console.log(`Pang-La-Ong API running on http://localhost:${PORT}`);
});
