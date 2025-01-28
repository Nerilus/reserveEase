DROP TABLE IF EXISTS rooms, users, hotels CASCADE;

-- Table Hotels
CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  room VARCHAR(255) NOT NULL,
  photos TEXT[],
  description TEXT NOT NULL,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  cheapest_price NUMERIC NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des hôtels
-- INSERT INTO hotels (name, type, city, address, room, photos,  description, rating, cheapest_price, featured)
-- VALUES 
-- ('Hotel de Paris', 'Hotel', 'Paris', '123 Rue de Paris', '500m', ARRAY['paris1.jpg', 'paris2.jpg'], 'Luxury Stay in Paris', 'A luxurious hotel in the heart of Paris', 4.8, 300, true),
-- ('London Bridge Hotel', 'Hotel', 'London', '456 London Bridge', '1km', ARRAY['london1.jpg', 'london2.jpg'], 'Comfort and Elegance', 'Comfortable and elegant hotel near London Bridge', 4.5, 250, false);

-- Table Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  hotel_id INTEGER NOT NULL,
  title VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  max_people INTEGER NOT NULL,
  description TEXT NOT NULL,
  room_numbers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  CONSTRAINT fk_hotel
    FOREIGN KEY(hotel_id) 
    REFERENCES hotels(id)
);

-- Insertion des chambres
INSERT INTO rooms (hotel_id, title, price, max_people, description, room_numbers, created_at, updated_at)
VALUES 
((SELECT id FROM hotels WHERE name = 'Hotel de Paris'), 'Deluxe Room', 200, 2, 'A deluxe room with all amenities.', '[{"number": 101, "unavailableDates": ["2024-07-01", "2024-07-02"]}]', NOW(), NOW()),
((SELECT id FROM hotels WHERE name = 'London Bridge Hotel'), 'Suite', 400, 4, 'A luxurious suite with stunning views.', '[{"number": 201, "unavailableDates": ["2024-07-10"]}]', NOW(), NOW());

-- Table Users
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(255), 
  img VARCHAR(255),
  city VARCHAR(255), 
  phone VARCHAR(255), 
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  reset_password_token VARCHAR(255),
  reset_password_expires TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);
