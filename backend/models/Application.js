const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  phone: String,
  semester: { type: String, required: true },
  role: { type: String, required: true },
  skills: { type: String, required: true },
  experience: { type: String, required: true },
  portfolio: { type: String, required: true },
  linkedin: { type: String, required: true },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Application', applicationSchema);