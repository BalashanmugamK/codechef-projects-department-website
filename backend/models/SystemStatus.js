const mongoose = require('mongoose');

const systemSchema = new mongoose.Schema({
  recruitmentOpen: { type: Boolean, default: true },
  maintenanceMode: { type: Boolean, default: false },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('SystemStatus', systemSchema);