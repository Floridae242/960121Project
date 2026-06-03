/**
 * main.jsx — จุดเริ่มต้น (entry point) ของฝั่ง React
 *
 * ไฟล์นี้ mount คอมโพเนนต์หลัก <App /> เข้ากับ DOM (element id="root")
 * และโหลด global stylesheet (index.css)
 * ห่อด้วย <React.StrictMode> เพื่อช่วยตรวจจับปัญหา/side effect ระหว่างการพัฒนา
 */
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'

// สร้าง React root แล้ว render แอปทั้งหมดลงใน <div id="root"> ของ index.html
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
