// src/components/events/EventList.js
import '../../styles/eventList.css';
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { listEvents } from '../../services/api';
import { Link } from 'react-router-dom';

function EventList({ searchTerm }) {  // Accept searchTerm as a prop
  const [events, setEvents] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await listEvents();
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching events:', error);
      }
    };
    fetchEvents();
  }, []);

  const handleCreateEvent = () => {
    navigate('/event/create');
  };

  // Filter events based on searchTerm
  const filteredEvents = events.filter(event =>
    event.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="event-list-container">
      <div className="heading">
        <h2 style={{color:"#5F6368"}}>Event not Listed here?</h2>
        <button onClick={handleCreateEvent} className="cta-button">Create New Event</button>
      </div>
      <div className="events-container">
        <h2 className="section-title">Upcoming Events</h2>
        <ul className="events-list">
          {filteredEvents.length > 0 ? (
            filteredEvents.map(event => (
              <li key={event._id} className="event-card">
                <Link to={`/events/${event._id}`} className="event-link">
                  <h3>{event.title}</h3>
                  <p>Date: {new Date(event.date).toLocaleDateString()}</p>
                  <p>Location: {event.location}</p>
                  <p>Type: {event.type}</p>
                </Link>
              </li>
            ))
          ) : (
            <p>No events found matching your search.</p>
          )}
        </ul>
      </div>
    </div>
  );
}

export default EventList;