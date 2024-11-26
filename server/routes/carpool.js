//routes/carpool.js
const express = require('express');
const Carpool = require('../models/Carpool');
const router = express.Router();


// DELETE /api/carpools/:carpoolId
router.delete('/:carpoolId', async (req, res) => {
  const { carpoolId } = req.params;
  try {
    // Find the carpool by ID
    const carpool = await Carpool.findById(carpoolId);

    if (!carpool) {
      return res.status(404).json({ message: 'Carpool not found.' });
    }

    // Delete the carpool
    await Carpool.findByIdAndDelete(carpoolId);

    res.status(200).json({ message: 'Carpool deleted successfully.' });
  } catch (error) {
    console.error('Error deleting carpool:', error);
    res.status(500).json({ message: 'Server error while deleting carpool.' });
  }
});

// Opt-out of a carpool
router.delete('/:carpoolId/unjoin/:userId', async (req, res) => {
  const { carpoolId, userId } = req.params;

  try {
    const carpool = await Carpool.findById(carpoolId);
    if (!carpool) return res.status(404).json({ message: 'Carpool not found' });

    // Check if the user is part of this carpool
    if (!carpool.riders.includes(userId)) {
      return res.status(400).json({ message: 'User is not in this carpool' });
    }

    // Remove the user from the carpool riders
    carpool.riders = carpool.riders.filter((rider) => rider.toString() !== userId);
    await carpool.save();

    res.status(200).json({ message: 'Successfully opted out of carpool', carpool });
  } catch (error) {
    res.status(500).json({ message: 'Error opting out of carpool', error });
  }
});
//

// Create Carpool Route
router.post('/create', async (req, res) => {
  const { eventId, driverId, seatsAvailable, routeInformation, departureTime } = req.body;

  try {
    // Check if the user has already created or joined a carpool for this event
    const existingCarpool = await Carpool.findOne({
      eventId,
      $or: [{ driverId }, { riders: driverId }],
    });

    if (existingCarpool) {
      return res.status(400).json({ message: "You have already created or joined a carpool for this event. (server)" });
    }

    // Create a new carpool if no conflicts
    const newCarpool = new Carpool({
      eventId,
      driverId,
      seatsAvailable,
      routeInformation,
      departureTime,
    });

    await newCarpool.save();
    res.status(201).json(newCarpool);
  } catch (error) {
    res.status(500).json({ message: "Failed to create carpool", error });
  }
});

// Join Carpool Route
router.post('/join', async (req, res) => {
  const { eventId, carpoolId, userId } = req.body;

  try {
    // Check if the user has already created or joined a carpool for this event
    const existingCarpool = await Carpool.findOne({
      eventId,
      $or: [{ driverId: userId }, { riders: userId }],
    });

    if (existingCarpool) {
      return res.status(400).json({ message: "You have already created or joined a carpool for this event. (server)" });
    }

    // Find the carpool and ensure seats are available
    const carpool = await Carpool.findById(carpoolId);
    if (!carpool) return res.status(404).json({ message: "Carpool not found" });
    if (carpool.seatsAvailable <= carpool.riders.length) {
      return res.status(400).json({ message: "No seats available" });
    }

    // Add user to riders
    carpool.riders.push(userId);
    await carpool.save();
    res.status(200).json({ message: "Joined carpool successfully", carpool });
  } catch (error) {
    res.status(500).json({ message: "Failed to join carpool", error });
  }
});


// Search Carpool based on events
router.get('/', async (req, res) => {
  try {
    const { eventId } = req.query; 
      if (!eventId) {
          return res.status(400).send('event and driver ID query parameter is required');
      }

      const carpool = await Carpool.find({eventId})
      .populate('driverId', 'name phone') // Include driver name and phone
      .populate('riders', 'name'); // Include rider names
      if (!carpool) return res.status(404).json({ error: 'Carpool not found' });

      res.json(carpool)
  } catch (error) {
      res.status(500).json({ error: error.message });
  }
});


module.exports = router;
