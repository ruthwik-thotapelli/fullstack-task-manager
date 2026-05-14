const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const typeFilter = req.query.notification_type;
  const priorityFilter = req.query.priority;
  const unseenFilter = req.query.unseen === 'true';

  const query = {};
  if (typeFilter) query.type = typeFilter;
  if (priorityFilter) query.priority = priorityFilter;
  if (unseenFilter) query.seen = false;

  const total = await Notification.countDocuments(query);
  const notifications = await Notification.find(query)
    .sort({ priorityValue: -1, timestamp: -1 })
    .skip((page - 1) * limit)
    .limit(limit);

  res.status(200).json({
    success: true,
    meta: {
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
    data: notifications,
  });
});

const getNotificationById = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.status(200).json({ success: true, data: notification });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  notification.seen = true;
  await notification.save();

  res.status(200).json({ success: true, data: notification });
});

const createNotification = asyncHandler(async (req, res) => {
  const { studentId, type, message, priority = 'Medium', metadata = {} } = req.body;

  if (!studentId || !type || !message) {
    res.status(400);
    throw new Error('studentId, type, and message are required');
  }

  const notification = await Notification.create({
    studentId,
    type,
    message,
    priority,
    metadata,
  });

  res.status(201).json({ success: true, data: notification });
});

module.exports = {
  getNotifications,
  getNotificationById,
  markRead,
  createNotification,
};
