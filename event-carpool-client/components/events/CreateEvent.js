// src/components/events/CreateEvent.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createEvent } from '../../services/api';
import '../../styles/createEvent.css'
function CreateEvent() {
    const [formData, setFormData] = useState({ title: '', guest: '', date: '', location: '', description: '', type:'' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
        await createEvent(formData);
        navigate('/events');
        } catch (error) {
        console.error('Error creating event:', error);
        }
    };

    return (
        <div class="create-event-container">
  <h2>Create Event</h2>
  <form class="create-event-form" onSubmit={handleSubmit}>
    <input
      name="title"
      type="text"
      placeholder="Event Title"
      onChange={handleChange}
      required
    />
    <input
      name="guest"
      type="text"
      placeholder="Guests Name"
      onChange={handleChange}
      required
    />
    <input
      name="date"
      type="date"
      placeholder="Event Date"
      onChange={handleChange}
      required
    />
    <input
      name="location"
      type="text"
      placeholder="Event Location"
      onChange={handleChange}
      required
    />
    <textarea
      name="description"
      placeholder="Event Description"
      onChange={handleChange}
      required
    ></textarea>
    <input
      name="type"
      type="text"
      placeholder="Event Type"
      onChange={handleChange}
      required
    />
    <button type="submit">Create Event</button>
  </form>
</div>
    );
}

export default CreateEvent;