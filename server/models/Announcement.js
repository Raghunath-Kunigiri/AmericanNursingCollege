const mongoose = require('mongoose');

const announcementSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  content: {
    type: String,
    required: true
  },
  type: {
    type: String,
    enum: ['info', 'success', 'warning', 'error'],
    default: 'info'
  },
  isActive: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: {
    type: Date,
    default: null
  },
  targetPages: [{
    type: String,
    enum: ['homepage', 'applications', 'programs', 'all']
  }],
  created_by: {
    type: String,
    default: 'Admin'
  }
}, {
  timestamps: true
});

// Index for active announcements
announcementSchema.index({ isActive: 1, priority: 1, startDate: 1 });

// Virtual to check if announcement is currently valid
announcementSchema.virtual('isCurrentlyActive').get(function() {
  const now = new Date();
  const isWithinDateRange = this.startDate <= now && (!this.endDate || this.endDate >= now);
  return this.isActive && isWithinDateRange;
});

module.exports = mongoose.model('Announcement', announcementSchema); 