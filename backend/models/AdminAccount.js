const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminAccountSchema = new mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'super-admin'], default: 'admin' },
  createdAt: { type: Date, default: Date.now }
});

adminAccountSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

adminAccountSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('AdminAccount', adminAccountSchema);