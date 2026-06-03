/**
 * query-client.js — โครง (stub) ของ data-fetching client อย่างง่าย
 * หมายเหตุ: การเรียก API จริงของแอปทำผ่าน src/api/apiClient.js
 * ไฟล์นี้เป็นเพียงโครงไว้สำหรับต่อยอด/ทดสอบ
 */
export function queryClient() {
  return {
    // get — คืนค่า payload จำลอง (ยังไม่ได้เชื่อมต่อ backend จริง)
    async get(path) {
      return { path, data: null };
    },
  };
}
