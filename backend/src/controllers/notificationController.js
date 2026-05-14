const Notification = require('../models/Notification');
const asyncHandler = require('../middleware/asyncHandler');

const getNotifications = asyncHandler(async (req, res) => {
  const limit = Math.min(Number(req.query.limit) || 20, 100);
  const page = Math.max(Number(req.query.page) || 1, 1);
  const typeFilter = req.query.notification_type;
  const priorityFilter = req.query.priority;
  const unseenFilter = req.query.unseen === 'true';

  const total = await Notification.countNotifications({
    type: typeFilter,
    priority: priorityFilter,
    unseen: unseenFilter,
  });

  const notifications = await Notification.findNotifications({
    type: typeFilter,
    priority: priorityFilter,
    unseen: unseenFilter,
    limit,
    page,
  });

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
  const notification = await Notification.findNotificationById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  res.status(200).json({ success: true, data: notification });
});

const markRead = asyncHandler(async (req, res) => {
  const notification = await Notification.findNotificationById(req.params.id);
  if (!notification) {
    res.status(404);
    throw new Error('Notification not found');
  }

  const updatedNotification = await Notification.markNotificationRead(req.params.id);
  res.status(200).json({ success: true, data: updatedNotification });
});

const createNotification = asyncHandler(async (req, res) => {
  const { studentId, type, message, priority = 'Medium', metadata = {} } = req.body;

  if (!studentId || !type || !message) {
    res.status(400);
    throw new Error('studentId, type, and message are required');
  }

  const notification = await Notification.createNotification({
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
