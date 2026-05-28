import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";
import { APP_NAME } from "@/lib/app-params";

export default function HeroSection() {
  return (
    <section className="rounded-3xl bg-gradient-to-r from-amber-900 to-orange-700 p-8 text-amber-50 shadow-md md:p-10">
      <p className="text-xs uppercase tracking-[0.25em] text-amber-100">Workshop marketplace</p>
      <h1 className="mt-3 text-4xl font-bold leading-tight md:text-5xl">{APP_NAME}</h1>
      <p className="mt-4 max-w-2xl text-sm text-amber-100 md:text-base">
        ตลาดนัดเวิร์กชอปทำขนมสำหรับคนรักงานฝีมือ ค้นหาคลาสเรียนจากเชฟมืออาชีพ
        และร่วมสัมผัสศิลปะการอบขนมในพื้นที่ที่เต็มไปด้วยความอบอุ่น
      </p>

      <div className="mt-7 flex flex-wrap gap-3">
        <Button asChild className="bg-white text-amber-900 hover:bg-amber-100">
          <Link to="/booking">จองคลาสเรียน</Link>
        </Button>
        <Button asChild variant="outline" className="border-amber-100 text-amber-100 hover:bg-amber-800">
          <Link to="/register">สมัครสมาชิก</Link>
        </Button>
      </div>
    </section>
  );
}
