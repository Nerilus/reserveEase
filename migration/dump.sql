CREATE TABLE Hotel (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  type VARCHAR(255) NOT NULL,
  city VARCHAR(255) NOT NULL,
  address VARCHAR(255) NOT NULL,
  distance VARCHAR(255) NOT NULL,
  photos TEXT[], -- Storing array of strings
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL, -- Changed 'desc' to 'description'
  rating NUMERIC CHECK (rating >= 0 AND rating <= 5),
  rooms TEXT[], -- Storing array of strings
  cheapestPrice NUMERIC NOT NULL,
  featured BOOLEAN DEFAULT FALSE
);

CREATE TABLE Room (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  price NUMERIC NOT NULL,
  maxPeople INTEGER NOT NULL,
  description TEXT NOT NULL, -- Changed 'desc' to 'description'
  roomNumbers JSONB, -- Using JSONB to store the array of objects
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE "User" (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) NOT NULL UNIQUE,
  email VARCHAR(255) NOT NULL UNIQUE,
  country VARCHAR(255) NOT NULL,
  img VARCHAR(255),
  city VARCHAR(255) NOT NULL,
  phone VARCHAR(255) NOT NULL,
  password VARCHAR(255) NOT NULL,
  isAdmin BOOLEAN DEFAULT FALSE,
  createdAt TIMESTAMPTZ DEFAULT NOW(),
  updatedAt TIMESTAMPTZ DEFAULT NOW()
);

INSERT INTO Hotel (name, type, city, address, distance, photos, title, description, rating, rooms, cheapestPrice, featured) VALUES
('Grand Plaza', 'Hotel', 'New York', '123 Main St', '500m', '{"photo1.jpg", "photo2.jpg"}', 'Luxury Stay', 'A luxurious stay in the heart of the city', 4.5, '{"Room1", "Room2"}', 200, true),
('Budget Inn', 'Motel', 'Los Angeles', '456 Elm St', '2km', '{"photo3.jpg", "photo4.jpg"}', 'Affordable Comfort', 'Comfortable and affordable rooms', 3.8, '{"Room3", "Room4"}', 80, false);

INSERT INTO Room (title, price, maxPeople, description, roomNumbers, createdAt, updatedAt) VALUES
('Deluxe Suite', 300, 4, 'Spacious suite with sea view', '[{"number": 101, "unavailableDates": ["2024-07-01", "2024-07-02"]}, {"number": 102, "unavailableDates": ["2024-07-05"]}]', NOW(), NOW()),
('Standard Room', 120, 2, 'Comfortable room with city view', '[{"number": 201, "unavailableDates": []}, {"number": 202, "unavailableDates": ["2024-07-10"]}]', NOW(), NOW());

INSERT INTO "User" (username, email, country, img, city, phone, password, isAdmin, createdAt, updatedAt) VALUES
('john_doe', 'john@example.com', 'USA', 'john.jpg', 'New York', '123-456-7890', 'password123', false, NOW(), NOW()),
('jane_smith', 'jane@example.com', 'UK', 'jane.jpg', 'London', '987-654-3210', 'securepass', true, NOW(), NOW());
