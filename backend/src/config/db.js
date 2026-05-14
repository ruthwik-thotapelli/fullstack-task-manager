const mysql = require('mysql2/promise');

let pool;

const connectDB = async () => {
  const requiredVars = ['MYSQL_HOST', 'MYSQL_USER', 'MYSQL_PASSWORD', 'MYSQL_DATABASE'];
  for (const key of requiredVars) {
    if (!process.env[key]) {
      throw new Error(`${key} must be defined in environment variables`);
    }
  }

  pool = mysql.createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS tasks (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      title VARCHAR(120) NOT NULL,
      description TEXT NOT NULL,
      status ENUM('Pending','In Progress','Completed') NOT NULL DEFAULT 'Pending',
      priority ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium',
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    ) ENGINE=InnoDB;
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS notifications (
      id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
      studentId VARCHAR(64) NOT NULL,
      type ENUM('Event','Result','Placement') NOT NULL,
      message VARCHAR(500) NOT NULL,
      seen TINYINT(1) NOT NULL DEFAULT 0,
      priority ENUM('Low','Medium','High') NOT NULL DEFAULT 'Medium',
      priorityValue TINYINT NOT NULL DEFAULT 2,
      metadata JSON NOT NULL DEFAULT JSON_OBJECT(),
      timestamp DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      createdAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_student_seen (studentId, seen),
      INDEX idx_type_priority (type, priority),
      INDEX idx_createdAt (createdAt)
    ) ENGINE=InnoDB;
  `);

  console.log(`MySQL connected: ${process.env.MYSQL_HOST}`);
};

const getPool = () => {
  if (!pool) {
    throw new Error('Database has not been initialized');
  }
  return pool;
};

module.exports = { connectDB, getPool };
