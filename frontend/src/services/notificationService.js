import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000';
const NOTIFICATIONS_ENDPOINT = `${API_BASE}/api/notifications`;
const AUTH_TOKEN = import.meta.env.VITE_NOTIFICATION_API_TOKEN || 'notif-demo-token';

const authHeaders = {
  Authorization: `Bearer ${AUTH_TOKEN}`,
};

export const fetchNotifications = ({ limit, page, notification_type, priority, unseen } = {}) => {
  const params = {};
  if (limit) params.limit = limit;
  if (page) params.page = page;
  if (notification_type) params.notification_type = notification_type;
  if (priority) params.priority = priority;
  if (unseen) params.unseen = 'true';

  return axios.get(NOTIFICATIONS_ENDPOINT, { params, headers: authHeaders });
};

export const markNotificationRead = (id) =>
  axios.patch(`${NOTIFICATIONS_ENDPOINT}/${id}`, null, { headers: authHeaders });

export const createNotification = (payload) =>
  axios.post(NOTIFICATIONS_ENDPOINT, payload, { headers: authHeaders });
