const { getPool } = require('../config/db');

const findTasks = async (status) => {
  const pool = getPool();
  const params = [];
  let sql = 'SELECT * FROM tasks';
  if (status) {
    sql += ' WHERE status = ?';
    params.push(status);
  }
  sql += ' ORDER BY createdAt DESC';
  const [rows] = await pool.query(sql, params);
  return rows;
};

const findTaskById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM tasks WHERE id = ?', [id]);
  return rows[0];
};

const createTask = async ({ title, description, status, priority }) => {
  const pool = getPool();
  const [result] = await pool.query(
    'INSERT INTO tasks (title, description, status, priority) VALUES (?, ?, ?, ?)',
    [title, description, status, priority]
  );
  return findTaskById(result.insertId);
};

const updateTask = async (id, updates) => {
  const pool = getPool();
  const fields = [];
  const params = [];

  if (updates.title !== undefined) {
    fields.push('title = ?');
    params.push(updates.title);
  }
  if (updates.description !== undefined) {
    fields.push('description = ?');
    params.push(updates.description);
  }
  if (updates.status !== undefined) {
    fields.push('status = ?');
    params.push(updates.status);
  }
  if (updates.priority !== undefined) {
    fields.push('priority = ?');
    params.push(updates.priority);
  }

  if (fields.length === 0) {
    return findTaskById(id);
  }

  params.push(id);
  await pool.query(`UPDATE tasks SET ${fields.join(', ')} WHERE id = ?`, params);
  return findTaskById(id);
};

const deleteTask = async (id) => {
  const pool = getPool();
  const [result] = await pool.query('DELETE FROM tasks WHERE id = ?', [id]);
  return result.affectedRows > 0;
};

module.exports = {
  findTasks,
  findTaskById,
  createTask,
  updateTask,
  deleteTask,
};
