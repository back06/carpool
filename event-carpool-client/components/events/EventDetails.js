// src/components/events/EventDetails.js
import '../../styles/eventDetails.css'
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { viewEventDetails, joinCarpool, getCarpools, optOutCarpool, deleteCarpool } from '../../services/api';

function EventDetails() {
  const { eventId } = useParams();
  const [event, setEvent] = useState(null);
  const [carpools, setCarpools] = useState([]);
  const [userId] = useState(localStorage.getItem('userId')); // User ID from local storage
  const [userCarpool, setUserCarpool] = useState(null); // Tracks user's carpool status
  const navigate = useNavigate();

  // Fetch event and carpool details
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const eventRes = await viewEventDetails(eventId);
        const carpoolRes = await getCarpools(eventId);
        console.log(carpoolRes.data)

        setEvent(eventRes.data);
        setCarpools(carpoolRes.data);

        const existingCarpool = carpoolRes.data.find(
          (carpool) => 
            carpool.driverId._id === userId || carpool.riders.some(rider => rider._id === userId)
        );
        
        setUserCarpool(existingCarpool);
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };

    fetchEventData();
  }, [eventId, userId]);

  const handleOptOutCarpool = async () => {
    try {
      await optOutCarpool(userCarpool._id, userId);
      setUserCarpool(null); // Clear user's carpool status
      // Update the carpool list to reflect changes
      setCarpools((prevCarpools) =>
        prevCarpools.map((carpool) =>
          carpool._id === userCarpool._id
            ? { ...carpool, riders: carpool.riders.filter((rider) => rider !== userId) }
            : carpool
        )
      );
      alert('You have successfully opted out of the carpool.');
    } catch (error) {
      console.error('Error opting out:', error);
    }
  };

  const handleDeleteCarpool = async () => {
    try {
      await deleteCarpool(userCarpool._id); // Delete the carpool
      setUserCarpool(null); // Clear user's carpool status
      // Remove the carpool from the list
      setCarpools((prevCarpools) => prevCarpools.filter((carpool) => carpool._id !== userCarpool._id));
      alert('Your carpool has been deleted.');
    } catch (error) {
      console.error('Error deleting carpool:', error);
    }
  };

  const handleCreateCarpool = () => {
    if (!userCarpool) {
      navigate(`/events/${eventId}/create-carpool`);
    } else {
      alert('You have already created or joined a carpool for this event.');
    }
  };

  const handleJoinCarpool = async (carpoolId) => {
    if (!userCarpool) {
      try {
        const response = await joinCarpool({ eventId, carpoolId, userId });
        setUserCarpool(response.data.carpool); // Update user's carpool status
        // Update the carpool list to reflect changes
        setCarpools((prevCarpools) =>
          prevCarpools.map((carpool) =>
            carpool._id === carpoolId
              ? { ...carpool, riders: [...carpool.riders, userId] }
              : carpool
          )
        );
      } catch (error) {
        console.error('Error joining carpool:', error);
      }
    } else {
      alert('You have already created or joined a carpool for this event.');
    }
  };

  if (!event) return <div>Loading...</div>;
  return (
    <div className="event-details-container">
      <h1 style={{color:"#333"}}>Event Info</h1>
      <div className="event-header">
        <h2 className="event-title">{event.title}</h2>

        <div className="event-main-details">
          {/* Left side details (Date, Location, Guest, etc.) */}
          <div className="event-left">
            <p className="event-info">
              <strong>Guest:</strong> {event.guest}
            </p>
            <p className="event-info">
              <strong>Date:</strong> {new Date(event.date).toLocaleDateString()}
            </p>
            <p className="event-info">
              <strong>Time:</strong> {new Date(event.date).toLocaleTimeString()}
            </p>
            <p className="event-info">
              <strong>Location:</strong> {event.location}
            </p>
          </div>

          {/* Right side description */}
          <div className="event-description">
            <p>
              <strong>Description:</strong> {event.description}
            </p>
          </div>
        </div>
        {/* Back to Events Button */}
        <button className="back-btn" onClick={() => navigate('/events')}>Back to Events</button>
        {/* Create Carpool Button (if no user carpool exists) */}
        {!userCarpool && <button className="create-carpool-btn" onClick={handleCreateCarpool}>Create Carpool</button>}
      </div>


      {/* Available Carpools Section */}
      <div className="carpool-section">
        <h3 style={{color:"#333"}}>Available Carpools</h3>
        <div className="carpool-list">
          {carpools.length > 0 ? (
            <>
              {carpools.map((carpool) => (
                <div key={carpool._id} className="carpool-card">
                  {/* Carpool Details */}
                  <div className="carpool-left">
                  <p><strong>ID:</strong> {carpool._id}</p>
                    <p><strong>Route:</strong> {carpool.routeInformation}</p>
                    <p><strong>Departure Time:</strong> {new Date(carpool.departureTime).toLocaleString()}</p>
                    <p><strong>Seats Available:</strong> {carpool.seatsAvailable - carpool.riders.length}</p>
                    <p><strong>Created by:</strong> {carpool.driverId.name}</p>
                    <p><strong>Contact:</strong> {carpool.driverId.phone}</p>
                  </div>
    
                  {/* Carpool Actions on the Right */}
                  <div className="carpool-actions">
                    {!userCarpool && (
                      <button className="join-btn" onClick={() => handleJoinCarpool(carpool._id)}>Join Carpool</button>
                    )}
                    {userCarpool && userCarpool._id === carpool._id && userCarpool.driverId._id !== userId && (
                      <button className="optout-btn" onClick={handleOptOutCarpool}>Opt Out</button>
                    )}
                    {userCarpool && userCarpool._id === carpool._id && userCarpool.driverId._id === userId && (
                      <button className="delete-btn" onClick={handleDeleteCarpool}>Delete Carpool</button>
                    )}
                  </div>
                </div>
              ))}
              </>
          ): (
              <p>NO carpool yet</p>
          )}
          
        </div>
      </div>
    </div>
  );
}

export default EventDetails;