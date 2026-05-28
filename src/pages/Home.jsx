/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   chef: string;
 *   level: string;
 *   price: number;
 *   bookedSeats: number;
 *   totalSeats: number;
 *   seatsLeft: number;
 *   category: string;
 *   emoji: string;
 *   tag: string | null;
 *   tagColor: string | null;
 *   rank: string;
 *   image: string;
 *   description: string;
 *   dateText: string;
 *   isFull: boolean;
 * }} Workshop
 */

import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { fetchWorkshops } from "@/api/apiClient";
import BookingModal from "@/components/BookingModal";
import HeroSection from "@/components/HeroSection";
import PopularClasses from "@/components/PopularClasses";
import AllClasses from "@/components/AllClasses";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [workshops, setWorkshops] = useState(/** @type {Workshop[]} */ ([]));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedWorkshop, setSelectedWorkshop] = useState(/** @type {Workshop | null} */ (null));
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchWorkshops()
      .then((data) => {
        setWorkshops(data);
      })
      .catch((err) => {
        console.error(err);
        setError(err.message || "เกิดข้อผิดพลาดในการโหลดข้อมูล");
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  const previewClasses = useMemo(() => workshops.slice(0, 3), [workshops]);

  /** @param {Workshop} workshop */
  const handleBook = (workshop) => {
    if (!isAuthenticated) {
      navigate("/login?next=/booking");
      return;
    }

    setSelectedWorkshop(workshop);
    setBookingOpen(true);
  };

  return (
    <main className="min-h-screen bg-amber-50 px-6 pb-12 pt-6">
      <div className="mx-auto max-w-5xl">
        <header className="mb-6 flex items-center justify-between">
          <p className="text-sm font-semibold text-amber-900">แป้งละออง · Pang-La-Ong</p>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-amber-900">สวัสดี, {user?.name || "ผู้ใช้"}</span>
                <Button variant="outline" onClick={logout}>
                  ออกจากระบบ
                </Button>
              </>
            ) : (
              <>
                <Button asChild variant="outline">
                  <Link to="/login">เข้าสู่ระบบ</Link>
                </Button>
                <Button asChild className="bg-amber-700 hover:bg-amber-800">
                  <Link to="/register">สมัครสมาชิก</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <HeroSection />

        {loading ? (
          <div className="rounded-3xl border border-amber-200 bg-white p-10 text-center text-amber-900 shadow-sm">
            กำลังโหลดคลาส...
          </div>
        ) : error ? (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-10 text-center text-rose-900 shadow-sm">
            ไม่สามารถโหลดคลาสได้: {error}
          </div>
        ) : (
          <>
            <PopularClasses workshops={previewClasses} onBook={handleBook} />
            <AllClasses workshops={workshops} onBook={handleBook} />
          </>
        )}

        <div className="mt-16 flex justify-center">
          <Button
            asChild
            className="rounded-2xl bg-[#c25e25] px-8 py-6 text-base font-extrabold text-white shadow-md transition-all duration-200 hover:bg-[#a04a1a] hover:scale-[1.02] hover:text-white"
          >
            <Link to="/booking" className="flex items-center gap-2">
              📋 จองคลาสเรียน
            </Link>
          </Button>
        </div>

        <BookingModal
          workshop={selectedWorkshop}
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          onBooked={() => navigate(`/booking?workshopId=${selectedWorkshop?.id}`)}
        />
      </div>
    </main>
  );
}
