const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    trim: true
  },
  role: {
    type: String,
    trim: true
  },
  group: {
    type: String,
    enum: ['Core Team', 'Lead Developer', 'Researcher', 'Mentor', 'Alumni'],
    default: 'Core Team'
  },
  tenure: {
    type: String,
    default: '2025-26'
  },
  linkedin: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  photo: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Member', memberSchema);
