const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const User = require('../models/User');
const jwt = require('jsonwebtoken');

console.log('NOTIFICATIONS ROUTER LOADED');

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ success: false, message: 'Access token required' });

    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ success: false, message: 'Invalid token' });
        req.user = user;
        next();
    });
};

// Middleware to check admin role
const requireAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
        return res.status(403).json({ success: false, message: 'Admin access required' });
    }
    next();
};

// GET /api/notifications - Get notifications for current user (or public if no token)
router.get('/', async (req, res) => {
    console.log('NOTIFICATIONS ROUTE CALLED - NO AUTH');
    res.json({ success: true, notifications: [], message: 'Test response' });
});

// POST /api/notifications - Create new notification (admin only)
router.post('/', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const { message, durationSeconds } = req.body;
        if (!message || !message.trim()) {
            return res.status(400).json({ success: false, message: 'Message is required' });
        }

        const notification = new Notification({
            message: message.trim(),
            sentBy: req.user.id,
            durationSeconds: durationSeconds || 86400, // Default 24 hours
            expiresAt: new Date(Date.now() + (durationSeconds || 86400) * 1000)
        });

        await notification.save();
        res.status(201).json({ success: true, message: 'Notification created', notification });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to create notification', error: error.message });
    }
});

// PUT /api/notifications/:id/read - Mark notification as read
router.put('/:id/read', authenticateToken, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (!notification.readBy.includes(req.user.id)) {
            notification.readBy.push(req.user.id);
            await notification.save();
        }

        res.json({ success: true, message: 'Notification marked as read' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to mark notification as read', error: error.message });
    }
});

// PUT /api/notifications/:id/dismiss - Dismiss notification
router.put('/:id/dismiss', authenticateToken, async (req, res) => {
    try {
        const notification = await Notification.findById(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        if (!notification.dismissedBy.includes(req.user.id)) {
            notification.dismissedBy.push(req.user.id);
            await notification.save();
        }

        res.json({ success: true, message: 'Notification dismissed' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to dismiss notification', error: error.message });
    }
});

// DELETE /api/notifications/:id - Delete notification (admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const notification = await Notification.findByIdAndDelete(req.params.id);
        if (!notification) {
            return res.status(404).json({ success: false, message: 'Notification not found' });
        }

        res.json({ success: true, message: 'Notification deleted' });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to delete notification', error: error.message });
    }
});

// GET /api/notifications/admin - Get all notifications for admin
router.get('/admin', authenticateToken, requireAdmin, async (req, res) => {
    try {
        const notifications = await Notification.find().sort({ sentAt: -1 });
        res.json({ success: true, notifications });
    } catch (error) {
        res.status(500).json({ success: false, message: 'Failed to fetch notifications', error: error.message });
    }
});

module.exports = router;