const mongoose = require('mongoose');

const interviewSlotSchema = new mongoose.Schema({
  date: { type: String, required: true },
  time: { type: String, required: true },
  interviewer: { type: String, required: true },
  booked: { type: Boolean, default: false },
  bookedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('InterviewSlot', interviewSlotSchema);