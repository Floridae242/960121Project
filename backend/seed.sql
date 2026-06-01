-- =============================================================
-- Seed data — matches public/workshops.json
-- Run AFTER schema.sql
-- =============================================================

-- Workshops
INSERT INTO workshops (id, title, chef, level, price, max_capacity, category, emoji, image, description) VALUES
(1, 'โครยซองต์ มาสเตอร์คลาส',      'เชฟ พงศธร',  'ระดับกลาง', 3500, 12, 'เบเกอรี่ฝรั่งเศส',    '🥐', 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?auto=format&fit=crop&w=600&q=80', 'เรียนรู้ความลับของเลเยอร์ที่สมบูรณ์แบบและการนวดเนยสไตล์ฝรั่งเศสขนานแท้'),
(2, 'เวิร์กชอปโดนัทเคลือบน้ำตาล', 'เชฟ นภัสสร', 'เริ่มต้น',   2800, 15, 'โดนัทและฟริตเตอร์',   '🍩', 'https://images.unsplash.com/photo-1551024601-bec78aea704b?auto=format&fit=crop&w=600&q=80', 'สนุกกับการปั้นและเคลือบโดนัทหลากรสชาติ พร้อมเทคนิคการทอดให้ฟูนุ่ม'),
(3, 'ขนมปังซาวร์โดว์เบื้องต้น',    'เชฟ ธนวัฒน์', 'เริ่มต้น',  2500, 10, 'ขนมปังอบ',            '🍞', 'https://images.unsplash.com/photo-1549931319-a545dcf3bc73?auto=format&fit=crop&w=600&q=80', 'เริ่มต้นทำขนมปังซาวร์โดว์ตั้งแต่การเลี้ยงหัวเชื้อจนถึงการอบให้ได้เปลือกกรอบ'),
(4, 'ห้องปฏิบัติการมาการอง',        'เชฟ ปาริชาต', 'ระดับกลาง', 4200, 10, 'เค้กและขนมหวาน',     '🎂', 'https://images.unsplash.com/photo-1569864358642-9d1684040f43?auto=format&fit=crop&w=600&q=80', 'ฝึกทำมาการองฝรั่งเศสให้ได้ผิวเรียบ เท้าสวย พร้อมไส้ครีมหลากรส');

-- Slots (two per workshop)
INSERT INTO workshop_slots (workshop_id, slot_text) VALUES
(1, '15 มิ.ย. 2026 | 09:00 - 16:00'),
(1, '29 มิ.ย. 2026 | 09:00 - 16:00'),
(2, '22 มิ.ย. 2026 | 10:00 - 15:00'),
(2, '13 ก.ค. 2026 | 10:00 - 15:00'),
(3, '29 มิ.ย. 2026 | 09:00 - 17:00'),
(3, '20 ก.ค. 2026 | 09:00 - 17:00'),
(4, '6 ก.ค. 2026 | 10:00 - 16:00'),
(4, '27 ก.ค. 2026 | 10:00 - 16:00');

-- Sample bookings to simulate existing booked seats
-- (matches bookedSeats in workshops.json: id1=4, id2=7, id3=10, id4=5)
-- Uses a placeholder user_id=1 (create a seed user first if needed)

-- Seed user (password_hash is bcrypt of "password123" — replace before going live)
INSERT INTO users (id, name, email, password_hash) VALUES
(1, 'Test User', 'test@example.com', '$2b$10$placeholder.hash.replace.this.before.golive');

INSERT INTO bookings (booking_ref, user_id, workshop_id, slot_id, seats_json, seat_count, total_price) VALUES
('BK-SEED-001', 1, 1, 1, '["A1","A3","A4","B1"]',      4, 14000),
('BK-SEED-002', 1, 2, 3, '["A1","A3","B2","B4","C1","C3","C5"]', 7, 19600),
('BK-SEED-003', 1, 3, 5, '["A1","A2","A3","A4","A5","B1","B2","B3","B4","B5"]', 10, 25000),
('BK-SEED-004', 1, 4, 7, '["A1","A3","A5","B2","B4"]', 5, 21000);
