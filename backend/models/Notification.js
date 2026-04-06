const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  message: { type: String, required: true },
  sentBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Admin' },
  sentAt: { type: Date, default: Date.now },
  durationSeconds: { type: Number, default: 0 }, // 0 = permanent
  expiresAt: { type: Date, default: null },
  dismissedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);