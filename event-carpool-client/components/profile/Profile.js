// src/components/profile/Profile.js
import '../../styles/profile.css'
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchUserProfile } from '../../services/api';

function Profile() {
  const [userData, setUserData] = useState(null);
  const [joinedCarpools, setJoinedCarpools] = useState([]);
  const [createdCarpools, setCreatedCarpools] = useState([]);
  const userId = localStorage.getItem('userId');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const response = await fetchUserProfile(userId);
        console.log(response.data)
        setUserData(response.data.user);
        setJoinedCarpools(response.data.joinedCarpools);
        setCreatedCarpools(response.data.createdCarpools);
      } catch (error) {
        console.error('Error fetching profile data:', error);
      }
    };

    fetchProfileData();
  }, [userId]);

  if (!userData) return <div>Loading...</div>;

  return(
    <div class="profile-container">
      <div class="header-container">
        <button className="back-btn" onClick={() => navigate('/events')}>Back to Events</button>
        <h1 class="welcome-text">Welcome, {userData.name}!</h1>
      </div>

      <p class="profile-info"><strong>Email:</strong> {userData.email}</p>
      <p class="profile-info"><strong>Phone:</strong> {userData.phone}</p>

      <h3 class="section-title">Carpools You Joined:</h3>
      {joinedCarpools.length > 0 ? (
        <ul class="carpool-list">
          {joinedCarpools.map((carpool) => (
            <li key={carpool._id} class="carpool-item">
              <p><strong>Event ID:</strong> {carpool.eventId._id}</p>
              <p><strong>Carpool ID:</strong> {carpool._id}</p>
              <p><strong>Event:</strong> {carpool.eventId.title}</p>
              <p><strong>Route:</strong> {carpool.routeInformation}</p>
              <p><strong>Location:</strong> {carpool.eventId.routeInformation}</p>
              <p><strong>Departure:</strong> {new Date(carpool.departureTime).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p class="no-carpools">You haven't joined any carpools yet.</p>
      )}

      <h3 class="section-title">Carpools You Created:</h3>
      {createdCarpools.length > 0 ? (
        <ul class="carpool-list">
          {createdCarpools.map((carpool) => (
            <li key={carpool._id} class="carpool-item">
              <p><strong>Event ID:</strong> {carpool.eventId._id}</p>
              <p><strong>Carpool ID:</strong> {carpool._id}</p>
              <p><strong>Event:</strong> {carpool.eventId.title}</p>
              <p><strong>Route:</strong> {carpool.routeInformation}</p>
              <p><strong>Location:</strong> {carpool.eventId.routeInformation}</p>
              <p><strong>Departure:</strong> {new Date(carpool.departureTime).toLocaleString()}</p>
            </li>
          ))}
        </ul>
      ) : (
        <p class="no-carpools">You haven't created any carpools yet.</p>
      )}
    </div>
  );
}

export default Profile;
