/**
 * Login.jsx — หน้าเข้าสู่ระบบ
 *
 * ไฟล์นี้แสดงฟอร์มสำหรับ login ด้วย email และ password
 * เรียกใช้ login() จาก AuthContext ซึ่งเป็น async function
 * แก้ bug: login() ต้องถูก await เพราะเป็น async —
 * ถ้าไม่ await จะได้ Promise กลับมาแทน { ok, message }
 * ทำให้ result.ok เป็น undefined และ navigate ถูกเรียกทุกครั้ง
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, Lock, Mail } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

/**
 * Login — หน้า login ที่รับ email และ password
 * มี demo credentials ตั้งต้นสำหรับทดสอบ
 */
export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();

  // ตั้งค่า demo credentials ไว้ล่วงหน้าเพื่อสะดวกในการทดสอบ
  const [email, setEmail] = useState("demo@panglaong.app");
  const [password, setPassword] = useState("123456");

  /**
   * handleSubmit — จัดการการ submit ฟอร์ม login
   * แก้ bug: await login() เพื่อรอผลจาก API
   * login() เป็น async — ถ้าไม่ await จะได้ Promise กลับมา ไม่ใช่ { ok, message }
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // await จำเป็นมาก — login() เป็น async function ใน AuthContext
    const result = await login({ email, password });

    // ตรวจสอบผลลัพธ์ก่อนตัดสินใจ navigate
    if (!result.ok) {
      toast.error(result.message || "เข้าสู่ระบบไม่สำเร็จ");
      return;
    }

    toast.success("เข้าสู่ระบบสำเร็จ");
    navigate("/");
  };

  return (
    <AuthLayout
      icon={LogIn}
      title="เข้าสู่ระบบ"
      subtitle="ล็อกอินเพื่อจัดการการจองของคุณ"
      footer={
        <>
          ยังไม่มีบัญชี?{" "}
          <Link to="/register" className="text-primary font-medium hover:underline">
            สมัครสมาชิก
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ช่องกรอก email พร้อม icon */}
        <div className="space-y-2">
          <Label htmlFor="email">Email</Label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        {/* ช่องกรอก password พร้อม icon */}
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="pl-10 h-12"
              required
            />
          </div>
        </div>

        <Button type="submit" className="w-full h-12">
          Log in
        </Button>
      </form>

      {/* link สำหรับผู้ใช้ที่ลืมรหัสผ่าน */}
      <Link to="/forgot-password" className="mt-4 inline-block text-sm text-primary hover:underline">
        ลืมรหัสผ่าน?
      </Link>
    </AuthLayout>
  );
}
