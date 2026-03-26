const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  questionText:  { type: String, required: true },
  options:       [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true },
  marks:         { type: Number, default: 1 },
});

const examSchema = new mongoose.Schema({
  title:        { type: String, required: true, trim: true },
  description:  { type: String, default: '' },
  duration:     { type: Number, required: true },
  totalMarks:   { type: Number, default: 0 },
  passingMarks: { type: Number, default: 0 },
  isActive:     { type: Boolean, default: true },
  questions:    [questionSchema],
  createdBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

examSchema.pre('save', function (next) {
  this.totalMarks = this.questions.reduce((s, q) => s + q.marks, 0);
  next();
});

module.exports = mongoose.model('Exam', examSchema);
