import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { fetchWorkshops } from "@/api/base44Client";
import BookingModal from "@/components/BookingModal";
import HeroSection from "@/components/HeroSection";
import PopularClasses from "@/components/PopularClasses";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/lib/AuthContext";

export default function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [workshops, setWorkshops] = useState([]);
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [bookingOpen, setBookingOpen] = useState(false);

  useEffect(() => {
    fetchWorkshops().then(setWorkshops);
  }, []);

  const previewClasses = useMemo(() => workshops.slice(0, 2), [workshops]);

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
                <span className="text-sm text-amber-900">สวัสดี, {user.name}</span>
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
        <PopularClasses workshops={previewClasses} onBook={handleBook} />

        <BookingModal
          workshop={selectedWorkshop}
          open={bookingOpen}
          onOpenChange={setBookingOpen}
          onBooked={() => navigate("/booking")}
        />
      </div>
    </main>
  );
}
