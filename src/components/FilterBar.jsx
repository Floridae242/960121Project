import { CLASS_CATEGORIES } from "@/lib/app-params";

export default function FilterBar({ category, setCategory }) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        type="button"
        className={`rounded-full px-4 py-1.5 text-sm font-medium ${
          category === "ทั้งหมด" ? "bg-amber-800 text-white" : "bg-amber-100 text-amber-900"
        }`}
        onClick={() => setCategory("ทั้งหมด")}
      >
        ทั้งหมด
      </button>
      {CLASS_CATEGORIES.map((item) => (
        <button
          key={item}
          type="button"
          className={`rounded-full px-4 py-1.5 text-sm font-medium ${
            category === item ? "bg-amber-800 text-white" : "bg-amber-100 text-amber-900"
          }`}
          onClick={() => setCategory(item)}
        >
          {item}
        </button>
      ))}
    </div>
  );
}
