import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="relative flex items-center justify-center min-h-[50vh] md:min-h-[60vh] overflow-hidden bg-foreground">
      <img
        src="https://media.base44.com/images/public/6a16f2669d1f1a6f216f87e2/8056de174_generated_image.png"
        alt="artisan bakery"
        className="absolute inset-0 h-full w-full object-cover object-center"
      />
      <div className="absolute inset-0 bg-gradient-to-b from-foreground/60 via-foreground/40 to-background z-10" />
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_transparent_40%,_hsl(var(--foreground))_100%)]" />

      <div className="relative z-20 text-center px-6 max-w-3xl">
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-body text-sm md:text-base tracking-widest uppercase text-primary-foreground/60 mb-4"
        >
          Artisan Bakery Workshops
        </motion.p>
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.7, ease: [0.4, 0, 0.2, 1] }}
          className="font-heading text-4xl md:text-6xl lg:text-7xl font-bold text-primary-foreground leading-tight"
        >
          ศิลปะแห่งการนวดแป้ง
        </motion.h1>
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="font-body text-base md:text-lg text-primary-foreground/70 mt-4 leading-relaxed"
        >
          เรียนรู้ศิลปะการทำขนมอบจากเชฟมืออาชีพ ในบรรยากาศอบอุ่นสไตล์อาร์ทิซาน
        </motion.p>
      </div>
    </section>
  );
}