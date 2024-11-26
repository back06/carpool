const express = require('express');
const router = express.Router();
const Event = require('../models/Event');

// Create Event
router.post('/', async (req, res) => {
  try {
    const { title, guest, date, location, description, type } = req.body;
    const newEvent = new Event({ title, guest, date, location, description, type });
    console.log(newEvent)
    await newEvent.save();
    res.status(201).send('Event created successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// Get Event Details by ID
router.get('/:eventId', async (req, res) => {
  try {
    const eventId = req.params.eventId;
    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ error: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;

