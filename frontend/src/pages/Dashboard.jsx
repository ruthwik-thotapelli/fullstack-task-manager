import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { fetchTasks, deleteTask, updateTask } from '../services/taskService';
import TaskCard from '../components/TaskCard';
import TaskFilter from '../components/TaskFilter';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';
import EmptyState from '../components/EmptyState';

const statusOptions = ['All', 'Pending', 'In Progress', 'Completed'];

function Dashboard() {
  const [tasks, setTasks] = useState([]);
  const [status, setStatus] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const loadTasks = async (filterStatus = 'All') => {
    try {
      setLoading(true);
      setError('');
      const selected = filterStatus === 'All' ? undefined : filterStatus;
      const response = await fetchTasks(selected);
      setTasks(response.data.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to load tasks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTasks(status);
  }, [status]);

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this task?')) {
      return;
    }
    try {
      await deleteTask(id);
      setTasks((prev) => prev.filter((task) => task._id !== id));
    } catch (err) {
      setError(err.response?.data?.message || 'Could not delete task');
    }
  };

  const handleStatusChange = async (task, nextStatus) => {
    try {
      const response = await updateTask(task._id, { status: nextStatus });
      setTasks((prev) => prev.map((item) => (item._id === task._id ? response.data.data : item)));
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to update task status');
    }
  };

  return (
    <section className="dashboard-page">
      <div className="page-header">
        <div>
          <h2>Task Dashboard</h2>
          <p>View all tasks, update progress, and keep your work organized.</p>
        </div>
        <button className="primary-button" onClick={() => navigate('/create')}>
          + New Task
        </button>
      </div>

      <TaskFilter options={statusOptions} value={status} onChange={setStatus} />

      {loading ? (
        <LoadingSpinner />
      ) : error ? (
        <ErrorBanner message={error} />
      ) : tasks.length === 0 ? (
        <EmptyState message="No tasks available. Create your first task to get started." />
      ) : (
        <div className="task-grid">
          {tasks.map((task) => (
            <TaskCard
              key={task._id}
              task={task}
              onEdit={() => navigate(`/edit/${task._id}`)}
              onDelete={() => handleDelete(task._id)}
              onStatusChange={(nextStatus) => handleStatusChange(task, nextStatus)}
            />
          ))}
        </div>
      )}
    </section>
  );
}

export default Dashboard;
