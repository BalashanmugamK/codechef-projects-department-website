const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const AdminAccount = require('../models/AdminAccount');
const Application = require('../models/Application');
const InterviewSlot = require('../models/InterviewSlot');
const Message = require('../models/Message');
const SystemStatus = require('../models/SystemStatus');
const Member = require('../models/Member');

const router = express.Router();

// Middleware to verify admin JWT token
const adminAuth = (req, res, next) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ message: 'Access denied' });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== 'admin' && decoded.role !== 'super-admin') {
      return res.status(403).json({ message: 'Admin access required' });
    }
    req.admin = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Invalid token' });
  }
};

// GET /api/admin/accounts - Get all admin accounts
router.get('/accounts', adminAuth, async (req, res) => {
  try {
    const accounts = await AdminAccount.find({}).select('-password');
    res.json({ success: true, accounts });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to fetch admin accounts', error: error.message });
  }
});

// POST /api/admin/accounts - Create new admin account
router.post('/accounts', adminAuth, async (req, res) => {
  try {
    const { email, password, role } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const existing = await AdminAccount.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'Admin account already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = new AdminAccount({ email, password: hashedPassword, role: role || 'admin' });
    await account.save();

    res.status(201).json({ message: 'Admin account created successfully', account: { _id: account._id, email: account.email, role: account.role } });
  } catch (error) {
    res.status(500).json({ message: 'Failed to create admin account', error: error.message });
  }
});

const updateAdminPasswordHandler = async (req, res) => {
  try {
    const { email } = req.params;
    const { password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Password is required' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const account = await AdminAccount.findOneAndUpdate(
      { email },
      { password: hashedPassword },
      { new: true }
    ).select('-password');

    if (!account) {
      return res.status(404).json({ message: 'Admin account not found' });
    }

    res.json({ message: 'Password updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update password', error: error.message });
  }
};

router.patch('/accounts/:email/password', adminAuth, updateAdminPasswordHandler);
router.put('/accounts/:email/password', adminAuth, updateAdminPasswordHandler);

// GET /api/admin/applications - Get all applications
router.get('/applications', adminAuth, async (req, res) => {
  try {
    const applications = await Application.find({}).sort({ timestamp: -1 });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch applications', error: error.message });
  }
});

// DELETE /api/admin/applications/:id - Delete an application
router.delete('/applications/:id', adminAuth, async (req, res) => {
  try {
    const application = await Application.findByIdAndDelete(req.params.id);
    if (!application) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json({ message: 'Application deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete application', error: error.message });
  }
});

// GET /api/admin/interview-slots - Get all interview slots
router.get('/interview-slots', adminAuth, async (req, res) => {
  try {
    const slots = await InterviewSlot.find({}).sort({ date: 1, time: 1 });
    res.json(slots);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch interview slots', error: error.message });
  }
});

// POST /api/admin/interview-slots - Create interview slot
router.post('/interview-slots', adminAuth, async (req, res) => {
  try {
    const { date, time, interviewer } = req.body;
    const slot = new InterviewSlot({ date, time, interviewer, booked: false });
    await slot.save();
    res.status(201).json(slot);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create interview slot', error: error.message });
  }
});

// DELETE /api/admin/interview-slots/:id - Delete interview slot
router.delete('/interview-slots/:id', adminAuth, async (req, res) => {
  try {
    const slot = await InterviewSlot.findByIdAndDelete(req.params.id);
    if (!slot) {
      return res.status(404).json({ message: 'Interview slot not found' });
    }
    res.json({ message: 'Interview slot deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete interview slot', error: error.message });
  }
});

// GET /api/admin/messages - Get broadcast messages
router.get('/messages', adminAuth, async (req, res) => {
  try {
    const messages = await Message.find({}).sort({ createdAt: -1 });
    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch messages', error: error.message });
  }
});

// POST /api/admin/messages - Create broadcast message
router.post('/messages', adminAuth, async (req, res) => {
  try {
    const { text, duration } = req.body;
    const message = new Message({ text, duration: duration || 10000 });
    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create message', error: error.message });
  }
});

// DELETE /api/admin/messages/:id - Delete message
router.delete('/messages/:id', adminAuth, async (req, res) => {
  try {
    const message = await Message.findByIdAndDelete(req.params.id);
    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }
    res.json({ message: 'Message deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete message', error: error.message });
  }
});

// POST /api/admin/members - Add member
router.post('/members', adminAuth, async (req, res) => {
  try {
    const member = new Member(req.body);
    await member.save();
    res.status(201).json({ success: true, message: 'Member added successfully', member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add member', error: error.message });
  }
});

// PUT /api/admin/members/:id - Update a member
router.put('/members/:id', adminAuth, async (req, res) => {
  try {
    const updates = req.body;
    const member = await Member.findByIdAndUpdate(req.params.id, updates, { new: true });
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, message: 'Member updated successfully', member });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to update member', error: error.message });
  }
});

// DELETE /api/admin/members/:id - Delete a member
router.delete('/members/:id', adminAuth, async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ success: false, message: 'Member not found' });
    }
    res.json({ success: true, message: 'Member removed successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to delete member', error: error.message });
  }
});

module.exports = router;