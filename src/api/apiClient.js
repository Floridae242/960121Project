/**
 * @typedef {{
 *   id: number;
 *   title: string;
 *   chef: string;
 *   level: string;
 *   price: number;
 *   bookedSeats: number;
 *   totalSeats: number;
 *   seatsLeft: number;
 *   category: string;
 *   emoji: string;
 *   tag: string | null;
 *   tagColor: string | null;
 *   rank: string;
 *   image: string;
 *   description: string;
 *   dateText: string;
 *   slots: string[];
 *   isFull: boolean;
 * }} Workshop
 */

/** @param {number} ms */
const wait = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchWorkshops() {
  const response = await fetch("/workshops.json");

  if (!response.ok) {
    throw new Error(`ไม่สามารถโหลดรายการคลาสได้ (${response.status})`);
  }

  const data = /** @type {Workshop[]} */ (await response.json());

  const normalized = data.map((item) => {
    const seatsLeft = item.totalSeats - item.bookedSeats;
    const isFull = item.totalSeats <= item.bookedSeats;
    const isPopular = !isFull && item.bookedSeats > item.totalSeats / 2;

    return {
      ...item,
      seatsLeft,
      isFull,
      tag: isFull ? "คลาสเต็ม" : isPopular ? "ยอดนิยม" : item.tag,
      tagColor: isFull ? "neutral" : isPopular ? "green" : item.tagColor,
    };
  });

  return normalized
    .sort((a, b) => b.bookedSeats - a.bookedSeats)
    .map((item, index) => ({
      ...item,
      rank: `#${index + 1}`,
    }));
}

/**
 * @param {number} id
 * @returns {Promise<Workshop>}
 */
export async function fetchWorkshopById(id) {
  const workshops = await fetchWorkshops();
  const workshop = workshops.find((item) => item.id === id);
  if (!workshop) {
    throw new Error("ไม่พบข้อมูลคลาส");
  }
  return workshop;
}

/** @param {Record<string, any>} payload */
export async function createBooking(payload) {
  await wait(350);
  return {
    bookingId: `BK-${Date.now()}`,
    status: "confirmed",
    ...payload,
  };
}
