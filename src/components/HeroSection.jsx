import heroBg from "../hero-bg.png";

export default function HeroSection() {
  return (
    <section className="relative h-[380px] w-full overflow-hidden rounded-[2rem] shadow-sm md:h-[450px]">
      {/* Background Image */}
      <img
        src={heroBg}
        alt="Artisan Bakery workshops banner"
        className="absolute inset-0 h-full w-full object-cover"
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/40" />

      {/* Bottom vertical gradient fade to blend with bg-amber-50 */}
      <div className="absolute bottom-0 left-0 right-0 h-44 bg-gradient-to-t from-amber-50 via-amber-50/40 to-transparent" />

      {/* Centered Typography Content */}
      <div className="relative z-10 flex h-full flex-col items-center justify-center px-6 text-center text-white">
        <p className="text-xs font-bold uppercase tracking-[0.25em] text-white/90 md:text-sm">
          Artisan Bakery Workshops
        </p>

        <h1 className="mt-3 text-4xl font-extrabold leading-tight tracking-tight text-white md:text-5xl lg:text-6xl">
          ศิลปะแห่งการนวดแป้ง
        </h1>

        <p className="mt-4 max-w-2xl text-xs font-medium leading-relaxed text-white/90 sm:text-sm md:text-base">
          เรียนรู้ศิลปะการทำขนมอบจากเชฟมืออาชีพ ในบรรยากาศอบอุ่นสไตล์อาร์ทิซาน
        </p>
      </div>
    </section>
  );
}
