import { Button } from "@/components/ui/button";
import SeatBadge from "@/components/SeatBadge";

export default function WorkshopCard({ workshop, onBook }) {
  return (
    <article className="rounded-2xl border border-amber-200 bg-white p-5 shadow-sm transition hover:shadow-md">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold tracking-wide text-amber-700">{workshop.category}</p>
          <h3 className="mt-1 text-lg font-semibold text-amber-950">{workshop.title}</h3>
          <p className="mt-1 text-sm text-amber-800">สอนโดย {workshop.chef}</p>
        </div>
        <SeatBadge seatsLeft={workshop.seatsLeft} />
      </div>

      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-amber-900">
          {workshop.level} · <span className="font-semibold">{workshop.price.toLocaleString()} บาท</span>
        </p>
        <Button className="bg-amber-700 hover:bg-amber-800" onClick={() => onBook(workshop)}>
          จองเลย
        </Button>
      </div>
    </article>
  );
}
