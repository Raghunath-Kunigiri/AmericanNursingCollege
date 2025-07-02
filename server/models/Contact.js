const mongoose = require('mongoose');

const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    lowercase: true,
    trim: true
  },
  phone: {
    type: String,
    trim: true
  },
  subject: {
    type: String,
    required: true,
    trim: true
  },
  message: {
    type: String,
    required: true
  },
  inquiry_type: {
    type: String,
    enum: ['general', 'admissions', 'financial_aid', 'academic', 'technical'],
    default: 'general'
  },
  status: {
    type: String,
    enum: ['new', 'in_progress', 'resolved'],
    default: 'new'
  },
  assigned_to: {
    type: String,
    default: null
  },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'urgent'],
    default: 'normal'
  },
  conversation: [{
    message: { type: String, required: true },
    sender: { type: String, required: true }, // 'user' or admin name
    timestamp: { type: Date, default: Date.now },
    is_admin_reply: { type: Boolean, default: false }
  }],
  tags: [String],
  notes: {
    type: String,
    default: ''
  },
  resolution_date: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// Add the original message to conversation when creating
contactSchema.pre('save', function(next) {
  if (this.isNew && this.conversation.length === 0) {
    this.conversation.push({
      message: this.message,
      sender: this.name,
      is_admin_reply: false
    });
  }
  next();
});

module.exports = mongoose.model('Contact', contactSchema, 'students'); 