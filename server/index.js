const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const eventRoutes = require('./routes/event');
const carpoolRoutes = require('./routes/carpool');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// adding this since cross validation is req while deleting a carpool listed by a user
const authenticate = (req, res, next) => {
  const token = req.header('Authorization');

  if (!token) {
    return res.status(401).json({ message: 'No token, authorization denied.' });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id; // Attach user ID to the request
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token.' });
  }
};

// Database connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected..'))
  .catch(err => console.error(err));

// Routes
app.use('/api/users', userRoutes);
app.use('/api/events', eventRoutes);
app.use('/api/carpools', carpoolRoutes, authenticate);


app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
