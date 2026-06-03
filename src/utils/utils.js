/**
 * utils.js — ฟังก์ชันช่วยรวม className (สำเนาของ src/lib/utils.js)
 */
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

// cn — รวมและ merge คลาส Tailwind ที่ขัดแย้งกันให้เหลือตัวที่ถูกต้อง
export function cn(...inputs) {
  return twMerge(clsx(inputs))
}
