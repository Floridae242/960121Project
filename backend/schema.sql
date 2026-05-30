-- =============================================================
-- 960121 Mini Project — Pang-La-Ong Workshop Marketplace
-- Lead Architect: Tle (Backend/DevOps)
-- Schema version: 1.0
-- =============================================================

-- Drop in reverse dependency order for clean re-runs
DROP TABLE IF EXISTS bookings;
DROP TABLE IF EXISTS workshop_slots;
DROP TABLE IF EXISTS workshops;
DROP TABLE IF EXISTS users;

-- -------------------------------------------------------------
-- 1. users
--    Stores registered accounts.
--    password_hash: bcrypt output — never store plain text.
-- -------------------------------------------------------------
CREATE TABLE users (
  id            INT           NOT NULL AUTO_INCREMENT,
  name          VARCHAR(100)  NOT NULL,
  email         VARCHAR(255)  NOT NULL,
  password_hash VARCHAR(255)  NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_users_email (email)
);

-- -------------------------------------------------------------
-- 2. workshops
--    One row per class/workshop offering.
--    max_capacity: the hard ceiling enforced by BookingService
--    (the Gatekeeper check: SUM(booked seats) < max_capacity).
-- -------------------------------------------------------------
CREATE TABLE workshops (
  id            INT           NOT NULL AUTO_INCREMENT,
  title         VARCHAR(255)  NOT NULL,
  chef          VARCHAR(100)  NOT NULL,
  level         VARCHAR(50)   NOT NULL,      -- 'เริ่มต้น' | 'ระดับกลาง' | 'ระดับสูง'
  price         INT           NOT NULL,      -- THB per seat
  max_capacity  INT           NOT NULL,      -- total seats available
  category      VARCHAR(100)  NOT NULL,
  emoji         VARCHAR(10)   NOT NULL,
  image         VARCHAR(500)  NOT NULL,
  description   TEXT          NOT NULL,
  created_at    DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  CONSTRAINT chk_workshops_price     CHECK (price > 0),
  CONSTRAINT chk_workshops_capacity  CHECK (max_capacity > 0)
);

-- -------------------------------------------------------------
-- 3. workshop_slots
--    Each workshop can have multiple date/time offerings.
--    FK → workshops: a slot cannot exist without a parent workshop.
-- -------------------------------------------------------------
CREATE TABLE workshop_slots (
  id          INT           NOT NULL AUTO_INCREMENT,
  workshop_id INT           NOT NULL,
  slot_text   VARCHAR(100)  NOT NULL,  -- e.g. "15 มิ.ย. 2026 | 09:00 - 16:00"

  PRIMARY KEY (id),
  CONSTRAINT fk_slots_workshop
    FOREIGN KEY (workshop_id) REFERENCES workshops (id)
    ON DELETE CASCADE
);

-- -------------------------------------------------------------
-- 4. bookings
--    One row per confirmed booking transaction.
--
--    GATEKEEPER RULE (enforced in BookingService, not here):
--      Before INSERT, the service runs:
--        SELECT SUM(seat_count) FROM bookings
--        WHERE workshop_id = ? AND slot_id = ? AND status = 'confirmed'
--      If result >= workshops.max_capacity → reject with 409 Conflict.
--
--    total_price: always re-calculated on the server
--      (price_per_seat × seat_count) — never trust the client value.
--
--    seats_json: stores the selected seat IDs as a JSON array
--      e.g. '["A1","A2"]' — kept as VARCHAR for portability.
--
--    booking_ref: human-readable unique reference (BK-<timestamp>-<userId>).
-- -------------------------------------------------------------
CREATE TABLE bookings (
  id           INT           NOT NULL AUTO_INCREMENT,
  booking_ref  VARCHAR(50)   NOT NULL,
  user_id      INT           NOT NULL,
  workshop_id  INT           NOT NULL,
  slot_id      INT           NOT NULL,
  seats_json   VARCHAR(255)  NOT NULL,  -- JSON array of seat IDs
  seat_count   INT           NOT NULL,
  total_price  INT           NOT NULL,  -- server-calculated, never from client
  status       VARCHAR(20)   NOT NULL DEFAULT 'confirmed',  -- 'confirmed' | 'cancelled'
  created_at   DATETIME      NOT NULL DEFAULT CURRENT_TIMESTAMP,

  PRIMARY KEY (id),
  UNIQUE KEY uq_bookings_ref (booking_ref),

  CONSTRAINT fk_bookings_user
    FOREIGN KEY (user_id)     REFERENCES users (id),
  CONSTRAINT fk_bookings_workshop
    FOREIGN KEY (workshop_id) REFERENCES workshops (id),
  CONSTRAINT fk_bookings_slot
    FOREIGN KEY (slot_id)     REFERENCES workshop_slots (id),

  CONSTRAINT chk_bookings_seat_count  CHECK (seat_count > 0),
  CONSTRAINT chk_bookings_total_price CHECK (total_price > 0),
  CONSTRAINT chk_bookings_status      CHECK (status IN ('confirmed', 'cancelled'))
);

-- -------------------------------------------------------------
-- Indexes for query performance
-- BookingService capacity check: WHERE workshop_id AND slot_id AND status
-- -------------------------------------------------------------
CREATE INDEX idx_bookings_capacity_check
  ON bookings (workshop_id, slot_id, status);

CREATE INDEX idx_bookings_user
  ON bookings (user_id);
