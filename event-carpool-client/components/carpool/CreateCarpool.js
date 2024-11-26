// src/components/carpool/CreateCarpool.js
import React, { useState } from 'react';
import { createCarpool } from '../../services/api';
import { useNavigate, useParams } from 'react-router-dom';

function CreateCarpool() {
  const { eventId } = useParams(); // Get eventId from the route
  const driverId = localStorage.getItem('userId'); // Get driverId from local storage
  const [seatsAvailable, setSeatsAvailable] = useState(1);
  const [routeInformation, setRouteInformation] = useState('');
  const [departureTime, setDepartureTime] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    
    e.preventDefault();
    try {
      const data = {
        eventId,
        driverId,
        seatsAvailable,
        routeInformation,
        departureTime,
      };
      await createCarpool(data);
      navigate(`/events/${eventId}`);
    } catch (error) {
      console.error('Error creating carpool:', error);
      alert(error.response?.data.message || "Failed to create carpool");
    }
  };

  return (
    <div class="create-event-container">
      <h2>Create Carpool</h2>
      <form class="create-event-form" onSubmit={handleSubmit}>
        <input type="number" placeholder="Seats Available" value={seatsAvailable} onChange={(e) => setSeatsAvailable(e.target.value)} min="1" required />
        <input type="text" placeholder="Route information" value={routeInformation} onChange={(e) => setRouteInformation(e.target.value)} required />
        <input type="datetime-local" placeholder="Deature time" value={departureTime} onChange={(e) => setDepartureTime(e.target.value)} required />
        <button type="submit">Create Carpool</button>
      </form>
    </div>
  );
}

export default CreateCarpool;