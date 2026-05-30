/**
 * AuthContext.jsx — Context สำหรับจัดการสถานะการ Authentication ทั่วแอป
 *
 * ไฟล์นี้สร้าง React Context ที่เก็บสถานะ user, loading และ error
 * รวมถึงฟังก์ชัน login, register และ logout
 * ใช้ localStorage เพื่อ persist ข้อมูล user ระหว่าง session
 * component ใด ๆ ในแอปสามารถเรียกใช้ useAuth() เพื่อเข้าถึงข้อมูลเหล่านี้
 */

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { apiLogin, apiLogout, apiRegister } from "@/api/apiClient";

const AUTH_STORAGE_KEY = "panglaong-user";
const AuthContext = createContext(null);

/**
 * readUserFromStorage — อ่านข้อมูล user ที่บันทึกไว้จาก localStorage
 * ส่งคืน null ถ้าไม่มีข้อมูลหรือ parse ไม่ได้
 */
function readUserFromStorage() {
  try {
    const raw = window.localStorage.getItem(AUTH_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    // localStorage อาจถูกปิดใน private mode หรือ data เสียหาย
    return null;
  }
}

/**
 * AuthProvider — Provider component ที่ครอบทั้งแอป
 * ใส่ไว้ที่ App.jsx เพื่อให้ทุก component เข้าถึง auth state ได้
 */
export function AuthProvider({ children }) {
  // โหลด user จาก localStorage ทันทีเมื่อ mount — ไม่ต้องรอ fetch
  const [user, setUser] = useState(() => readUserFromStorage());
  const [authError, setAuthError] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(false);

  /**
   * saveUser — อัปเดต state และ localStorage พร้อมกัน
   * เมื่อ logout ส่ง null มา จะลบ key ออกจาก localStorage
   */
  const saveUser = useCallback((nextUser) => {
    setUser(nextUser);
    if (nextUser) {
      window.localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextUser));
    } else {
      window.localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  }, []);

  /**
   * login — เรียก API เพื่อเข้าสู่ระบบและอัปเดต state
   * ส่งคืน { ok: true } เมื่อสำเร็จ หรือ { ok: false, message } เมื่อล้มเหลว
   */
  const login = useCallback(
    async ({ email, password }) => {
      setIsLoadingAuth(true);
      setAuthError(null); // ล้าง error เก่าก่อนเริ่ม request ใหม่
      try {
        const nextUser = await apiLogin({ email, password });
        saveUser(nextUser);
        return { ok: true };
      } catch (err) {
        const error = { message: err.message };
        setAuthError(error);
        return { ok: false, message: err.message };
      } finally {
        // ปิด loading ทั้งกรณีสำเร็จและล้มเหลว
        setIsLoadingAuth(false);
      }
    },
    [saveUser]
  );

  /**
   * register — เรียก API เพื่อสมัครสมาชิกและ login อัตโนมัติ
   * ส่งคืน { ok: true } เมื่อสำเร็จ หรือ { ok: false, message } เมื่อล้มเหลว
   */
  const register = useCallback(
    async ({ name, email, password }) => {
      setIsLoadingAuth(true);
      setAuthError(null); // ล้าง error เก่าก่อนเริ่ม request ใหม่
      try {
        const nextUser = await apiRegister({ name, email, password });
        saveUser(nextUser);
        return { ok: true };
      } catch (err) {
        const error = { message: err.message };
        setAuthError(error);
        return { ok: false, message: err.message };
      } finally {
        setIsLoadingAuth(false);
      }
    },
    [saveUser]
  );

  /**
   * logout — ล้าง token จาก localStorage และ reset state
   */
  const logout = useCallback(() => {
    apiLogout(); // ลบ token จาก localStorage
    saveUser(null); // ล้าง user state และ user key ใน localStorage
    setAuthError(null);
  }, [saveUser]);

  /**
   * value — รวม state และ function ทั้งหมดที่ export ออกไป
   * useMemo ป้องกัน re-render ที่ไม่จำเป็นเมื่อ ref ของ object เปลี่ยน
   */
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoadingAuth,
      isLoadingPublicSettings: false,
      authError,
      authChecked: true,
      appPublicSettings: null,
      login,
      register,
      logout,
      // redirect ไป login page — ใช้ในกรณีที่ hook ถูกเรียกนอก Router
      navigateToLogin: () => { window.location.href = "/login"; },
      checkUserAuth: () => readUserFromStorage(),
      checkAppState: () => {},
    }),
    [user, isLoadingAuth, authError, login, register, logout]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

/**
 * useAuth — custom hook สำหรับเข้าถึง auth context
 * ต้องใช้ภายใน AuthProvider เท่านั้น — จะ throw ถ้าใช้นอก provider
 */
export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
