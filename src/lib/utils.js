/**
 * utils.js — ฟังก์ชันช่วยเหลือเล็กๆ ของ UI
 */
import { clsx } from "clsx";
import { twMerge } from "tailwind-merge";

// cn — รวม className หลายตัวเข้าด้วยกัน และ merge คลาส Tailwind ที่ชนกันให้เหลือตัวที่ถูกต้อง
export function cn(...inputs) {
  return twMerge(clsx(inputs));
}
