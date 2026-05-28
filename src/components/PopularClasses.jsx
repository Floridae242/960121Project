import { Flame, Users } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function PopularClasses({ workshops, onBook }) {
  // Styles for tags
  const getTagClasses = (color) => {
    switch (color) {
      case "red":
        return "bg-rose-600 text-white";
      case "orange":
        return "bg-[#c25e25] text-white";
      case "green":
        return "bg-emerald-800 text-white";
      default:
        return "bg-neutral-600 text-white";
    }
  };

  return (
    <section className="mt-12 space-y-6">
      <header className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <Flame className="h-6 w-6 fill-[#c25e25] text-[#c25e25]" />
          <h2 className="text-2xl font-extrabold text-amber-950">คลาสยอดนิยม</h2>
        </div>
        <p className="text-sm font-semibold text-amber-800/85">
          คลาสที่ผู้เรียนให้ความสนใจและจองเต็มเร็วที่สุด
        </p>
      </header>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {workshops.map((workshop) => {
          const percentage = Math.round((workshop.bookedSeats / workshop.totalSeats) * 100);

          return (
            <article
              key={workshop.id}
              className="flex flex-col overflow-hidden rounded-[1.5rem] border border-amber-100 bg-white shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md"
            >
              {/* Image & Badges */}
              <div className="relative h-48 w-full overflow-hidden bg-neutral-100">
                <img
                  src={workshop.image}
                  alt={workshop.title}
                  className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                />

                {/* Gradient overlay for ranking text */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/10" />

                {/* Left Badge */}
                {workshop.tag && (
                  <span className={`absolute left-4 top-4 rounded-full px-3 py-1 text-xs font-bold tracking-wide shadow-sm ${getTagClasses(workshop.tagColor)}`}>
                    {workshop.tag}
                  </span>
                )}

                {/* Right Floating Emoji */}
                <div className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/20 backdrop-blur-md shadow-sm">
                  <span className="text-base leading-none">{workshop.emoji}</span>
                </div>

                {/* Left Rank Indicator */}
                <span className="absolute bottom-2 left-4 text-4xl font-extrabold italic tracking-tighter text-white/30 select-none">
                  {workshop.rank}
                </span>
              </div>

              {/* Card Body */}
              <div className="flex flex-1 flex-col justify-between p-5">
                <div className="space-y-4">
                  <h3 className="text-[1.05rem] font-bold leading-snug text-amber-950">
                    {workshop.title}
                  </h3>

                  {/* Progress Block */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-xs font-bold text-amber-900/80">
                      <div className="flex items-center gap-1.5">
                        <Users className="h-4 w-4 text-amber-700/60" />
                        <span>จองแล้ว {workshop.bookedSeats}/{workshop.totalSeats} ที่นั่ง</span>
                      </div>
                      <span className="text-[#c25e25]">{percentage}%</span>
                    </div>
                    {/* Progress Bar */}
                    <div className="h-2.5 w-full rounded-full bg-neutral-100 overflow-hidden">
                      <div
                        className="h-full rounded-full bg-[#c25e25] transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                </div>

                {/* Footer Row */}
                <div className="mt-6 flex items-center justify-between">
                  <span className="text-[1.15rem] font-extrabold text-amber-950">
                    ฿{workshop.price.toLocaleString()}
                  </span>

                  <Button
                    onClick={() => onBook(workshop)}
                    className="rounded-xl bg-[#c25e25] px-6 py-2.5 text-sm font-bold text-white shadow-sm transition-colors duration-200 hover:bg-[#a04a1a] hover:text-white"
                  >
                    จองเลย
                  </Button>
                </div>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}
