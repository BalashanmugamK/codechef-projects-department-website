const express = require('express');
const Member = require('../models/Member');

const router = express.Router();

// GET /api/members - Get all members
router.get('/', async (req, res) => {
  console.log('MEMBERS ROUTER: GET / called');
  try {
    const members = await Member.find({});
    console.log('MEMBERS ROUTER: Found', members.length, 'members');
    res.json({ success: true, members });
  } catch (error) {
    console.error('MEMBERS ROUTER: Error fetching members:', error);
    res.status(500).json({ success: false, message: 'Failed to fetch members', error: error.message });
  }
});

module.exports = router;