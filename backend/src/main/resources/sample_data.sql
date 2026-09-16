DROP DATABASE IF EXISTS meeting_booking_db;

CREATE DATABASE meeting_booking_db;

USE meeting_booking_db;

-- ========================================
-- Meeting Room Booking System - Sample Data
-- ========================================

-- Insert Equipment

INSERT INTO equipments (name) VALUES
('Projector'),
('Whiteboard'),
('Video Conferencing'),
('Smartboard'),
('Speaker System'),
('Microphone'),
('TV Screen'),
('Conference Phone'),
('Laptop'),
('Markers'),
('Flipchart');

-- Insert Rooms

INSERT INTO rooms (name, building, floor, capacity) VALUES
('Conference Room A', '1', 'Ground Floor', 10),
('Conference Room B', '1', '1st Floor', 8),
('Conference Room C', '1', '2nd Floor', 15),
('Board Room', '2', 'Ground Floor', 20),
('Training Room 1', '2', '1st Floor', 25),
('Training Room 2', '2', '2nd Floor', 30),
('Meeting Room 101', '3', '1st Floor', 6),
('Meeting Room 102', '3', '1st Floor', 6),
('Meeting Room 201', '3', '2nd Floor', 8),
('Meeting Room 202', '3', '2nd Floor', 8),
('Executive Room', '1', '3rd Floor', 12),
('Innovation Lab', '2', '3rd Floor', 15),
('Small Meeting Room', '1', 'Ground Floor', 4),
('Large Conference Hall', '2', 'Ground Floor', 50),
('Discussion Room', '3', 'Ground Floor', 5);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(1, 1), (1, 2), (1, 3), (1, 10);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(2, 1), (2, 2), (2, 10);

INSERT INTO room_equipments (room_id, equipment_id) VALUES
(3, 1), (3, 4), (3, 3), (3, 5);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(4, 1), (4, 4), (4, 3), (4, 8), (4, 5);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(5, 1), (5, 2), (5, 5), (5, 6), (5, 10);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(6, 1), (6, 4), (6, 5), (6, 6), (6, 9);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(7, 7), (7, 2), (7, 10);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(8, 7), (8, 2), (8, 10);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(9, 1), (9, 2), (9, 3), (9, 10);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(10, 1), (10, 2), (10, 8), (10, 10);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(11, 4), (11, 3), (11, 8), (11, 5), (11, 9);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(12, 1), (12, 4), (12, 2), (12, 10), (12, 11), (12, 9);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(13, 2), (13, 10);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(14, 1), (14, 4), (14, 3), (14, 6), (14, 5), (14, 8);


INSERT INTO room_equipments (room_id, equipment_id) VALUES
(15, 2), (15, 7), (15, 10);



-- ========================================

-- ADDITIONAL QUERIES FOR MODIFICATION

-- ========================================



-- To add a new equipment:

-- INSERT INTO equipments (name) VALUES ('New Equipment Name');



-- To add a new room:

-- INSERT INTO rooms (name, building, floor, capacity) VALUES ('Room Name', 'Building Name', 'Floor', Capacity);



-- To assign equipment to a room:

-- INSERT INTO room_equipments (room_id, equipment_id) VALUES (room_id, equipment_id);



-- To remove equipment from a room:

-- DELETE FROM room_equipments WHERE room_id = ? AND equipment_id = ?;



-- To update room details:

-- UPDATE rooms SET name = 'New Name', building = 'New Building', floor = 'New Floor', capacity = NewCapacity WHERE id = ?;



-- To delete a room (first remove equipment associations):

-- DELETE FROM room_equipments WHERE room_id = ?;

-- DELETE FROM rooms WHERE id = ?;



-- ========================================

-- USEFUL QUERIES FOR VIEWING DATA

-- ========================================



-- View all rooms with their details:

-- SELECT * FROM rooms ORDER BY building, floor, name;



-- View all equipment:

-- SELECT * FROM equipments ORDER BY name;



-- View rooms with their equipment:

-- SELECT r.id, r.name AS room_name, r.building, r.floor, r.capacity,

-- GROUP_CONCAT(e.name SEPARATOR ', ') AS equipments

-- FROM rooms r

-- LEFT JOIN room_equipments re ON r.id = re.room_id

-- LEFT JOIN equipments e ON re.equipment_id = e.id

-- GROUP BY r.id, r.name, r.building, r.floor, r.capacity

-- ORDER BY r.building, r.floor, r.name;



-- Find rooms by capacity:

-- SELECT * FROM rooms WHERE capacity >= 10 ORDER BY capacity;



-- Find rooms in a specific building:

-- SELECT * FROM rooms WHERE building = 'Building 1' ORDER BY floor, name;



-- Find rooms with specific equipment:

-- SELECT r.* FROM rooms r

-- INNER JOIN room_equipments re ON r.id = re.room_id

-- INNER JOIN equipments e ON re.equipment_id = e.id

-- WHERE e.name = 'Projector';

