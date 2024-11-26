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

    // Check if the authenticated user is the driver
    // if (carpool.driverId.toString() !== userId) {
    //   return res.status(403).json({ message: 'You are not authorized to delete this carpool.' });
    // }

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


//==============================

// const express = require('express');
// const router = express.Router();
// const Carpool = require('../models/Carpool');

// // In carpool route file
// // check carpool Existance
// router.get('/check-existence', async (req, res) => {
//   try {
//     const { eventId, driverId } = req.query;
//     const existingCarpool = await Carpool.findOne({ eventId, driverId });
//     res.json({ exists: !!existingCarpool }); // "exists": true or false
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // Search Carpool Groups
// router.get('/search', async (req, res) => {
//     try {
//       const { route } = req.query; // Get route from query parameters
//         if (!route) {
//             return res.status(400).send('Route query parameter is required');
//         }
//         const carpools = await Carpool.find({ routeInformation: new RegExp(route, 'i') }).populate('driverId');
//         res.json(carpools);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// });

// //temp
// // Search Carpool based on events
// router.get('/event', async (req, res) => {
//   try {
//     const { eventId } = req.query; // Get route from query parameters
//       if (!eventId) {
//           return res.status(400).send('event and driver ID query parameter is required');
//       }
//       // const carpools = await Carpool.findOne({ eventId });;
//       // res.json(carpools);

//       const carpool = await Carpool.find({eventId})
//       .populate('driverId', 'name phone') // Include driver name and phone
//       .populate('riders', 'name'); // Include rider names
//       if (!carpool) return res.status(404).json({ error: 'Carpool not found' });

//       res.json(carpool)
//   } catch (error) {
//       res.status(500).json({ error: error.message });
//   }
// });

// // Create Carpool Group
// router.post('/create', async (req, res) => {
//     try {
//       const { driverId, eventId, seatsAvailable, routeInformation, departureTime } = req.body;
  
//       const newCarpool = new Carpool({
//         driverId,
//         eventId,
//         seatsAvailable,
//         routeInformation,
//         departureTime
//       });
  
//       await newCarpool.save();
//       res.status(201).json(newCarpool);
//     } catch (error) {
//       res.status(400).json({ error: error.message });
//     }
//   });

// // Create Carpool Group (No changes needed)
// router.post('/', async (req, res) => {
//     try {
//         const { driverId, eventId, seatsAvailable, routeInformation, departureTime } = req.body;
//         const newCarpool = new Carpool({ driverId, eventId, seatsAvailable, routeInformation, departureTime });
//         await newCarpool.save();
//         res.status(201).send('Carpool group created successfully');
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });

// // Join Carpool Group
// router.post('/:carpoolId/join', async (req, res) => {
//     try {
//       const { userId } = req.body;
//       const carpool = await Carpool.findById(req.params.carpoolId);
//       // console.log(userId)
//       if (!carpool) return res.status(404).json({ error: 'Carpool not found' });
//       if (carpool.seatsAvailable === 0) return res.status(400).json({ error: 'No seats available' });

      
//       // Check if the user is already a rider
//       if(carpool.driverId == userId){
//         return res.status(400).send('You have created the carpool');
//       }
//         if (carpool.riders.includes(userId)) {
//             return res.status(400).send('You have already joined this carpool');
//         }

//       // Add the user as a rider and decrease seats
//       carpool.riders.push(userId);
//       carpool.seatsAvailable -= 1;
//       await carpool.save();
  
//       res.json(carpool);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  

// // Join Carpool Group (Add notification functionality here)
// // Join Carpool Group
// // router.post('/:id/join', async (req, res) => {
// //         try {
// //         const carpoolId = req.params.id;
// //         const userId = req.body.userId;
    
// //         const carpool = await Carpool.findById(carpoolId);
// //         if (!carpool) return res.status(404).send('Carpool not found');
    
// //         // Check if the user is already a rider
// //         if (carpool.riders.includes(userId)) {
// //             return res.status(400).send('You have already joined this carpool');
// //         }
    
// //         if (carpool.riders.length < carpool.seatsAvailable) {
// //             carpool.riders.push(userId);
// //             await carpool.save();

// //             // Send notification to the driver
// //             const driver = await User.findById(carpool.driverId);
// //             console.log(`Driver ${driver.name} notified: New rider joined their carpool!`);
    
// //             res.send('Successfully joined the carpool');
// //         } else {
// //             res.status(400).send('No available seats');
// //         }
// //         } catch (error) {
// //             res.status(500).json({ error: error.message });
// //         }
// // });

// // Get Carpool Details
// router.get('/:carpoolId', async (req, res) => {
//     try {
//       const carpool = await Carpool.findById(req.params.carpoolId)
//         .populate('driverId', 'name phone') // Include driver name and phone
//         .populate('riders', 'name'); // Include rider names
  
//       if (!carpool) return res.status(404).json({ error: 'Carpool not found' });
  
//       res.json(carpool);
//     } catch (error) {
//       res.status(500).json({ error: error.message });
//     }
//   });
  
// // View Carpool Details (No changes needed)
// // router.get('/:id', async (req, res) => {
// //   try {
// //     const carpool = await Carpool.findById(req.params.id).populate('driverId').populate('riders');
// //     if (!carpool) return res.status(404).send('Carpool not found');
// //     res.json(carpool);
// //   } catch (error) {
// //     res.status(500).json({ error: error.message });
// //   }
// // });


// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const Carpool = require('../models/Carpool');

// // Create Carpool Group
// router.post('/', async (req, res) => {
//   try {
//     const { driverId, eventId, seatsAvailable, routeInformation, departureTime } = req.body;
//     const newCarpool = new Carpool({ driverId, eventId, seatsAvailable, routeInformation, departureTime });
//     await newCarpool.save();
//     res.status(201).send('Carpool group created successfully');
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// });

// // Join Carpool Group
// router.post('/:id/join', async (req, res) => {
//   try {
//     const carpoolId = req.params.id;
//     const userId = req.body.userId;

//     const carpool = await Carpool.findById(carpoolId);
//     if (!carpool) return res.status(404).send('Carpool not found');

//     if (carpool.riders.length < carpool.seatsAvailable) {
//       carpool.riders.push(userId);
//       await carpool.save();
//       res.send('Successfully joined the carpool');
//     } else {
//       res.status(400).send('No available seats');
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// // View Carpool Details
// router.get('/:id', async (req, res) => {
//   try {
//     const carpool = await Carpool.findById(req.params.id).populate('driverId').populate('riders');
//     if (!carpool) return res.status(404).send('Carpool not found');
//     res.json(carpool);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

// module.exports = router;
