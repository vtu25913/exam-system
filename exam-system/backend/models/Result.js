const mongoose = require('mongoose');

const answerSchema = new mongoose.Schema({
  questionId:     { type: mongoose.Schema.Types.ObjectId },
  selectedAnswer: { type: Number, default: -1 },
  isCorrect:      { type: Boolean, default: false },
  marks:          { type: Number, default: 0 },
});

const resultSchema = new mongoose.Schema({
  student:     { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  exam:        { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
  answers:     [answerSchema],
  score:       { type: Number, default: 0 },
  totalMarks:  { type: Number, default: 0 },
  percentage:  { type: Number, default: 0 },
  passed:      { type: Boolean, default: false },
  timeTaken:   { type: Number },
  submittedAt: { type: Date, default: Date.now },
}, { timestamps: true });

resultSchema.index({ student: 1, exam: 1 }, { unique: true });

module.exports = mongoose.model('Result', resultSchema);
