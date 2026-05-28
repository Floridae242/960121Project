import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { CalendarDays, User, Banknote } from "lucide-react";
import SeatBadge from "./SeatBadge";
import { cn } from "@/lib/utils";

export default function WorkshopCard({ workshop, onBook }) {
  const isFull = workshop.seats === 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: [0.4, 0, 0.2, 1] }}
      className={cn(
        "group relative overflow-hidden rounded-2xl bg-card border border-border transition-shadow duration-500",
        isFull ? "opacity-70 grayscale-[40%]" : "hover:shadow-xl hover:shadow-primary/10"
      )}
    >
      {/* Image */}
      <div className="relative h-52 overflow-hidden">
        <img
          src={workshop.image}
          alt={workshop.title}
          className="h-full w-full object-cover transition-transform duration-700 ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
        <span className="absolute top-3 left-3 text-3xl">{workshop.emoji}</span>
        {isFull && (
          <div className="absolute top-3 right-3 bg-foreground/80 text-primary-foreground font-heading text-xs font-semibold px-3 py-1 rounded-full">
            คลาสเต็ม
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 space-y-3">
        <h3 className="font-heading text-lg font-semibold text-foreground leading-snug">
          {workshop.title}
        </h3>
        <p className="font-body text-sm text-muted-foreground leading-relaxed line-clamp-2">
          {workshop.description}
        </p>

        <div className="space-y-1.5 text-sm font-body text-muted-foreground">
          <div className="flex items-center gap-2"><User className="h-4 w-4 text-primary" /> {workshop.instructor}</div>
          <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-primary" /> {workshop.date}</div>
          <div className="flex items-center gap-2"><Banknote className="h-4 w-4 text-primary" /> ฿{workshop.price.toLocaleString()}</div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <SeatBadge seats={workshop.seats} totalSeats={workshop.totalSeats} />
          <Button
            onClick={() => onBook(workshop)}
            disabled={isFull}
            className={cn(
              "h-11 px-6 font-body font-semibold text-sm transition-all duration-300",
              isFull
                ? "cursor-not-allowed bg-muted text-muted-foreground"
                : "bg-primary text-primary-foreground hover:opacity-90"
            )}
          >
            {isFull ? "เต็มแล้ว" : "จองเลย"}
          </Button>
        </div>
      </div>
    </motion.div>
  );
}