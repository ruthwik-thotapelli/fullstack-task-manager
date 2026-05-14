const Notification = require('./models/Notification');

const sampleNotifications = [
  {
    studentId: '12317077',
    type: 'Placement',
    message: 'New placement drive: Advanced Micro Devices hiring today.',
    priority: 'High',
    metadata: { company: 'AMD' },
  },
  {
    studentId: '12317077',
    type: 'Result',
    message: 'Mid-semester exam results are available in your dashboard.',
    priority: 'Medium',
  },
  {
    studentId: '12317077',
    type: 'Event',
    message: 'Tech fest registration closes today.',
    priority: 'Low',
  },
  {
    studentId: '12317077',
    type: 'Placement',
    message: 'Campus interview at Placement cell starts at 3 PM.',
    priority: 'High',
  },
];

const seedNotifications = async () => {
  const count = await Notification.countDocuments();
  if (count === 0) {
    await Notification.insertMany(sampleNotifications);
    console.log('Seeded notification sample data');
  }
};

module.exports = seedNotifications;
