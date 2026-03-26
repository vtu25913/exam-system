const Result = require('../models/Result');
const Exam = require('../models/Exam');

exports.submitExam = async (req, res) => {
  try {
    const { examId, answers, timeTaken } = req.body;
    if (await Result.findOne({ student: req.user._id, exam: examId }))
      return res.status(400).json({ message: 'Exam already submitted' });
    const exam = await Exam.findById(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let score = 0;
    const evaluated = exam.questions.map((q) => {
      const sub = answers.find((a) => a.questionId === q._id.toString());
      const selected = sub ? sub.selectedAnswer : -1;
      const isCorrect = selected === q.correctAnswer;
      const marks = isCorrect ? q.marks : 0;
      score += marks;
      return { questionId: q._id, selectedAnswer: selected, isCorrect, marks };
    });

    const percentage = exam.totalMarks > 0 ? Math.round((score / exam.totalMarks) * 10000) / 100 : 0;
    const result = await Result.create({
      student: req.user._id, exam: examId, answers: evaluated,
      score, totalMarks: exam.totalMarks, percentage,
      passed: score >= exam.passingMarks, timeTaken,
    });
    await result.populate('exam', 'title duration totalMarks passingMarks');
    res.status(201).json(result);
  } catch (err) {
    if (err.code === 11000) return res.status(400).json({ message: 'Exam already submitted' });
    res.status(500).json({ message: err.message });
  }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.find({ student: req.user._id })
      .populate('exam', 'title totalMarks passingMarks')
      .sort({ submittedAt: -1 });
    res.json(results);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyResultByExam = async (req, res) => {
  try {
    const result = await Result.findOne({ student: req.user._id, exam: req.params.examId })
      .populate('exam', 'title totalMarks passingMarks questions');
    if (!result) return res.status(404).json({ message: 'Result not found' });
    res.json(result);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllResults = async (req, res) => {
  try {
    const { examId, page = 1, limit = 20 } = req.query;
    const query = examId ? { exam: examId } : {};
    const total = await Result.countDocuments(query);
    const results = await Result.find(query)
      .populate('student', 'name email')
      .populate('exam', 'title totalMarks')
      .sort({ submittedAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ results, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAnalytics = async (req, res) => {
  try {
    const stats = await Result.aggregate([
      { $group: { _id: '$exam', avgScore: { $avg: '$percentage' }, maxScore: { $max: '$percentage' }, minScore: { $min: '$percentage' }, totalAttempts: { $sum: 1 }, passed: { $sum: { $cond: ['$passed', 1, 0] } } } },
      { $lookup: { from: 'exams', localField: '_id', foreignField: '_id', as: 'exam' } },
      { $unwind: '$exam' },
      { $project: { 'exam.title': 1, avgScore: 1, maxScore: 1, minScore: 1, totalAttempts: 1, passed: 1 } },
    ]);
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
