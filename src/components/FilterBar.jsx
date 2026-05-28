import { cn } from "@/lib/utils";

const categories = [
  { id: "all", label: "ทั้งหมด", emoji: "🍽️" },
  { id: "french", label: "เบเกอรี่ฝรั่งเศส", emoji: "🥐" },
  { id: "bread", label: "ขนมปังอบ", emoji: "🍞" },
  { id: "cake", label: "เค้กและขนมหวาน", emoji: "🎂" },
  { id: "donut", label: "โดนัทและฟริตเตอร์", emoji: "🍩" },
];

export default function FilterBar({ active, onChange }) {
  return (
    <div className="flex flex-wrap gap-2 mb-8">
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onChange(cat.id)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-full border font-body text-sm font-medium transition-all duration-300",
            active === cat.id
              ? "bg-primary text-primary-foreground border-primary shadow-sm"
              : "bg-card text-foreground border-border hover:border-primary/50 hover:bg-primary/5"
          )}
        >
          <span>{cat.emoji}</span>
          {cat.label}
        </button>
      ))}
    </div>
  );
}