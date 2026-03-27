const Result = require('../models/Result');
const Exam = require('../models/Exam');
const User = require('../models/User');

exports.submitExam = async (req, res) => {
  try {
    const { examId, answers, timeTaken } = req.body;
    const existing = await Result.findOne({ where: { studentId: req.user.id, examId } });
    if (existing) return res.status(400).json({ message: 'Exam already submitted' });

    const exam = await Exam.findByPk(examId);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });

    let score = 0;
    const evaluated = exam.questions.map((q, i) => {
      const sub = answers.find((a) => String(a.questionId) === String(q.id || i));
      const selected = sub ? sub.selectedAnswer : -1;
      const isCorrect = selected === q.correctAnswer;
      const marks = isCorrect ? (q.marks || 1) : 0;
      score += marks;
      return { questionId: q.id || i, selectedAnswer: selected, isCorrect, marks };
    });

    const percentage = exam.totalMarks > 0 ? Math.round((score / exam.totalMarks) * 10000) / 100 : 0;
    const result = await Result.create({
      studentId: req.user.id, examId, answers: evaluated,
      score, totalMarks: exam.totalMarks, percentage,
      passed: score >= exam.passingMarks, timeTaken,
    });
    res.status(201).json({ ...result.toJSON(), exam: { title: exam.title, duration: exam.duration, totalMarks: exam.totalMarks, passingMarks: exam.passingMarks } });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyResults = async (req, res) => {
  try {
    const results = await Result.findAll({ where: { studentId: req.user.id }, order: [['submittedAt', 'DESC']] });
    const enriched = await Promise.all(results.map(async (r) => {
      const exam = await Exam.findByPk(r.examId, { attributes: ['id', 'title', 'totalMarks', 'passingMarks'] });
      return { ...r.toJSON(), exam };
    }));
    res.json(enriched);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getMyResultByExam = async (req, res) => {
  try {
    const result = await Result.findOne({ where: { studentId: req.user.id, examId: req.params.examId } });
    if (!result) return res.status(404).json({ message: 'Result not found' });
    const exam = await Exam.findByPk(result.examId);
    res.json({ ...result.toJSON(), exam });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAllResults = async (req, res) => {
  try {
    const { examId, page = 1, limit = 20 } = req.query;
    const where = examId ? { examId } : {};
    const offset = (page - 1) * limit;
    const { count, rows } = await Result.findAndCountAll({ where, order: [['submittedAt', 'DESC']], limit: Number(limit), offset });
    const enriched = await Promise.all(rows.map(async (r) => {
      const student = await User.findByPk(r.studentId, { attributes: ['id', 'name', 'email'] });
      const exam = await Exam.findByPk(r.examId, { attributes: ['id', 'title', 'totalMarks'] });
      return { ...r.toJSON(), student, exam };
    }));
    res.json({ results: enriched, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getAnalytics = async (req, res) => {
  try {
    const results = await Result.findAll();
    const examMap = {};
    for (const r of results) {
      if (!examMap[r.examId]) examMap[r.examId] = { scores: [], passed: 0 };
      examMap[r.examId].scores.push(r.percentage);
      if (r.passed) examMap[r.examId].passed++;
    }
    const stats = await Promise.all(Object.entries(examMap).map(async ([examId, data]) => {
      const exam = await Exam.findByPk(examId, { attributes: ['id', 'title'] });
      const avg = data.scores.reduce((a, b) => a + b, 0) / data.scores.length;
      return { exam, avgScore: Math.round(avg * 100) / 100, maxScore: Math.max(...data.scores), minScore: Math.min(...data.scores), totalAttempts: data.scores.length, passed: data.passed };
    }));
    res.json(stats);
  } catch (err) { res.status(500).json({ message: err.message }); }
};
