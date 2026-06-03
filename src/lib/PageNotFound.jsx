/**
 * PageNotFound.jsx — หน้า 404 (ไม่พบหน้าที่ร้องขอ)
 * แสดงเมื่อ URL ไม่ตรงกับ route ใดเลย พร้อมปุ่มกลับหน้าแรก
 */
import { Link } from "react-router-dom";

import { Button } from "@/components/ui/button";

export default function PageNotFound() {
  return (
    <main className="flex min-h-screen items-center justify-center bg-amber-50 p-6">
      <div className="max-w-md rounded-2xl border border-amber-200 bg-white p-8 text-center shadow-sm">
        <p className="text-sm font-medium text-amber-600">404</p>
        <h1 className="mt-2 text-3xl font-bold text-amber-950">Page not found</h1>
        <p className="mt-3 text-amber-800">
          The page you requested does not exist in this workshop marketplace.
        </p>
        <Button asChild className="mt-6 bg-amber-700 hover:bg-amber-800">
          <Link to="/">Go back home</Link>
        </Button>
      </div>
    </main>
  );
}
