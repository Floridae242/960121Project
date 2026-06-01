import { useEffect, useState } from "react";

/**
 * useMediaQuery — คืนค่า true เมื่อ media query ตรงกับขนาดหน้าจอปัจจุบัน
 * ใช้สำหรับ responsive layout ในคอมโพเนนต์ที่เขียนด้วย inline styles
 * (inline styles ไม่รองรับ @media จึงต้องสลับค่าด้วย JS)
 *
 * @param {string} query - media query เช่น "(max-width: 768px)"
 * @returns {boolean}
 */
export function useMediaQuery(query) {
  const getMatch = () =>
    typeof window !== "undefined" && window.matchMedia(query).matches;

  const [matches, setMatches] = useState(getMatch);

  useEffect(() => {
    const mql = window.matchMedia(query);
    const onChange = () => setMatches(mql.matches);
    onChange(); // sync ค่าเริ่มต้นเผื่อ query เปลี่ยน
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
