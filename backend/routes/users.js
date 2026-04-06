const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Notification = require('../models/Notification');

const router = express.Router();

// Middleware to verify JWT token
const userAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/users - Get all users (public endpoint)
router.get('/', async (req, res) => {
  try {
    const users = await User.find({}).select('-password');
    res.json({ success: true, users });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Failed to fetch users', error: err.message });
  }
});

// GET /api/users/profile - Get current user profile
router.get('/profile', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const normalizedUser = { ...user.toObject(), codechef: user.codechefHandle };
    delete normalizedUser.codechefHandle;
    res.json({ success: true, user: normalizedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/users/profile - Update user profile
router.patch('/profile', userAuth, async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['name', 'photo', 'github', 'linkedin', 'codechefHandle', 'email'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        updates[field] = req.body[field];
      }
    });

    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true }).select('-password');
    if (!user) return res.status(404).json({ success: false, message: 'User not found' });
    const normalizedUser = { ...user.toObject(), codechef: user.codechefHandle };
    delete normalizedUser.codechefHandle;

    res.json({ success: true, message: 'Profile updated successfully', user: normalizedUser });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PATCH /api/users/change-password - Change password
router.patch('/change-password', userAuth, async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const user = await User.findById(req.user.id);

    const isMatch = await user.comparePassword(currentPassword);
    if (!isMatch) return res.status(400).json({ success: false, message: 'Current password incorrect' });

    user.password = newPassword;
    await user.save();

    res.json({ success: true, message: 'Password updated successfully' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/users/projects - Get user's projects
router.get('/projects', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('projects');
    res.json({ success: true, projects: user.projects || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/users/projects - Add project
router.post('/projects', userAuth, async (req, res) => {
  try {
    const project = req.body;
    const user = await User.findById(req.user.id);
    user.projects.push(project);
    await user.save();
    res.status(201).json({ success: true, message: 'Project added', project });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/users/projects/:id - Delete project
router.delete('/projects/:id', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.projects = user.projects.filter(p => p._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, message: 'Project deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// GET /api/users/hackathons - Get user's hackathons
router.get('/hackathons', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('hackathons');
    res.json({ success: true, hackathons: user.hackathons || [] });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// POST /api/users/hackathons - Add hackathon
router.post('/hackathons', userAuth, async (req, res) => {
  try {
    const hackathon = req.body;
    const user = await User.findById(req.user.id);
    user.hackathons.push(hackathon);
    await user.save();
    res.status(201).json({ success: true, message: 'Hackathon added', hackathon });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// DELETE /api/users/hackathons/:id - Delete hackathon
router.delete('/hackathons/:id', userAuth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    user.hackathons = user.hackathons.filter(h => h._id.toString() !== req.params.id);
    await user.save();
    res.json({ success: true, message: 'Hackathon deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// PUT /api/users/:id - Update a specific user profile
router.put('/:id', userAuth, async (req, res) => {
  try {
    const updates = req.body;
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const allowedToEdit = req.user.id === req.params.id || ['admin', 'super-admin'].includes(req.user.role);
    if (!allowedToEdit) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    const allowedFields = ['name', 'photo', 'github', 'linkedin', 'codechefHandle', 'role'];
    const filtered = {};
    allowedFields.forEach(field => {
      if (updates[field] !== undefined) filtered[field] = updates[field];
    });

    const updatedUser = await User.findByIdAndUpdate(req.params.id, filtered, { new: true }).select('-password');
    const normalizedUser = updatedUser ? { ...updatedUser.toObject(), codechef: updatedUser.codechefHandle } : null;
    if (normalizedUser) delete normalizedUser.codechefHandle;
    res.json({ success: true, user: normalizedUser });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// DELETE /api/users/:id - Delete a specific user
router.delete('/:id', userAuth, async (req, res) => {
  try {
    const targetUser = await User.findById(req.params.id);
    if (!targetUser) return res.status(404).json({ message: 'User not found' });

    const allowedToDelete = req.user.id === req.params.id || ['admin', 'super-admin'].includes(req.user.role);
    if (!allowedToDelete) {
      return res.status(403).json({ message: 'Permission denied' });
    }

    await User.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;