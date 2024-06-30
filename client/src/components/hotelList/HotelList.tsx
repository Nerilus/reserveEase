import React, { useEffect, useState } from 'react';
import './hotelList.css';

const HotelList = () => {
    const [hotels, setHotels] = useState<any[]>([]);
    const [selectedHotel, setSelectedHotel] = useState<any>(null);
    const [showModal, setShowModal] = useState(false);
  
    useEffect(() => {
      fetch("http://localhost:8000/api/hotels/")
        .then(response => response.json())
        .then(data => setHotels(data))
        .catch(error => console.error('Erreur lors de la récupération des hôtels:', error));
    }, []);
  
    const handleHotelClick = (id: number) => {
      fetch(`http://localhost:8000/api/hotels/${id}`)
        .then(response => response.json())
        .then(data => {
          setSelectedHotel(data);
          setShowModal(true);
        })
        .catch(error => console.error('Erreur lors de la récupération de l\'hôtel:', error));
    };
  
    const closeModal = () => {
      setShowModal(false);
      setSelectedHotel(null);
    };
  
    const renderModal = () => {
      if (!selectedHotel) return null;
  
      return (
        <div className="modal">
          <div className="modal-content">
            <span className="close" onClick={closeModal}>&times;</span>
            <h2>{selectedHotel.name}</h2>
            <p>{selectedHotel.type}</p>
            <p>{selectedHotel.city}</p>
            <p>{selectedHotel.address}</p>
            <p>Distance: {selectedHotel.distance}</p>
            <p>Rating: {selectedHotel.rating}</p>
            <p>Cheapest Price: ${selectedHotel.cheapest_price}</p>
            {selectedHotel.photos && selectedHotel.photos.length > 0 && (
              <div className="hotel-photos">
                {selectedHotel.photos.map((photo: string, index: number) => (
                  <img key={index} src={`http://localhost:8000/${photo}`} alt={`Hotel ${index + 1}`} />
                ))}
              </div>
            )}
          </div>
        </div>
      );
    };
  
    return (
      <div className="hotel-list">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="hotel-card" onClick={() => handleHotelClick(hotel.id)}>
            <div className="hotel-image">
              <img src={`http://localhost:8000/${hotel.photos && hotel.photos.length > 0 ? hotel.photos[0] : 'placeholder.jpg'}`} alt={hotel.name} />
            </div>
            <div className="hotel-details">
              <h2>{hotel.name}</h2>
              <p>{hotel.type}</p>
              <p>{hotel.city}</p>
              <p>{hotel.address}</p>
              <p>Distance: {hotel.distance}</p>
              <p>Rating: {hotel.rating}</p>
              <p>Cheapest Price: ${hotel.cheapest_price}</p>
            </div>
          </div>
        ))}
        {showModal && renderModal()}
      </div>
    );
  };
  
  export default HotelList;