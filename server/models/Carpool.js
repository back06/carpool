// models/Carpool.js
const mongoose = require('mongoose');

const carpoolSchema = new mongoose.Schema({
  driverId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  seatsAvailable: { type: Number, required: true },
  routeInformation: { type: String, required: true },
  departureTime: { type: Date, required: true },
  riders: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }] // Array of users who join
});

module.exports = mongoose.model('Carpool', carpoolSchema);

