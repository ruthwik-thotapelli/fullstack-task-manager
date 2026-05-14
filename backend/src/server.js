const path = require('path');
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');

const connectDB = require('./config/db');
const logger = require('./middleware/logger');
const errorHandler = require('./middleware/errorHandler');
const taskRoutes = require('./routes/taskRoutes');
const notificationRoutes = require('./routes/notificationRoutes');
const seedNotifications = require('./seedNotifications');

dotenv.config();
const app = express();

app.use(express.json());
app.use(logger);
app.use(cors({ origin: '*' }));

app.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Task Manager API is running',
  });
});

app.use('/api/tasks', taskRoutes);
app.use('/api/notifications', notificationRoutes);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

connectDB()
  .then(async () => {
    await seedNotifications();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Unable to connect to MongoDB:', error.message);
    process.exit(1);
  });
