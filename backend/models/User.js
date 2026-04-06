const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const projectSubSchema = new mongoose.Schema({
  title: String,
  description: String,
  technologies: [String],
  github: String,
  demo: String,
  status: { type: String, enum: ['ongoing', 'completed'], default: 'ongoing' }
}, { _id: true });

const hackathonSubSchema = new mongoose.Schema({
  eventName: String,
  date: Date,
  position: String,
  teamName: String,
  projectBuilt: String,
  certificateUrl: String
}, { _id: true });

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, required: true },
  photo: { type: String, trim: true, default: '' },
  github: { type: String, trim: true, default: '' },
  linkedin: { type: String, trim: true, default: '' },
  codechefHandle: { type: String, trim: true, default: '' },
  role: { type: String, enum: ['user', 'admin', 'super-admin'], default: 'user' },
  projects: [projectSubSchema],
  hackathons: [hackathonSubSchema]
}, { timestamps: true });

userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

userSchema.methods.comparePassword = async function(candidate) {
  return await bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model('User', userSchema);
