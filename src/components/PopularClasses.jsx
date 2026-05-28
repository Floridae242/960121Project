import WorkshopCard from "@/components/WorkshopCard";

export default function PopularClasses({ workshops, onBook }) {
  return (
    <section className="mt-8 space-y-4">
      <header>
        <h2 className="text-2xl font-semibold text-amber-950">คลาสยอดนิยม</h2>
        <p className="text-sm text-amber-800">เลือกคลาสที่ใช่ แล้วจองที่นั่งได้ทันที</p>
      </header>

      <div className="grid gap-4 md:grid-cols-2">
        {workshops.map((workshop) => (
          <WorkshopCard key={workshop.id} workshop={workshop} onBook={onBook} />
        ))}
      </div>
    </section>
  );
}
