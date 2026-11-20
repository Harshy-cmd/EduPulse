const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String, required: true, trim: true, maxlength: 20000 },
  grade: { type: Number, min: 0, max: 100, default: null },
  feedback: { type: String, trim: true, maxlength: 5000, default: '' },
  status: { type: String, enum: ['Pending', 'Graded'], default: 'Pending' },
  submittedAt: { type: Date, default: Date.now }
}, { timestamps: true });

submissionSchema.index({ studentId: 1 });

const assignmentSchema = new mongoose.Schema({
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true, index: true },
  title: { type: String, required: true, trim: true, maxlength: 200 },
  instructions: { type: String, trim: true, maxlength: 5000, default: '' },
  dueDate: { type: Date, default: null },
  submissions: { type: [submissionSchema], default: [] }
}, { timestamps: true });

module.exports = mongoose.models.Assignment || mongoose.model('Assignment', assignmentSchema);
