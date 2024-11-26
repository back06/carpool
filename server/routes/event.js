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

// List Events with Filtering
router.get('/', async (req, res) => {
  try {
    const { location, date } = req.query; // Get query parameters

    // Build query
    let query = {};
    if (location) {
      query.location = new RegExp(location, 'i'); // Case insensitive match
    }
    if (date) {
      query.date = { $gte: new Date(date) }; // Filter for dates greater than or equal to the provided date
    }

    const events = await Event.find(query);
    res.json(events);
  } catch (error) {
    res.status(500).json({ error: error.message });
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

// List Events
// router.get('/', async (req, res) => {
//   try {
//     const events = await Event.find({});
//     res.json(events);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });
