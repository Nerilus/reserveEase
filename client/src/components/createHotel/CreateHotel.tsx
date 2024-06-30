// CreateHotel.tsx

import React, { useState, useContext } from 'react';
import { AuthContext } from '../../context/AuthProvider';
import './createHotel.css'

const CreateHotel = () => {
  const { token, currentUserAdmin } = useContext(AuthContext);
  const [hotelData, setHotelData] = useState({
    name: '',
    type: '',
    city: '',
    address: '',
    room: '',
    photos: [],
    description: '',
    rating: 0,
    cheapest_price: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setHotelData({
      ...hotelData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setHotelData({
        ...hotelData,
        photos: Array.from(e.target.files),
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!currentUserAdmin) {
      alert('Only admins can create hotels');
      return;
    }

    const formData = new FormData();
    formData.append('name', hotelData.name);
    formData.append('type', hotelData.type);
    formData.append('city', hotelData.city);
    formData.append('address', hotelData.address);
    formData.append('room', hotelData.room);
    formData.append('description', hotelData.description);
    formData.append('rating', hotelData.rating.toString());
    formData.append('cheapest_price', hotelData.cheapest_price.toString());


    hotelData.photos.forEach(photo => {
      formData.append('photos', photo);
    });

    try {
      const response = await fetch('http://localhost:8000/api/hotels', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        const { message } = await response.json();
        throw new Error(message || 'Failed to create hotel');
      }

      alert('Hotel created successfully');
    } catch (err) {
      console.error(err.message);
      alert('Error creating hotel');
    }
  };

  if (!currentUserAdmin) {
    return <p>Access denied. Only admins can create hotels.</p>;
  }

  return (
    <form onSubmit={handleSubmit}>
      <input 
        name="name" 
        value={hotelData.name} 
        onChange={handleChange} 
        placeholder="Name" 
        required 
      />
      <input 
        name="type" 
        value={hotelData.type} 
        onChange={handleChange} 
        placeholder="Type" 
        required 
      />
      <input 
        name="city" 
        value={hotelData.city} 
        onChange={handleChange} 
        placeholder="City" 
        required 
      />
      <input 
        name="address" 
        value={hotelData.address} 
        onChange={handleChange} 
        placeholder="Address" 
        required 
      />
      <input 
        name="room" 
        value={hotelData.room} 
        onChange={handleChange} 
        placeholder="Distance" 
        required 
      />
      <textarea 
        name="description" 
        value={hotelData.description} 
        onChange={handleChange} 
        placeholder="Description" 
        required 
      />
      <input 
        type="number" 
        name="rating" 
        value={hotelData.rating} 
        onChange={handleChange} 
        placeholder="Rating" 
        min="0" 
        max="5" 
        required 
      />
      <input 
        type="number" 
        name="cheapest_price" 
        value={hotelData.cheapest_price} 
        onChange={handleChange} 
        placeholder="Cheapest Price" 
        required 
      />
      <input 
        type="file" 
        name="photos" 
        multiple 
        onChange={handleFileChange} 
        required 
      />
      <button type="submit">Create Hotel</button>
    </form>
  );
};

export default CreateHotel;