/**
 * server.js — จุดเริ่มต้นของ Pang-La-Ong API Server
 *
 * ไฟล์นี้ทำหน้าที่เป็น entry point ของ Express application
 * โดยจะโหลด environment variables, ติดตั้ง middleware ที่จำเป็น,
 * เชื่อมต่อ route handlers ทั้งหมด และเปิด HTTP server
 * ทุก request จะผ่านไฟล์นี้ก่อนเสมอ
 */

require("dotenv").config();

// Zero-Config audit: ตรวจสอบ env ที่จำเป็นตั้งแต่ตอน start
// ถ้าขาด ให้ crash อย่างมีความหมาย (ไม่ปล่อยให้ error งง ๆ ตอน query แรก)
const requiredEnv = ["JWT_SECRET", "DB_USER", "DB_NAME"];
const missing = requiredEnv.filter((key) => !process.env[key]);

// ต้องมีอย่างน้อยหนึ่งช่องทางเชื่อมต่อ DB: socket (macOS) หรือ host (Linux/prod)
if (!process.env.DB_SOCKET && !process.env.DB_HOST) {
  missing.push("DB_SOCKET or DB_HOST");
}

if (missing.length > 0) {
  console.error(
    `FATAL: missing required environment variable(s): ${missing.join(", ")}.\n` +
    `Copy backend/.env.example to backend/.env and fill in the values.`
  );
  process.exit(1);
}

const fs = require("fs");
const path = require("path");
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");

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

// เชื่อถือ reverse proxy ของ host (Render/Heroku/Nginx) — ให้ req.secure / HTTPS ทำงานถูก
app.set("trust proxy", 1);

// Security headers: CSP, HSTS, nosniff, frame-deny, referrer-policy ฯลฯ
// CSP ปรับให้รองรับสิ่งที่แอปใช้: inline styles, Google Fonts, รูป Unsplash, 3D worker/blob
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      // 'wasm-unsafe-eval' จำเป็นสำหรับ Draco WASM ของโมเดล 3D (ไม่เปิด eval ทั่วไป)
      scriptSrc: ["'self'", "'wasm-unsafe-eval'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://fonts.googleapis.com"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      // รูป workshop มาจาก stock หลายแหล่ง (unsplash, istockphoto ฯลฯ) → อนุญาต https: ทั้งหมด
      imgSrc: ["'self'", "data:", "blob:", "https:"],
      connectSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      frameAncestors: ["'none'"],
    },
  },
  crossOriginEmbedderPolicy: false, // ไม่บล็อกรูป/asset ข้ามโดเมน (Unsplash, fonts)
}));

app.use(cors(corsOptions));

// แปลง request body จาก JSON string ให้เป็น JavaScript object อัตโนมัติ
app.use(express.json({ limit: '10kb' }));

// เชื่อมต่อ route groups เข้ากับ path prefix ที่เหมาะสม
app.use("/api/auth", authRoutes);
app.use("/api/workshops", workshopRoutes);
app.use("/api/bookings", bookingRoutes);

// Serve built frontend (production) — เฉพาะเมื่อมี build แล้ว
// dev ใช้ Vite dev server แยก (port 5173) จึงข้าม block นี้เมื่อยังไม่ได้ build
if (fs.existsSync(path.join(CLIENT_BUILD_PATH, "index.html"))) {
  app.use(express.static(CLIENT_BUILD_PATH));
  app.get("*", (req, res, next) => {
    if (req.originalUrl.startsWith("/api")) return next();
    res.sendFile(path.join(CLIENT_BUILD_PATH, "index.html"));
  });
}

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
