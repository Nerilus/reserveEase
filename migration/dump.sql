DROP TABLE IF EXISTS rooms, users, hotels CASCADE;

CREATE TABLE IF NOT EXISTS hotels (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  distance VARCHAR(255) NOT NULL,
  photos TEXT[],
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  cheapest_price NUMERIC NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des hôtels
INSERT INTO hotels (name, type, city, address, distance, photos, title, description, rating, cheapest_price, featured)
VALUES 
('Test Hotel 1', 'Hotel', 'Test City', 'Test Address 1', '500m', ARRAY['photo1.jpg', 'photo2.jpg'], 'Test Title 1', 'Test Description 1', 4.5, 200, true),
('Test Hotel 2', 'Hotel', 'Test City 2', 'Test Address 2', '1km', ARRAY['photo3.jpg', 'photo4.jpg'], 'Test Title 2', 'Test Description 2', 4.0, 150, false);

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

-- Insérer des chambres de test
INSERT INTO rooms (hotel_id, title, price, max_people, description, room_numbers, created_at, updated_at)
VALUES 
(1, 'Test Room 1', 100, 2, 'Test Description Room 1', '[{"number": 101, "unavailableDates": ["2024-07-01", "2024-07-02"]}]', NOW(), NOW()),
(2, 'Test Room 2', 150, 3, 'Test Description Room 2', '[{"number": 201, "unavailableDates": ["2024-07-10"]}]', NOW(), NOW());

CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(255) NOT NULL,
  img VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT FALSE,
  reset_password_token VARCHAR(255),
  reset_password_expires VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Insertion des utilisateurs (commenté pour éviter d'insérer des utilisateurs par défaut)
-- INSERT INTO users (username, email, country, img, city, phone, password, is_admin, created_at, updated_at) VALUES
-- ('john_doe', 'john@example.com', 'USA', 'john.jpg', 'New York', '123-456-7890', 'password123', false, NOW(), NOW()),
-- ('jane_smith', 'jane@example.com', 'UK', 'jane.jpg', 'London', '987-654-3210', 'securepass', true, NOW(), NOW());
