import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { LogIn, Lock, Mail } from "lucide-react";

import AuthLayout from "@/components/AuthLayout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useAuth } from "@/lib/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("demo@panglaong.app");
  const [password, setPassword] = useState("123456");

  const handleSubmit = (e) => {
    e.preventDefault();
    const result = login({ email, password });

    if (!result.ok) {
      toast.error(result.message);
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
          Log in
        </Button>
      </form>

      <Link to="/forgot-password" className="mt-4 inline-block text-sm text-primary hover:underline">
        ลืมรหัสผ่าน?
      </Link>
    </AuthLayout>
  );
}
