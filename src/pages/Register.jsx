import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { Lock, Mail, UserPlus } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { register } = useAuth();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!name || !email || password.length < 6) {
      toast.error("กรอกข้อมูลให้ครบ และรหัสผ่านอย่างน้อย 6 ตัวอักษร");
      return;
    }

    register({ name, email, password });
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
        <div className="space-y-2">
          <Label htmlFor="name">ชื่อ</Label>
          <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="h-12" required />
        </div>

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
