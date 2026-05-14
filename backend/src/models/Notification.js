const mongoose = require('mongoose');

const priorityValues = {
  Low: 1,
  Medium: 2,
  High: 3,
};

const notificationSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: [true, 'Student ID is required'],
      index: true,
    },
    type: {
      type: String,
      enum: ['Event', 'Result', 'Placement'],
      required: [true, 'Notification type is required'],
      index: true,
    },
    message: {
      type: String,
      required: [true, 'Message is required'],
      trim: true,
      maxlength: [500, 'Message cannot exceed 500 characters'],
    },
    seen: {
      type: Boolean,
      default: false,
      index: true,
    },
    priority: {
      type: String,
      enum: ['Low', 'Medium', 'High'],
      default: 'Medium',
      index: true,
    },
    priorityValue: {
      type: Number,
      default: priorityValues.Medium,
      index: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.pre('validate', function (next) {
  this.priorityValue = priorityValues[this.priority] || priorityValues.Medium;
  next();
});

module.exports = mongoose.model('Notification', notificationSchema);
