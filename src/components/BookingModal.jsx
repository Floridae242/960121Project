/**
 * BookingModal.jsx — Modal แสดงรายละเอียดคลาสก่อนไปหน้าจอง
 *
 * Modal นี้ทำหน้าที่ preview workshop สั้น ๆ แล้ว navigate ไปหน้า /booking
 * ไม่เรียก createBooking โดยตรง เพราะ API ต้องการ slotId และ seats
 * ซึ่งผู้ใช้ต้องเลือกใน /booking page
 */

import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export default function BookingModal({ workshop, open, onOpenChange }) {
  const navigate = useNavigate();

  // นำผู้ใช้ไปหน้า /booking พร้อม pre-select workshop
  const handleGoToBooking = () => {
    onOpenChange(false);
    navigate(`/booking?workshopId=${workshop?.id}`);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>จองคลาสเรียน</DialogTitle>
          <DialogDescription>
            คุณกำลังจะจองคลาส{" "}
            <span className="font-semibold text-foreground">{workshop?.title}</span>
            <br />
            <span className="text-xs mt-1 block">
              สอนโดย {workshop?.chef} · ฿{workshop?.price?.toLocaleString()} / ที่นั่ง
            </span>
          </DialogDescription>
        </DialogHeader>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            ยกเลิก
          </Button>
          <Button
            onClick={handleGoToBooking}
            style={{ backgroundColor: '#C9943A', color: '#0A0806' }}
          >
            เลือกวันและที่นั่ง →
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
