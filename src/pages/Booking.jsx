import { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, CalendarDays, Clock, User, Phone, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

const workshops = [
  {
    id: 1,
    title: "โครยซองต์ มาสเตอร์คลาส",
    emoji: "🥐",
    instructor: "เชฟ พงศธร",
    price: 3500,
    slots: ["15 มิ.ย. 2026 | 09:00 - 16:00", "29 มิ.ย. 2026 | 09:00 - 16:00"],
  },
  {
    id: 2,
    title: "เวิร์กชอปโดนัทเคลือบน้ำตาล",
    emoji: "🍩",
    instructor: "เชฟ นภัสสร",
    price: 2800,
    slots: ["22 มิ.ย. 2026 | 10:00 - 15:00", "13 ก.ค. 2026 | 10:00 - 15:00"],
  },
  {
    id: 3,
    title: "ขนมปังซาวร์โดว์เบื้องต้น",
    emoji: "🍞",
    instructor: "เชฟ ธนวัฒน์",
    price: 2500,
    slots: ["6 ก.ค. 2026 | 09:00 - 17:00", "20 ก.ค. 2026 | 09:00 - 17:00"],
  },
  {
    id: 4,
    title: "ห้องปฏิบัติการมาการอง",
    emoji: "🎂",
    instructor: "เชฟ ปาริชาต",
    price: 4200,
    slots: ["6 ก.ค. 2026 | 10:00 - 16:00", "27 ก.ค. 2026 | 10:00 - 16:00"],
  },
];

export default function Booking() {
  const [selectedWorkshop, setSelectedWorkshop] = useState(null);
  const [selectedSlot, setSelectedSlot] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [errors, setErrors] = useState({});

  const workshop = workshops.find((w) => w.id === selectedWorkshop);

  const validate = () => {
    const e = {};
    if (!selectedWorkshop) e.workshop = "กรุณาเลือกคลาสเรียน";
    if (!selectedSlot) e.slot = "กรุณาเลือกวันและเวลา";
    if (!name.trim()) e.name = "กรุณากรอกชื่อ-นามสกุล";
    if (!phone.trim() || !/^[0-9]{9,10}$/.test(phone.replace(/[-\s]/g, "")))
      e.phone = "กรุณากรอกเบอร์โทรศัพท์ที่ถูกต้อง";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const e2 = validate();
    if (Object.keys(e2).length > 0) { setErrors(e2); return; }
    setErrors({});
    setConfirmed(true);
  };

  return (
    <div className="min-h-screen bg-background font-body">
      {/* Header */}
      <div className="bg-card border-b border-border px-4 py-4 sticky top-0 z-10 backdrop-blur-sm bg-card/90">
        <div className="max-w-3xl mx-auto flex items-center gap-3">
          <Link to="/" className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-primary transition-colors">
            <ChevronLeft className="h-4 w-4" /> กลับหน้าหลัก
          </Link>
          <span className="text-muted-foreground/40">|</span>
          <h1 className="font-heading text-lg font-semibold text-foreground">จองคลาสเรียน</h1>
        </div>
      </div>

      <main className="max-w-3xl mx-auto px-4 sm:px-6 py-10 md:py-14">
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center text-center py-16 gap-5"
            >
              <CheckCircle2 className="h-16 w-16 text-accent" strokeWidth={1.5} />
              <h2 className="font-heading text-3xl font-semibold text-foreground">การจองสำเร็จ! 🎉</h2>
              <div className="bg-card border border-border rounded-2xl p-6 w-full max-w-sm text-left space-y-2 text-sm font-body text-muted-foreground">
                <p><span className="text-foreground font-medium">คลาส:</span> {workshop?.emoji} {workshop?.title}</p>
                <p><span className="text-foreground font-medium">วันเวลา:</span> {selectedSlot}</p>
                <p><span className="text-foreground font-medium">ชื่อ:</span> {name}</p>
                <p><span className="text-foreground font-medium">เบอร์โทร:</span> {phone}</p>
                <p><span className="text-foreground font-medium">ราคา:</span> ฿{workshop?.price?.toLocaleString()}</p>
              </div>
              <p className="text-muted-foreground text-sm">ทีมงานจะติดต่อกลับเพื่อยืนยันการชำระเงิน</p>
              <Link to="/">
                <Button variant="outline" className="font-body mt-2">ดูคลาสอื่น ๆ</Button>
              </Link>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="mb-8">
                <h2 className="font-heading text-2xl md:text-3xl font-semibold text-foreground">จองที่นั่งของคุณ</h2>
                <p className="font-body text-muted-foreground mt-1">เลือกคลาสและกรอกข้อมูลเพื่อยืนยันการจอง</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-8">
                {/* Step 1: Select Workshop */}
                <section>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-body font-semibold">1</span>
                    เลือกคลาสเรียน
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {workshops.map((w) => (
                      <button
                        key={w.id}
                        type="button"
                        onClick={() => { setSelectedWorkshop(w.id); setSelectedSlot(""); setErrors((prev) => ({ ...prev, workshop: undefined })); }}
                        className={cn(
                          "text-left p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer",
                          selectedWorkshop === w.id
                            ? "border-primary bg-primary/5 shadow-sm"
                            : "border-border bg-card hover:border-primary/40"
                        )}
                      >
                        <span className="text-2xl">{w.emoji}</span>
                        <p className="font-body font-semibold text-foreground text-sm mt-1">{w.title}</p>
                        <p className="font-body text-xs text-muted-foreground mt-0.5">{w.instructor} · ฿{w.price.toLocaleString()}</p>
                      </button>
                    ))}
                  </div>
                  {errors.workshop && <p className="text-destructive text-sm mt-2 font-body">{errors.workshop}</p>}
                </section>

                {/* Step 2: Select Date/Time */}
                <section>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-body font-semibold">2</span>
                    เลือกวันและเวลา
                  </h3>
                  {!workshop ? (
                    <p className="text-muted-foreground text-sm font-body italic">กรุณาเลือกคลาสก่อน</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {workshop.slots.map((slot) => (
                        <button
                          key={slot}
                          type="button"
                          onClick={() => { setSelectedSlot(slot); setErrors((prev) => ({ ...prev, slot: undefined })); }}
                          className={cn(
                            "flex items-center gap-3 p-4 rounded-xl border-2 transition-all duration-300 cursor-pointer text-left",
                            selectedSlot === slot
                              ? "border-primary bg-primary/5"
                              : "border-border bg-card hover:border-primary/40"
                          )}
                        >
                          <CalendarDays className="h-5 w-5 text-primary shrink-0" />
                          <span className="font-body text-sm text-foreground">{slot}</span>
                        </button>
                      ))}
                    </div>
                  )}
                  {errors.slot && <p className="text-destructive text-sm mt-2 font-body">{errors.slot}</p>}
                </section>

                {/* Step 3: Personal Info */}
                <section>
                  <h3 className="font-heading text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
                    <span className="h-7 w-7 rounded-full bg-primary text-primary-foreground text-sm flex items-center justify-center font-body font-semibold">3</span>
                    ข้อมูลผู้จอง
                  </h3>
                  <div className="space-y-5">
                    <div>
                      <Label className="font-body text-foreground flex items-center gap-2 mb-1.5">
                        <User className="h-4 w-4 text-primary" /> ชื่อ-นามสกุล
                      </Label>
                      <Input
                        value={name}
                        onChange={(e) => { setName(e.target.value); setErrors((prev) => ({ ...prev, name: undefined })); }}
                        className="h-13 text-base font-body"
                        placeholder="กรุณากรอกชื่อ-นามสกุล"
                        style={{ height: "52px", fontSize: "16px" }}
                      />
                      {errors.name && <p className="text-destructive text-sm mt-1 font-body">{errors.name}</p>}
                    </div>
                    <div>
                      <Label className="font-body text-foreground flex items-center gap-2 mb-1.5">
                        <Phone className="h-4 w-4 text-primary" /> เบอร์โทรศัพท์
                      </Label>
                      <Input
                        value={phone}
                        onChange={(e) => { setPhone(e.target.value); setErrors((prev) => ({ ...prev, phone: undefined })); }}
                        className="h-13 text-base font-body"
                        placeholder="0xx-xxx-xxxx"
                        type="tel"
                        style={{ height: "52px", fontSize: "16px" }}
                      />
                      {errors.phone && <p className="text-destructive text-sm mt-1 font-body">{errors.phone}</p>}
                    </div>
                  </div>
                </section>

                {/* Summary + Submit */}
                {selectedWorkshop && selectedSlot && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-primary/5 border border-primary/20 rounded-2xl p-5 space-y-2 text-sm font-body"
                  >
                    <p className="font-heading font-semibold text-foreground text-base">สรุปการจอง</p>
                    <p className="text-muted-foreground"><span className="text-foreground font-medium">คลาส:</span> {workshop?.emoji} {workshop?.title}</p>
                    <p className="text-muted-foreground"><span className="text-foreground font-medium">วันเวลา:</span> {selectedSlot}</p>
                    <p className="text-muted-foreground"><span className="text-foreground font-medium">ราคา:</span> ฿{workshop?.price?.toLocaleString()}</p>
                  </motion.div>
                )}

                <Button
                  type="submit"
                  className="w-full font-body font-semibold text-base bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                  style={{ height: "56px" }}
                >
                  ✅ ยืนยันการจอง
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}