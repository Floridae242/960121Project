/**
 * ResetPassword.jsx — หน้าตั้งรหัสผ่านใหม่
 * ผู้ใช้กรอกรหัสผ่านใหม่ + ยืนยัน แล้วบันทึก จากนั้นพากลับไปหน้า login
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!password || password.length < 6) {
      toast.error("รหัสผ่านต้องมีอย่างน้อย 6 ตัวอักษร");
      return;
    }

    if (password !== confirmPassword) {
      toast.error("รหัสผ่านไม่ตรงกัน");
      return;
    }

    toast.success("รีเซ็ตรหัสผ่านสำเร็จ");
    navigate("/login");
  };

  return (
    <AuthLayout
      title="Reset Password"
      subtitle="ตั้งรหัสผ่านใหม่สำหรับบัญชีของคุณ"
      footer={
        <p className="text-sm text-amber-800">
          กลับไป{' '}
          <Link to="/login" className="font-semibold text-amber-900 underline">
            เข้าสู่ระบบ
          </Link>
        </p>
      }
    >
      <form className="space-y-4" onSubmit={handleSubmit}>
        <div className="space-y-2">
          <Label htmlFor="password">รหัสผ่านใหม่</Label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirm-password">ยืนยันรหัสผ่าน</Label>
          <Input
            id="confirm-password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />
        </div>

        <Button type="submit" className="w-full bg-amber-700 hover:bg-amber-800">
          อัปเดตรหัสผ่าน
        </Button>
      </form>
    </AuthLayout>
  );
}
