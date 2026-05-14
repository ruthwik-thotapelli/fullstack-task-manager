import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createTask, fetchTask, updateTask } from '../services/taskService';
import LoadingSpinner from '../components/LoadingSpinner';
import ErrorBanner from '../components/ErrorBanner';

const statusOptions = ['Pending', 'In Progress', 'Completed'];
const priorityOptions = ['Low', 'Medium', 'High'];

function TaskForm() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: '',
    description: '',
    status: 'Pending',
    priority: 'Medium',
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    fetchTask(id)
      .then((response) => {
        const task = response.data.data;
        setForm({
          title: task.title,
          description: task.description,
          status: task.status,
          priority: task.priority,
        });
      })
      .catch((err) => {
        setError(err.response?.data?.message || 'Task not found');
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (event) => {
    const { name, value } = event.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError('');

    try {
      if (id) {
        await updateTask(id, form);
      } else {
        await createTask(form);
      }
      navigate('/');
    } catch (err) {
      setError(err.response?.data?.message || 'Unable to save task');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <section className="form-page">
      <div className="form-card">
        <h2>{id ? 'Edit Task' : 'Create Task'}</h2>
        <p>{id ? 'Update the details and save changes.' : 'Fill out the form to add a new task.'}</p>

        {error && <ErrorBanner message={error} />}

        <form onSubmit={handleSubmit}>
          <label>
            Title
            <input
              type="text"
              name="title"
              value={form.title}
              onChange={handleChange}
              required
              placeholder="Enter a short task title"
            />
          </label>

          <label>
            Description
            <textarea
              name="description"
              value={form.description}
              onChange={handleChange}
              required
              placeholder="Describe the task in a few sentences"
              rows="5"
            />
          </label>

          <div className="field-row">
            <label>
              Status
              <select name="status" value={form.status} onChange={handleChange}>
                {statusOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>

            <label>
              Priority
              <select name="priority" value={form.priority} onChange={handleChange}>
                {priorityOptions.map((option) => (
                  <option key={option} value={option}>
                    {option}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="form-actions">
            <button type="button" className="secondary-button" onClick={() => navigate(-1)}>
              Cancel
            </button>
            <button type="submit" className="primary-button" disabled={saving}>
              {saving ? 'Saving...' : id ? 'Update Task' : 'Create Task'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default TaskForm;
