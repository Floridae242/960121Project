const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

const workshops = [
  {
    id: "class-001",
    title: "พื้นฐานซาวโดวจ์โฮมเมด",
    chef: "เชฟมิ้นท์",
    level: "เริ่มต้น",
    price: 1290,
    seatsLeft: 5,
    category: "ขนมปัง",
  },
  {
    id: "class-002",
    title: "เวิร์กชอปครัวซองต์เนยสด",
    chef: "เชฟนุก",
    level: "ระดับกลาง",
    price: 1690,
    seatsLeft: 3,
    category: "ครัวซองต์",
  },
  {
    id: "class-003",
    title: "ชีสเค้กชาไทยหน้าไหม้",
    chef: "เชฟบีม",
    level: "ทุกระดับ",
    price: 1450,
    seatsLeft: 7,
    category: "เค้ก",
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
