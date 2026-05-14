function EmptyState({ message }) {
  return (
    <div className="empty-state">
      <div className="empty-icon">✓</div>
      <h3>No tasks yet</h3>
      <p>{message}</p>
    </div>
  );
}

export default EmptyState;
