import React, { useContext, useState, useEffect } from 'react';
import {jwtDecode} from 'jwt-decode'; // Import correct de jwt-decode
import { AuthContext } from '../../context/AuthProvider';
import './RoomList.css';

interface Room {
  id: number;
  title: string;
  price: string;
  max_people: number;
  description: string;
  room_numbers: { number: number }[];
  Hotel: { name: string };
}

const RoomList: React.FC = () => {
  const { token } = useContext(AuthContext);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [rooms, setRooms] = useState<Room[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false);
  const [showEditModal, setShowEditModal] = useState<boolean>(false);
  const [showCreateModal, setShowCreateModal] = useState<boolean>(false); // State pour afficher le modal de création
  const [newRoomData, setNewRoomData] = useState({
    title: '',
    price: '',
    max_people: '',
    description: '',
    room_numbers: '',
  });

  useEffect(() => {
    if (token) {
      const decodedToken: any = jwtDecode(token);
      setIsAdmin(decodedToken.isAdmin); // Assurez-vous que votre token JWT contient un champ `isAdmin`
    }
  }, [token]);

  // Récupérer la liste des chambres depuis le backend
  const fetchRooms = async () => {
    try {
      const response = await fetch('http://localhost:8000/api/room', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des chambres');
      }

      const data = await response.json();
      setRooms(data);
    } catch (error) {
      console.error('Erreur lors de la récupération des chambres:', error.message);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNewRoomData({
      ...newRoomData,
      [name]: value,
    });
  };

  const handleSubmitCreate = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetch(`http://localhost:8000/api/room/1`, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newRoomData),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la création de la chambre');
      }

      // Actualiser la liste des chambres après création
      fetchRooms();
      setShowCreateModal(false); // Fermer le modal après la création
    } catch (error) {
      console.error('Erreur lors de la création de la chambre:', error.message);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, [token]); // Recharger les chambres à chaque changement de token

  // Fonction pour afficher les détails d'une chambre dans un modal
  const handleShowDetailModal = async (roomId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/room/${roomId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des détails de la chambre');
      }

      const room = await response.json();
      setSelectedRoom(room);
      setShowDetailModal(true);
    } catch (error) {
      console.error('Erreur lors de la récupération des détails de la chambre:', error.message);
    }
  };

  // Fonction pour fermer le modal de détails
  const handleCloseDetailModal = () => {
    setShowDetailModal(false);
  };

  // Fonction pour afficher le modal de modification d'une chambre
  const handleShowEditModal = (roomId: number) => {
    const room = rooms.find((room) => room.id === roomId);
    setSelectedRoom(room || null);
    setShowEditModal(true);
  };

  // Fonction pour fermer le modal de modification
  const handleCloseEditModal = () => {
    setShowEditModal(false);
  };

  // Fonction pour afficher le modal de création de chambre
  const handleShowCreateModal = () => {
    setShowCreateModal(true);
  };

  // Fonction pour fermer le modal de création de chambre
  const handleCloseCreateModal = () => {
    setShowCreateModal(false);
  };

  // Fonction pour supprimer une chambre
  const handleDelete = async (roomId: number) => {
    try {
      const response = await fetch(`http://localhost:8000/api/room/${roomId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la suppression de la chambre');
      }

      // Actualiser la liste des chambres après suppression
      fetchRooms();
    } catch (error) {
      console.error('Erreur lors de la suppression de la chambre:', error.message);
    }
  };

  // Fonction pour soumettre les modifications d'une chambre
  const handleSubmitEdit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      if (!selectedRoom) return;

      const response = await fetch(`http://localhost:8000/api/room/${selectedRoom.id}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          title: e.currentTarget.title.value,
          price: e.currentTarget.price.value,
          max_people: parseInt(e.currentTarget.max_people.value, 10),
          description: e.currentTarget.description.value,
          room_numbers: selectedRoom.room_numbers,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.message || 'Erreur lors de la mise à jour de la chambre');
      }

      // Actualiser la chambre modifiée dans la liste
      fetchRooms();
    } catch (error) {
      console.error('Erreur lors de la mise à jour de la chambre:', error.message);
    } finally {
      setShowEditModal(false);
    }
  };

  return (
    <div className="room-list">
      {/* Bouton pour afficher le modal de création de chambre */}
      {isAdmin && (
        <button onClick={handleShowCreateModal} className="create-room-btn">
          Créer une chambre
        </button>
      )}

      {rooms.map((room) => (
        <div key={room.id} className="room-card">
          <h2>{room.title}</h2>
          <p>Prix: ${room.price}</p>
          <p>Capacité: {room.max_people} personnes</p>
          <p>Description: {room.description}</p>
          <p>Numéros de chambre: {room.room_numbers.map((num) => num.number).join(', ')}</p>
          <p>Hôtel: {room.Hotel.name}</p>
          {isAdmin && (
            <div>
              <button onClick={() => handleShowEditModal(room.id)}>Modifier</button>
              <button onClick={() => handleDelete(room.id)}>Supprimer</button>
            </div>
          )}
          <button onClick={() => handleShowDetailModal(room.id)}>Voir détails</button>
        </div>
      ))}

      {/* Modal pour afficher les détails de la chambre sélectionnée */}
      {selectedRoom && (
        <div className={`modal ${showDetailModal ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseDetailModal}>&times;</span>
            <h2>{selectedRoom.title}</h2>
            <p>Prix: ${selectedRoom.price}</p>
            <p>Capacité: {selectedRoom.max_people} personnes</p>
            <p>Description: {selectedRoom.description}</p>
            <p>Numéros de chambre: {selectedRoom.room_numbers.map((num) => num.number).join(', ')}</p>
            <p>Hôtel: {selectedRoom.Hotel.name}</p>
          </div>
        </div>
      )}

      {/* Modal pour modifier la chambre sélectionnée */}
      {selectedRoom && (
        <div className={`modal ${showEditModal ? 'show' : ''}`}>
          <div className="modal-content">
            <span className="close" onClick={handleCloseEditModal}>&times;</span>
            <h2>Modifier la chambre {selectedRoom.title}</h2>
            {/* Formulaire de modification de la chambre */}
            <form onSubmit={handleSubmitEdit}>
              <label>Titre:</label>
              <input type="text" name="title" defaultValue={selectedRoom.title} />
              <label>Prix:</label>
              <input type="text" name="price" defaultValue={selectedRoom.price} />
              <label>Capacité:</label>
              <input type="text" name="max_people" defaultValue={selectedRoom.max_people.toString()} />
              <label>Description:</label>
              <textarea name="description" defaultValue={selectedRoom.description} />
              {/* Autres champs à modifier */}
              <button type="submit">Enregistrer les modifications</button>
            </form>
          </div>
        </div>
      )}

      {/* Modal pour créer une nouvelle chambre */}
      <div className={`modal ${showCreateModal ? 'show' : ''}`}>
        <div className="modal-content">
          <span className="close" onClick={handleCloseCreateModal}>&times;</span>
          <h2>Créer une nouvelle chambre</h2>
          <form onSubmit={handleSubmitCreate}>
            <label>Titre:</label>
            <input type="text" name="title" value={newRoomData.title} onChange={handleChange} required />
            <label>Prix:</label>
            <input type="text" name="price" value={newRoomData.price} onChange={handleChange} required />
            <label>Capacité:</label>
            <input type="text" name="max_people" value={newRoomData.max_people} onChange={handleChange} required />
            <label>Description:</label>
            <textarea name="description" value={newRoomData.description} onChange={handleChange} required />
            {/* Autres champs à créer */}
            <button type="submit">Créer la chambre</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default RoomList;
