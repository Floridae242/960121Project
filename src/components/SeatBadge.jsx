export default function SeatBadge({ seatsLeft }) {
  const low = seatsLeft <= 3;

  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        low ? "bg-rose-100 text-rose-700" : "bg-emerald-100 text-emerald-700"
      }`}
    >
      {seatsLeft} seats left
    </span>
  );
}
