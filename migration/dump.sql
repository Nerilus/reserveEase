DROP TABLE IF EXISTS hotels, rooms, users CASCADE;

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
  rooms TEXT[],
  cheapest_price NUMERIC NOT NULL,
  featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO hotels (name, type, city, address, distance, photos, title, description, rating, rooms, cheapest_price, featured)
SELECT 'Grand Plaza', 'Hotel', 'New York', '123 Main St', '500m', ARRAY['photo1.jpg', 'photo2.jpg'], 'Luxury Stay', 'A luxurious stay in the heart of the city', 4.5, ARRAY['Room1', 'Room2'], 200, true
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE name = 'Grand Plaza');

INSERT INTO hotels (name, type, city, address, distance, photos, title, description, rating, rooms, cheapest_price, featured)
SELECT 'Budget Inn', 'Motel', 'Los Angeles', '456 Elm St', '2km', ARRAY['photo3.jpg', 'photo4.jpg'], 'Affordable Comfort', 'Comfortable and affordable rooms', 3.8, ARRAY['Room3', 'Room4'], 80, false
WHERE NOT EXISTS (SELECT 1 FROM hotels WHERE name = 'Budget Inn');


CREATE TABLE IF NOT EXISTS rooms (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  max_people INTEGER NOT NULL,
  description TEXT NOT NULL,
  room_numbers JSONB NOT NULL,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

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
  reset_password_token  VARCHAR(255),
  reset_password_expires VARCHAR(255),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);



INSERT INTO rooms (title, price, max_people, description, room_numbers, created_at, updated_at) VALUES
('Deluxe Suite', 300, 4, 'Spacious suite with sea view', '[{"number": 101, "unavailableDates": ["2024-07-01", "2024-07-02"]}, {"number": 102, "unavailableDates": ["2024-07-05"]}]', NOW(), NOW()),
('Standard Room', 120, 2, 'Comfortable room with city view', '[{"number": 201, "unavailableDates": []}, {"number": 202, "unavailableDates": ["2024-07-10"]}]', NOW(), NOW());

-- INSERT INTO users (username, email, country, img, city, phone, password, is_admin, created_at, updated_at) VALUES
-- ('john_doe', 'john@example.com', 'USA', 'john.jpg', 'New York', '123-456-7890', 'password123', false, NOW(), NOW()),
-- ('jane_smith', 'jane@example.com', 'UK', 'jane.jpg', 'London', '987-654-3210', 'securepass', true, NOW(), NOW());
