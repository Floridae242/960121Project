/**
 * Register.jsx — หน้าสมัครสมาชิก
 *
 * ไฟล์นี้แสดงฟอร์มสำหรับสร้างบัญชีใหม่
 * เรียกใช้ register() จาก AuthContext ซึ่งเป็น async function
 * และตรวจสอบผลลัพธ์ก่อน navigate — แก้ bug ที่ไม่ await register()
 * ทำให้ navigate() ถูกเรียกก่อนที่ API จะตอบกลับ
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, UserPlus } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

/**
 * Register — หน้าสมัครสมาชิกที่รับ name, email, password
 * validate ข้อมูลเบื้องต้นก่อนส่ง และแสดง toast แจ้งผลลัพธ์
 */
export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  /**
   * handleSubmit — จัดการการ submit ฟอร์มสมัครสมาชิก
   * แก้ bug: await register() เพื่อรอผลจาก API ก่อนตัดสินใจ navigate
   * ตรวจสอบ result.ok ก่อน navigate เสมอ
   */
  const handleSubmit = async (e) => {
    e.preventDefault();

    // ตรวจสอบ client-side ก่อนส่ง API เพื่อประหยัด round-trip
    if (!name || !email || password.length < 6) {
      toast.error("กรอกข้อมูลให้ครบ และรหัสผ่านอย่างน้อย 6 ตัวอักษร");
      return;
    }

    // await จำเป็น — register() เป็น async ต้องรอผลก่อน navigate
    const result = await register({ name, email, password });

    // ตรวจสอบผลลัพธ์ก่อน navigate — ถ้าล้มเหลวให้แสดง error และอยู่หน้าเดิม
    if (!result.ok) {
      toast.error(result.message || "สมัครสมาชิกไม่สำเร็จ");
      return;
    }

    toast.success("สมัครสมาชิกสำเร็จ");
    navigate("/");
  };

  return (
    <AuthLayout
      icon={UserPlus}
      title="สมัครสมาชิก"
      subtitle="สร้างบัญชีเพื่อเริ่มจองคลาส"
      footer={
        <>
          มีบัญชีแล้ว?{" "}
          <Link to="/login" className="text-primary font-medium hover:underline">
            เข้าสู่ระบบ
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* ช่องกรอกชื่อผู้ใช้ */}
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อ</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="h-12"
            required
          />
        </div>

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
          Create account
        </Button>
      </form>
    </AuthLayout>
  );
}
