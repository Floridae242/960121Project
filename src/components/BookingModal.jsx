import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CalendarDays, User, Banknote } from "lucide-react";
import SeatBadge from "./SeatBadge";
import { AnimatePresence, motion } from "framer-motion";

export default function BookingModal({ workshop, open, onClose, onConfirm }) {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [confirmed, setConfirmed] = useState(false);

  if (!workshop) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onConfirm(workshop.id);
    setConfirmed(true);
    setTimeout(() => {
      setConfirmed(false);
      setName("");
      setEmail("");
      onClose();
    }, 1800);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="font-body bg-card border-border sm:max-w-lg">
        <AnimatePresence mode="wait">
          {confirmed ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center py-10 gap-4"
            >
              <div className="text-5xl">✨</div>
              <h3 className="font-heading text-2xl font-semibold text-foreground">จองสำเร็จ!</h3>
              <p className="text-muted-foreground">ขอบคุณที่จองคลาส {workshop.title}</p>
            </motion.div>
          ) : (
            <motion.div key="form" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <DialogHeader>
                <DialogTitle className="font-heading text-xl font-semibold text-foreground">
                  {workshop.emoji} {workshop.title}
                </DialogTitle>
              </DialogHeader>

              <div className="mt-4 space-y-3 text-sm text-muted-foreground">
                <p>{workshop.description}</p>
                <div className="flex items-center gap-2"><User className="h-4 w-4" /> {workshop.instructor}</div>
                <div className="flex items-center gap-2"><CalendarDays className="h-4 w-4" /> {workshop.date}</div>
                <div className="flex items-center gap-2"><Banknote className="h-4 w-4" /> ฿{workshop.price.toLocaleString()}</div>
                <SeatBadge seats={workshop.seats} totalSeats={workshop.totalSeats} />
              </div>

              <form onSubmit={handleSubmit} className="mt-6 space-y-4">
                <div>
                  <Label className="font-body text-foreground">ชื่อ-นามสกุล</Label>
                  <Input
                    required value={name} onChange={(e) => setName(e.target.value)}
                    className="mt-1 h-12 text-base font-body border-b-2 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
                    placeholder="กรุณากรอกชื่อ"
                  />
                </div>
                <div>
                  <Label className="font-body text-foreground">อีเมล</Label>
                  <Input
                    required type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    className="mt-1 h-12 text-base font-body border-b-2 border-t-0 border-x-0 rounded-none bg-transparent focus-visible:ring-0 focus-visible:border-primary"
                    placeholder="example@email.com"
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base font-body font-semibold bg-primary text-primary-foreground hover:opacity-90 transition-opacity"
                >
                  ยืนยันการจอง
                </Button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </DialogContent>
    </Dialog>
  );
}