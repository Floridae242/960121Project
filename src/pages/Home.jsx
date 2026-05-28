import { useState } from "react";
import { Link } from "react-router-dom";
import HeroSection from "../components/HeroSection";
import PopularClasses from "../components/PopularClasses";
import WorkshopCard from "../components/WorkshopCard";
import FilterBar from "../components/FilterBar";
import BookingModal from "../components/BookingModal";

const initialWorkshops = [
  {
    id: 1,
    title: "โครยซองต์ มาสเตอร์คลาส",
    emoji: "🥐",
    category: "french",
    description: "เรียนรู้ความลับของเลเยอร์ที่สมบูรณ์แบบและการนวดเนยสไตล์ฝรั่งเศสขนานแท้",
    instructor: "เชฟ พงศธร",
    price: 3500,
    date: "15 มิ.ย. 2026 | 09:00 - 16:00",
    seats: 3,
    totalSeats: 12,
    image: "https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/99eba7b74_generated_a0ce29b4.png",
  },
  {
    id: 2,
    title: "เวิร์กชอปโดนัทเคลือบน้ำตาล",
    emoji: "🍩",
    category: "donut",
    description: "สนุกกับการปั้นและเคลือบโดนัทหลากรสชาติ พร้อมเทคนิคการทอดให้ฟูนุ่ม",
    instructor: "เชฟ นภัสสร",
    price: 2800,
    date: "22 มิ.ย. 2026 | 10:00 - 15:00",
    seats: 8,
    totalSeats: 15,
    image: "https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/dd8f0ad0c_generated_3aac60cf.png",
  },
  {
    id: 3,
    title: "ขนมปังซาวร์โดว์เบื้องต้น",
    emoji: "🍞",
    category: "bread",
    description: "เริ่มต้นทำขนมปังซาวร์โดว์ตั้งแต่การเลี้ยงหัวเชื้อจนถึงการอบให้ได้เปลือกกรอบ",
    instructor: "เชฟ ธนวัฒน์",
    price: 2500,
    date: "29 มิ.ย. 2026 | 09:00 - 17:00",
    seats: 0,
    totalSeats: 10,
    image: "https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/1893a1cf2_generated_93d605a6.png",
  },
  {
    id: 4,
    title: "ห้องปฏิบัติการมาการอง",
    emoji: "🎂",
    category: "cake",
    description: "ฝึกทำมาการองฝรั่งเศสให้ได้ผิวเรียบ เท้าสวย พร้อมไส้ครีมหลากรส",
    instructor: "เชฟ ปาริชาต",
    price: 4200,
    date: "6 ก.ค. 2026 | 10:00 - 16:00",
    seats: 5,
    totalSeats: 10,
    image: "https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/83d81ab4b_generated_bdb8eebe.png",
  },
];

export default function Home() {
  const [workshops, setWorkshops] = useState(initialWorkshops);
  const [activeCategory, setActiveCategory] = useState("all");
  const [selected, setSelected] = useState(null);

  const filtered = activeCategory === "all" ? workshops : workshops.filter((w) => w.category === activeCategory);

  const handleConfirm = (id) => {
    setWorkshops((prev) =>
      prev.map((w) => (w.id === id && w.seats > 0 ? { ...w, seats: w.seats - 1 } : w))
    );
  };

  return (
    <div className="min-h-screen bg-background font-body">
      <HeroSection />

      <PopularClasses />

      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-16">
        <div className="text-center mb-6">
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
            คลาสที่เปิดรับสมัคร
          </h2>
          <p className="font-body text-muted-foreground mt-2">เลือกคลาสที่คุณสนใจแล้วจองที่นั่งได้เลย</p>
        </div>

        <FilterBar active={activeCategory} onChange={setActiveCategory} />

        {filtered.length === 0 ? (
          <div className="text-center py-16 text-muted-foreground font-body">
            <p className="text-4xl mb-3">🔍</p>
            <p>ไม่มีคลาสในหมวดหมู่นี้ในขณะนี้</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 lg:gap-8">
            {filtered.map((w) => (
              <WorkshopCard key={w.id} workshop={w} onBook={setSelected} />
            ))}
          </div>
        )}
      </main>

      <div className="text-center pb-8">
        <Link to="/booking">
          <button className="font-body font-semibold text-base bg-primary text-primary-foreground hover:opacity-90 transition-opacity px-10 rounded-2xl" style={{ height: '56px' }}>
            📋 จองคลาสเรียน
          </button>
        </Link>
      </div>

      <footer className="border-t border-border py-8 text-center font-body text-sm text-muted-foreground">
        © 2026 Artisan Bakery Workshops — สงวนลิขสิทธิ์ทุกประการ
      </footer>

      <BookingModal
        workshop={selected}
        open={!!selected}
        onClose={() => setSelected(null)}
        onConfirm={handleConfirm}
      />
    </div>
  );
}