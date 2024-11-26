const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

//for profile
const Event = require('../models/Event');
const Carpool = require('../models/Carpool');

// Route to fetch user profile information
router.get('/profile/:userId', async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch user details
    const user = await User.findById(userId, 'name email phone');
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Fetch carpools the user has created
    const createdCarpools = await Carpool.find({ driverId: userId })
      .populate('eventId', 'title date location')
      .select('eventId routeInformation departureTime');

    // Fetch carpools the user has joined
    const joinedCarpools = await Carpool.find({ riders: userId })
      .populate('eventId', 'title date location')
      .select('eventId routeInformation departureTime');

    res.status(200).json({
      user: {
        name: user.name,
        email: user.email,
        phone: user.phone
      },
      createdCarpools,
      joinedCarpools,
    });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


// User Registration
router.post('/register', async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ name, email, phone, password: hashedPassword });
    await newUser.save();
    res.status(201).send('User registered successfully');
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

// User Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).send('User not found');

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(400).send('Invalid credentials');

    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
