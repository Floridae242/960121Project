const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const workshops = [
  {
    id: 1,
    title: "โครยซองต์ มาสเตอร์คลาส",
    chef: "เชฟ พงศธร",
    level: "ระดับกลาง",
    price: 3500,
    bookedSeats: 9,
    totalSeats: 12,
    seatsLeft: 3,
    category: "เบเกอรี่ฝรั่งเศส",
    emoji: "🥐",
    tag: "เหลือน้อยมาก!",
    tagColor: "red",
    rank: "#1",
    image: "https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80",
    description: "เรียนรู้ความลับของเลเยอร์ที่สมบูรณ์แบบและการนวดเนยสไตล์ฝรั่งเศสขนานแท้",
    dateText: "15 มิ.ย. 2026 | 09:00 - 16:00",
    isFull: false,
  },
  {
    id: 4,
    title: "ห้องปฏิบัติการมาการอง",
    chef: "เชฟ ปาริชาต",
    level: "ระดับกลาง",
    price: 4200,
    bookedSeats: 5,
    totalSeats: 10,
    seatsLeft: 5,
    category: "เค้กและขนมหวาน",
    emoji: "🎂",
    tag: "ขายดีที่สุด",
    tagColor: "orange",
    rank: "#2",
    image: "https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80",
    description: "ฝึกทำมาการองฝรั่งเศสให้ได้ผิวเรียบ เท้าสวย พร้อมไส้ครีมหลากรส",
    dateText: "6 ก.ค. 2026 | 10:00 - 16:00",
    isFull: false,
  },
  {
    id: 2,
    title: "เวิร์กชอปโดนัทเคลือบน้ำตาล",
    chef: "เชฟ นภัสสร",
    level: "เริ่มต้น",
    price: 2800,
    bookedSeats: 7,
    totalSeats: 15,
    seatsLeft: 8,
    category: "โดนัทและฟริตเตอร์",
    emoji: "🍩",
    tag: "ยอดนิยม",
    tagColor: "green",
    rank: "#3",
    image: "https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80",
    description: "สนุกกับการปั้นและเคลือบโดนัทหลากรสชาติ พร้อมเทคนิคการทอดให้ฟูนุ่ม",
    dateText: "22 มิ.ย. 2026 | 10:00 - 15:00",
    isFull: false,
  },
  {
    id: 3,
    title: "ขนมปังซาวร์โดว์เบื้องต้น",
    chef: "เชฟ ธนวัฒน์",
    level: "เริ่มต้น",
    price: 2500,
    bookedSeats: 10,
    totalSeats: 10,
    seatsLeft: 0,
    category: "ขนมปังอบ",
    emoji: "🍞",
    tag: null,
    tagColor: null,
    rank: "#4",
    image: "https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80",
    description: "เริ่มต้นทำขนมปังซาวร์โดว์ตั้งแต่การเลี้ยงหัวเชื้อจนถึงการอบให้ได้เปลือกกรอบ",
    dateText: "29 มิ.ย. 2026 | 09:00 - 17:00",
    isFull: true,
  },
];

export async function fetchWorkshops() {
  await wait(250);
  return workshops;
}

export async function createBooking(payload) {
  await wait(350);
  return {
    bookingId: `BK-${Date.now()}`,
    status: "confirmed",
    ...payload,
  };
}
