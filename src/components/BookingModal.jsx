import { useState } from "react";

import { createBooking } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingModal({ workshop, open, onOpenChange, onBooked }) {
  const [isSaving, setIsSaving] = useState(false);

  const handleConfirm = async () => {
    if (!workshop) {
      return;
    }

    setIsSaving(true);
    const booking = await createBooking({ workshopId: workshop.id, workshopName: workshop.title });
    onBooked(booking);
    setIsSaving(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>ยืนยันการจองคลาส</DialogTitle>
          <DialogDescription>
            คุณกำลังจองคลาส <span className="font-semibold">{workshop?.title}</span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button className="bg-amber-700 hover:bg-amber-800" onClick={handleConfirm} disabled={isSaving}>
            {isSaving ? "กำลังจอง..." : "ยืนยัน"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
