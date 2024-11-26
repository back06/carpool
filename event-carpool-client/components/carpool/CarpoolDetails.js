// src/components/carpool/CarpoolDetails.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getCarpoolDetails } from '../../services/api';

function CarpoolDetails() {
  const { carpoolId } = useParams();
  const [carpool, setCarpool] = useState(null);

  useEffect(() => {
    const fetchCarpoolDetails = async () => {
      try {
        const response = await getCarpoolDetails(carpoolId);
        setCarpool(response.data);
      } catch (error) {
        console.error('Error fetching carpool details:', error);
      }
    };
    fetchCarpoolDetails();
  }, [carpoolId]);

  if (!carpool) return <div>Loading...</div>;

  return (
    <div>
      <h2>Carpool Details</h2>
      <p><strong>Driver:</strong> {carpool.driverId.name}</p>
      <p><strong>Route:</strong> {carpool.routeInformation}</p>
      <p><strong>Seats Remaining:</strong> {carpool.seatsAvailable}</p>
      <p><strong>Departure Time:</strong> {new Date(carpool.departureTime).toLocaleString()}</p>

      <h3>Riders</h3>
      <ul>
        {carpool.riders.map(rider => (
          <li key={rider._id}>{rider.name}</li>
        ))}
      </ul>
    </div>
  );
}

export default CarpoolDetails;
