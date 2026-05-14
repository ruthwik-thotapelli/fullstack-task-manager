const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');

const getTasks = asyncHandler(async (req, res) => {
  const statusFilter = req.query.status;
  const tasks = await Task.findTasks(statusFilter);
  res.status(200).json({ success: true, data: tasks });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findTaskById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }
  res.status(200).json({ success: true, data: task });
});

const createTask = asyncHandler(async (req, res) => {
  const { title, description, status, priority } = req.body;

  if (!title || !description) {
    res.status(400);
    throw new Error('Title and description are required');
  }

  const task = await Task.createTask({ title, description, status, priority });
  res.status(201).json({ success: true, data: task });
});

const updateTask = asyncHandler(async (req, res) => {
  const existingTask = await Task.findTaskById(req.params.id);
  if (!existingTask) {
    res.status(404);
    throw new Error('Task not found');
  }

  const updates = {
    title: req.body.title ?? existingTask.title,
    description: req.body.description ?? existingTask.description,
    status: req.body.status ?? existingTask.status,
    priority: req.body.priority ?? existingTask.priority,
  };

  const updatedTask = await Task.updateTask(req.params.id, updates);
  res.status(200).json({ success: true, data: updatedTask });
});

const deleteTask = asyncHandler(async (req, res) => {
  const existingTask = await Task.findTaskById(req.params.id);
  if (!existingTask) {
    res.status(404);
    throw new Error('Task not found');
  }

  await Task.deleteTask(req.params.id);
  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
