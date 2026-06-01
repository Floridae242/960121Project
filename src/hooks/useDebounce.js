import { useEffect, useState } from "react";

/**
 * useDebounce — หน่วงการอัปเดต value ตาม delay ที่กำหนด
 * ใช้กับ search input เพื่อไม่ให้ filter ทำงานทุกครั้งที่พิมพ์
 * ลดการ re-render ที่ไม่จำเป็นและลด server load
 */
export function useDebounce(value, delay = 300) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(timer);
  }, [value, delay]);

  return debouncedValue;
}
