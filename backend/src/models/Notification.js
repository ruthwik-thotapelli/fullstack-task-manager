const { getPool } = require('../config/db');

const priorityValues = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const findNotifications = async ({ type, priority, unseen, limit, page }) => {
  const pool = getPool();
  const conditions = [];
  const params = [];

  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (priority) {
    conditions.push('priority = ?');
    params.push(priority);
  }
  if (unseen) {
    conditions.push('seen = 0');
  }

  let sql = 'SELECT * FROM notifications';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }
  sql += ' ORDER BY priorityValue DESC, timestamp DESC';
  sql += ' LIMIT ? OFFSET ?';

  const limitValue = Math.min(Number(limit) || 20, 100);
  const pageValue = Math.max(Number(page) || 1, 1);
  params.push(limitValue, (pageValue - 1) * limitValue);

  const [rows] = await pool.query(sql, params);
  return rows;
};

const countNotifications = async ({ type, priority, unseen }) => {
  const pool = getPool();
  const conditions = [];
  const params = [];

  if (type) {
    conditions.push('type = ?');
    params.push(type);
  }
  if (priority) {
    conditions.push('priority = ?');
    params.push(priority);
  }
  if (unseen) {
    conditions.push('seen = 0');
  }

  let sql = 'SELECT COUNT(*) AS total FROM notifications';
  if (conditions.length > 0) {
    sql += ' WHERE ' + conditions.join(' AND ');
  }

  const [rows] = await pool.query(sql, params);
  return rows[0].total;
};

const findNotificationById = async (id) => {
  const pool = getPool();
  const [rows] = await pool.query('SELECT * FROM notifications WHERE id = ?', [id]);
  return rows[0];
};

const createNotification = async ({ studentId, type, message, priority, metadata }) => {
  const pool = getPool();
  const priorityValue = priorityValues[priority] || priorityValues.Medium;
  const [result] = await pool.query(
    'INSERT INTO notifications (studentId, type, message, priority, priorityValue, metadata) VALUES (?, ?, ?, ?, ?, ?)',
    [studentId, type, message, priority, priorityValue, JSON.stringify(metadata || {})]
  );
  return findNotificationById(result.insertId);
};

const markNotificationRead = async (id) => {
  const pool = getPool();
  await pool.query('UPDATE notifications SET seen = 1 WHERE id = ?', [id]);
  return findNotificationById(id);
};

module.exports = {
  findNotifications,
  countNotifications,
  findNotificationById,
  createNotification,
  markNotificationRead,
};
