const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
  application_id: {
    type: String,
    required: true,
    unique: true
  },
  full_name: {
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
    required: true,
    trim: true
  },
  program: {
    type: String,
    required: true,
    enum: [
      'general_nursing_midwifery',
      'bachelor_nursing',
      'paramedical_nursing',
      'medical_lab_technician',
      'cardiology_technician',
      'multipurpose_health_assistant'
    ]
  },
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  date_of_birth: {
    type: Date,
    required: true
  },
  address: {
    type: String,
    required: true
  },
  emergency_contact: {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    relationship: { type: String, required: true }
  },
  education: {
    highest_qualification: { type: String, required: true },
    institution: { type: String, required: true },
    year_completed: { type: Number, required: true },
    percentage: { type: Number, required: true }
  },
  documents: {
    id_proof: { type: String },
    education_certificates: { type: String },
    medical_certificate: { type: String }
  },
  notes: {
    type: String,
    default: ''
  },
  timeline: [{
    status: String,
    date: { type: Date, default: Date.now },
    note: String,
    updated_by: String
  }]
}, {
  timestamps: true
});

module.exports = mongoose.model('Application', applicationSchema, 'Admissions'); 