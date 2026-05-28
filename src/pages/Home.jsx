import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { fetchWorkshops } from "@/api/apiClient";
import BookingModal from "@/components/BookingModal";
import HeroSection from "@/components/HeroSection";
import PopularClasses from "@/components/PopularClasses";
import AllClasses from "@/components/AllClasses";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";
import { User, LogOut } from "lucide-react";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetchWorkshops().then(setWorkshops);
  }, []);

  const previewClasses = useMemo(() => workshops.slice(0, 3), [workshops]);

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
          <div className="flex items-baseline">
            <span className="text-lg font-bold text-amber-950">แป้งละออง</span>
            <span className="text-sm text-amber-800/60 ml-1"> · Pang-La-Ong</span>
          </div>
          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <div className="flex items-center gap-3">
                {/* Profile Info Pill */}
                <div className="flex items-center gap-2.5 bg-white border border-neutral-300 rounded-full px-4 py-1.5 shadow-sm">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-100 text-orange-700">
                    <User className="h-4 w-4" />
                  </div>
                  <span className="text-xs font-bold text-neutral-700">
                    สวัสดี, <span className="text-[#c25e25] font-extrabold">{user.name}</span>
                  </span>
                </div>

                {/* Logout Button */}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={logout}
                  className="rounded-full flex items-center gap-1.5 border-neutral-300 bg-white hover:bg-neutral-50 text-xs font-bold text-neutral-700 shadow-sm"
                >
                  <LogOut className="h-3.5 w-3.5 text-neutral-600" />
                  ออกจากระบบ
                </Button>
              </div>
            ) : (
              <>
                <Button asChild variant="outline" className="rounded-full border-neutral-300 text-neutral-700 hover:bg-neutral-50 shadow-sm">
                  <Link to="/login">เข้าสู่ระบบ</Link>
                </Button>
                <Button asChild className="rounded-full bg-amber-700 hover:bg-amber-800 text-white shadow-sm">
                  <Link to="/register">สมัครสมาชิก</Link>
                </Button>
              </>
            )}
          </div>
        </header>

        <HeroSection />
        <PopularClasses workshops={previewClasses} onBook={handleBook} />
        <AllClasses workshops={workshops} onBook={handleBook} />

        <div className="mt-16 flex justify-center">
          <Button
            asChild
            className="rounded-2xl bg-[#c25e25] px-8 py-6 text-base font-extrabold text-white shadow-md transition-all duration-200 hover:bg-[#a04a1a] hover:scale-[1.02] hover:text-white"
          >
            <Link to="/booking" className="flex items-center gap-2">
              จองคลาสเรียน
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
