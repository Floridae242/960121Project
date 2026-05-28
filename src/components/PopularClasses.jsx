import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { Flame, Users } from "lucide-react";

const popular = [
  {
    id: 1,
    title: "โครยซองต์ มาสเตอร์คลาส",
    emoji: "🥐",
    instructor: "เชฟ พงศธร",
    price: 3500,
    seats: 3,
    totalSeats: 12,
    image: "https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/99eba7b74_generated_a0ce29b4.png",
    tag: "เหลือน้อยมาก!",
    tagColor: "bg-destructive/90",
  },
  {
    id: 4,
    title: "ห้องปฏิบัติการมาการอง",
    emoji: "🎂",
    instructor: "เชฟ ปาริชาต",
    price: 4200,
    seats: 5,
    totalSeats: 10,
    image: "https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/83d81ab4b_generated_bdb8eebe.png",
    tag: "ขายดีที่สุด",
    tagColor: "bg-primary/90",
  },
  {
    id: 2,
    title: "เวิร์กชอปโดนัทเคลือบน้ำตาล",
    emoji: "🍩",
    instructor: "เชฟ นภัสสร",
    price: 2800,
    seats: 8,
    totalSeats: 15,
    image: "https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/dd8f0ad0c_generated_3aac60cf.png",
    tag: "ยอดนิยม",
    tagColor: "bg-accent/90",
  },
];

export default function PopularClasses() {
  return (
    <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-2">
      {/* Heading */}
      <div className="flex items-center gap-3 mb-6">
        <Flame className="h-6 w-6 text-primary" />
        <div>
          <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">
            คลาสยอดนิยม
          </h2>
          <p className="font-body text-sm text-muted-foreground mt-0.5">
            คลาสที่ผู้เรียนให้ความสนใจและจองเต็มเร็วที่สุด
          </p>
        </div>
      </div>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {popular.map((w, i) => {
          const bookedPct = Math.round(((w.totalSeats - w.seats) / w.totalSeats) * 100);
          return (
            <motion.div
              key={w.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1, duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
              className="group relative overflow-hidden rounded-2xl bg-card border border-border hover:shadow-xl hover:shadow-primary/10 transition-shadow duration-500"
            >
              {/* Image */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={w.image}
                  alt={w.title}
                  className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                {/* Tag badge */}
                <span className={`absolute top-3 left-3 font-body text-xs font-semibold text-white px-3 py-1 rounded-full ${w.tagColor} backdrop-blur-sm`}>
                  {w.tag}
                </span>
                <span className="absolute top-3 right-3 text-2xl">{w.emoji}</span>
                {/* Rank */}
                <span className="absolute bottom-3 left-3 font-heading text-3xl font-bold text-white/30 select-none">
                  #{i + 1}
                </span>
              </div>

              {/* Info */}
              <div className="p-4 space-y-3">
                <h3 className="font-heading text-base font-semibold text-foreground leading-snug">
                  {w.title}
                </h3>

                {/* Booking progress bar */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="font-body text-xs text-muted-foreground flex items-center gap-1">
                      <Users className="h-3 w-3" /> จองแล้ว {w.totalSeats - w.seats}/{w.totalSeats} ที่นั่ง
                    </span>
                    <span className="font-body text-xs font-semibold text-primary">{bookedPct}%</span>
                  </div>
                  <div className="h-2 w-full rounded-full bg-muted overflow-hidden">
                    <motion.div
                      className="h-full rounded-full bg-primary"
                      initial={{ width: 0 }}
                      animate={{ width: `${bookedPct}%` }}
                      transition={{ delay: i * 0.1 + 0.4, duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                  <span className="font-body text-sm font-semibold text-foreground">
                    ฿{w.price.toLocaleString()}
                  </span>
                  <Link to="/booking">
                    <button className="font-body text-sm font-semibold text-primary-foreground bg-primary hover:opacity-90 transition-opacity px-4 rounded-xl" style={{ height: "36px" }}>
                      จองเลย
                    </button>
                  </Link>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Divider */}
      <div className="mt-12 border-t border-border" />
    </section>
  );
}