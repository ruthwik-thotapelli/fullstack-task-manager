const express = require('express');
const protect = require('../middleware/authMiddleware');
const {
  getNotifications,
  getNotificationById,
  markRead,
  createNotification,
} = require('../controllers/notificationController');

const router = express.Router();

router.route('/').get(protect, getNotifications).post(protect, createNotification);
router.route('/:id').get(protect, getNotificationById).patch(protect, markRead);

module.exports = router;
