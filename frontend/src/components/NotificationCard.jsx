function NotificationCard({ notification, onMarkRead }) {
  return (
    <article className={`notification-card ${notification.seen ? 'seen' : 'unseen'}`}>
      <div className="notification-card-top">
        <div>
          <h3>{notification.type}</h3>
          <p className="notification-message">{notification.message}</p>
        </div>
        <span className={`notification-priority priority-${notification.priority.toLowerCase()}`}>
          {notification.priority}
        </span>
      </div>

      <div className="notification-meta">
        <small>{new Date(notification.timestamp).toLocaleString()}</small>
        <small>{notification.seen ? 'Viewed' : 'New'}</small>
      </div>

      <div className="notification-actions">
        {!notification.seen && (
          <button type="button" className="secondary-button" onClick={() => onMarkRead(notification._id)}>
            Mark read
          </button>
        )}
      </div>
    </article>
  );
}

export default NotificationCard;
