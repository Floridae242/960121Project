import { useState } from "react";
import { User, Calendar, CircleDollarSign } from "lucide-react";
import { Button } from "@/components/ui/button";

const CATEGORIES = [
  { label: "ทั้งหมด", value: "ทั้งหมด", emoji: "🍽️" },
  { label: "เบเกอรี่ฝรั่งเศส", value: "เบเกอรี่ฝรั่งเศส", emoji: "🥐" },
  { label: "ขนมปังอบ", value: "ขนมปังอบ", emoji: "🍞" },
  { label: "เค้กและขนมหวาน", value: "เค้กและขนมหวาน", emoji: "🎂" },
  { label: "โดนัทและฟริตเตอร์", value: "โดนัทและฟริตเตอร์", emoji: "🍩" },
];

export default function AllClasses({ workshops, onBook }) {
  const [selectedCategory, setSelectedCategory] = useState("ทั้งหมด");

  const filteredWorkshops = selectedCategory === "ทั้งหมด"
    ? workshops
    : workshops.filter((w) => w.category === selectedCategory);

  return (
    <section className="mt-16 space-y-8">
      {/* Section Header */}
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-extrabold text-amber-950">คลาสที่เปิดรับสมัคร</h2>
        <p className="text-sm font-semibold text-amber-800/85">
          เลือกคลาสที่คุณสนใจแล้วจองที่นั่งได้เลย
        </p>
      </header>

      {/* Categories Filter Tabs */}
      <div className="flex flex-wrap justify-center gap-3">
        {CATEGORIES.map((cat) => {
          const isSelected = selectedCategory === cat.value;
          return (
            <button
              key={cat.value}
              type="button"
              onClick={() => setSelectedCategory(cat.value)}
              className={`flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-bold border transition-all duration-200 shadow-sm ${
                isSelected
                  ? "bg-[#c25e25] text-white border-[#c25e25]"
                  : "bg-white text-neutral-700 border-neutral-200 hover:bg-neutral-50"
              }`}
            >
              <span>{cat.emoji}</span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>

      {/* Workshops Grid */}
      <div className="grid gap-6 sm:grid-cols-2">
        {filteredWorkshops.map((workshop) => {
          const isFull = workshop.isFull || workshop.seatsLeft === 0;
          const seatsRemainingPercent = Math.round((workshop.seatsLeft / workshop.totalSeats) * 100);

          // SVG Circle progress configuration
          const radius = 14;
          const stroke = 3;
          const normalizedRadius = radius - stroke;
          const circumference = normalizedRadius * 2 * Math.PI;
          const strokeDashoffset = circumference - (seatsRemainingPercent / 100) * circumference;

          // Seats color styles
          const isCritical = workshop.seatsLeft <= 3 && !isFull;
          const circleColor = isFull
            ? "stroke-neutral-300"
            : isCritical
            ? "stroke-rose-600"
            : "stroke-emerald-800";
          
          const textColor = isFull
            ? "text-neutral-500"
            : isCritical
            ? "text-rose-600"
            : "text-emerald-800";

          return (
            <article
              key={workshop.id}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-amber-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Upper half: Image */}
              <div className="relative h-56 w-full overflow-hidden bg-neutral-100">
                <img
                  src={workshop.image}
                  alt={workshop.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Left Floating Emoji */}
                <div className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-sm">
                  <span className="text-base leading-none">{workshop.emoji}</span>
                </div>

                {/* Right Class Full Badge */}
                {isFull && (
                  <span className="absolute right-4 top-4 rounded-full bg-black/80 px-3 py-1.5 text-[0.7rem] font-bold uppercase tracking-wider text-white shadow-md">
                    คลาสเต็ม
                  </span>
                )}
              </div>

              {/* Lower half: Card Content */}
              <div className="flex flex-1 flex-col justify-between p-5 space-y-6">
                <div className="space-y-4">
                  <div>
                    <h3 className="text-[1.15rem] font-extrabold leading-snug text-amber-950">
                      {workshop.title}
                    </h3>
                    <p className="mt-2 text-xs font-semibold leading-relaxed text-amber-850/80">
                      {workshop.description}
                    </p>
                  </div>

                  {/* Metadata List */}
                  <div className="space-y-2 text-xs font-bold text-amber-900/80">
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-amber-700/60" />
                      <span>{workshop.chef}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-amber-700/60" />
                      <span>{workshop.dateText}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CircleDollarSign className="h-4 w-4 text-amber-700/60" />
                      <span>฿{workshop.price.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Section */}
                <div className="flex items-center justify-between pt-2">
                  {/* Left: Dynamic Circular Ring Progress */}
                  <div className="flex items-center gap-2.5">
                    <div className="relative flex h-8 w-8 items-center justify-center">
                      <svg height={radius * 2} width={radius * 2} className="transform -rotate-90">
                        {/* Background Track Circle */}
                        <circle
                          stroke="#f3f4f6"
                          fill="transparent"
                          strokeWidth={stroke}
                          r={normalizedRadius}
                          cx={radius}
                          cy={radius}
                        />
                        {/* Foreground Progress Circle */}
                        {!isFull && (
                          <circle
                            className={`transition-all duration-500 ${circleColor}`}
                            fill="transparent"
                            strokeWidth={stroke}
                            strokeDasharray={`${circumference} ${circumference}`}
                            style={{ strokeDashoffset }}
                            strokeLinecap="round"
                            r={normalizedRadius}
                            cx={radius}
                            cy={radius}
                          />
                        )}
                      </svg>
                    </div>
                    <span className={`text-[0.85rem] font-extrabold ${textColor}`}>
                      {isFull ? "เต็มแล้ว" : `${workshop.seatsLeft} / ${workshop.totalSeats} ที่นั่ง`}
                    </span>
                  </div>

                  {/* Right: Booking Button */}
                  {isFull ? (
                    <Button
                      disabled
                      className="rounded-xl bg-neutral-100 px-6 py-2.5 text-sm font-bold text-neutral-400 border border-neutral-200 cursor-not-allowed shadow-none"
                    >
                      เต็มแล้ว
                    </Button>
                  ) : (
                    <Button
                      onClick={() => onBook(workshop)}
                      className="rounded-xl bg-[#c25e25] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#a04a1a] hover:text-white"
                    >
                      จองเลย
                    </Button>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
