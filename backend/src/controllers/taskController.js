const Task = require('../models/Task');
const asyncHandler = require('../middleware/asyncHandler');

const getTasks = asyncHandler(async (req, res) => {
  const statusFilter = req.query.status;
  const filter = statusFilter ? { status: statusFilter } : {};
  const tasks = await Task.find(filter).sort({ createdAt: -1 });
  res.status(200).json({ success: true, data: tasks });
});

const getTaskById = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
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

  const task = await Task.create({ title, description, status, priority });
  res.status(201).json({ success: true, data: task });
});

const updateTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  const updates = {
    title: req.body.title ?? task.title,
    description: req.body.description ?? task.description,
    status: req.body.status ?? task.status,
    priority: req.body.priority ?? task.priority,
  };

  Object.assign(task, updates);
  const updatedTask = await task.save();

  res.status(200).json({ success: true, data: updatedTask });
});

const deleteTask = asyncHandler(async (req, res) => {
  const task = await Task.findById(req.params.id);
  if (!task) {
    res.status(404);
    throw new Error('Task not found');
  }

  await task.remove();
  res.status(200).json({ success: true, message: 'Task deleted successfully' });
});

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
};
