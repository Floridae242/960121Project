/**
 * use-mobile.jsx — hook ตรวจว่าหน้าจอเป็นขนาดมือถือหรือไม่
 * คืนค่า true เมื่อความกว้างหน้าจอ < 768px และอัปเดตอัตโนมัติเมื่อ resize
 */
import * as React from "react"

// เกณฑ์ความกว้าง (px) ที่ถือว่าเป็นมือถือ
const MOBILE_BREAKPOINT = 768

export function useIsMobile() {
  const [isMobile, setIsMobile] = React.useState(undefined)

  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`)
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    }
    mql.addEventListener("change", onChange)
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    return () => mql.removeEventListener("change", onChange);
  }, [])

  return !!isMobile
}
