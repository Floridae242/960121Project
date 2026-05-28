import { cn } from "@/lib/utils";

export default function SeatBadge({ seats, totalSeats }) {
  const percentage = (seats / totalSeats) * 100;
  const isFull = seats === 0;
  const isLow = seats > 0 && seats <= 3;

  return (
    <div className="flex items-center gap-2" aria-live="polite">
      <div className="relative h-8 w-8">
        <svg className="h-8 w-8 -rotate-90" viewBox="0 0 36 36">
          <circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke="hsl(var(--border))"
            strokeWidth="3"
          />
          <circle
            cx="18" cy="18" r="15"
            fill="none"
            stroke={isFull ? "hsl(var(--muted-foreground))" : isLow ? "hsl(var(--destructive))" : "hsl(var(--accent))"}
            strokeWidth="3"
            strokeDasharray={`${percentage * 0.942} 100`}
            strokeLinecap="round"
            className="transition-all duration-700 ease-out"
          />
        </svg>
      </div>
      <span className={cn(
        "font-body text-sm font-medium",
        isFull ? "text-muted-foreground" : isLow ? "text-destructive" : "text-accent"
      )}>
        {isFull ? "เต็มแล้ว" : `${seats} / ${totalSeats} ที่นั่ง`}
      </span>
    </div>
  );
}