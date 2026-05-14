import { useEffect, useState } from 'react';
import { fetchNotifications, markNotificationRead } from '../services/notificationService';
import NotificationCard from '../components/NotificationCard';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

const typeOptions = ['All', 'Event', 'Result', 'Placement'];
const priorityOptions = ['All', 'High', 'Medium', 'Low'];

function Notifications() {
  const [notifications, setNotifications] = useState([]);
  const [filterType, setFilterType] = useState('All');
  const [filterPriority, setFilterPriority] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [unseenCount, setUnseenCount] = useState(0);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      setError('');

      const response = await fetchNotifications({
        limit: 50,
        page: 1,
        notification_type: filterType !== 'All' ? filterType : undefined,
        priority: filterPriority !== 'All' ? filterPriority : undefined,
      });

      setNotifications(response.data.data);
      setUnseenCount(response.data.data.filter((item) => !item.seen).length);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load notifications');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotifications();
  }, [filterType, filterPriority]);

  const handleMarkRead = async (id) => {
    try {
      await markNotificationRead(id);
      setNotifications((prev) => prev.map((item) => (item._id === id ? { ...item, seen: true } : item)));
      setUnseenCount((count) => Math.max(count - 1, 0));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to mark notification as read');
    }
  };

  return (
    <section className="notifications-page">
      <div className="page-header">
        <div>
          <h2>Notifications</h2>
          <p>View notifications, filter by type, and keep the priority inbox front and center.</p>
        </div>
        <div className="notification-summary">
          <strong>{unseenCount}</strong> new notification{unseenCount === 1 ? '' : 's'}
        </div>
      </div>

      <div className="filter-row notification-filter-row">
        <label>
          Type
          <select value={filterType} onChange={(event) => setFilterType(event.target.value)}>
            {typeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label>
          Priority
          <select value={filterPriority} onChange={(event) => setFilterPriority(event.target.value)}>
            {priorityOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} />
      ) : notifications.length === 0 ? (
        <ErrorBanner message="No notifications found yet. Use the API or seed data to populate notifications." />
      ) : (
        <div className="task-grid">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification._id}
              notification={notification}
              onMarkRead={handleMarkRead}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Notifications;
