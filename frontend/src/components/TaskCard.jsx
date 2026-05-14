import './TaskCard.css';

const statusLabels = {
  Pending: 'Mark In Progress',
  'In Progress': 'Mark Completed',
  Completed: 'Completed',
};

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  const nextStatus = task.status === 'Pending' ? 'In Progress' : 'Completed';
  const canAdvance = task.status !== 'Completed';

  return (
    <article className="task-card">
      <div className="task-card-top">
        <div>
          <h3>{task.title}</h3>
          <span className={`tag status-${task.status.replace(/ /g, '-').toLowerCase()}`}>
            {task.status}
          </span>
        </div>
        <span className={`priority priority-${task.priority.toLowerCase()}`}>{task.priority}</span>
      </div>

      <p className="task-description">{task.description}</p>

      <div className="task-meta">
        <small>Created: {new Date(task.createdAt).toLocaleDateString()}</small>
        <small>Updated: {new Date(task.updatedAt).toLocaleDateString()}</small>
      </div>

      <div className="task-actions">
        <button type="button" className="secondary-button" onClick={onEdit}>
          Edit
        </button>
        <button type="button" className="danger-button" onClick={onDelete}>
          Delete
        </button>
        <button
          type="button"
          className="primary-button"
          onClick={() => onStatusChange(nextStatus)}
          disabled={!canAdvance}
        >
          {statusLabels[task.status]}
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
