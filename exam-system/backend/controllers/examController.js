const { Op } = require('sequelize');
const Exam = require('../models/Exam');
const User = require('../models/User');

exports.getExams = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const where = req.user.role === 'student' ? { isActive: true } : {};
    if (search) where.title = { [Op.like]: `%${search}%` };
    const offset = (page - 1) * limit;
    const { count, rows } = await Exam.findAndCountAll({ where, order: [['createdAt', 'DESC']], limit: Number(limit), offset });
    res.json({ exams: rows, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createExam = async (req, res) => {
  try {
    const { title, description, duration, passingMarks, isActive, questions } = req.body;
    const totalMarks = (questions || []).reduce((s, q) => s + (q.marks || 1), 0);
    const exam = await Exam.create({ title, description, duration, passingMarks, isActive, questions, totalMarks, createdBy: req.user.id });
    res.status(201).json(exam);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    const questions = req.body.questions || exam.questions;
    const totalMarks = questions.reduce((s, q) => s + (q.marks || 1), 0);
    await exam.update({ ...req.body, totalMarks });
    res.json(exam);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    await exam.destroy();
    res.json({ message: 'Exam deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.startExam = async (req, res) => {
  try {
    const exam = await Exam.findByPk(req.params.id);
    if (!exam || !exam.isActive) return res.status(404).json({ message: 'Exam not available' });
    const shuffled = [...exam.questions].sort(() => Math.random() - 0.5);
    const questions = shuffled.map((q, i) => ({
      _id: q.id || i, questionText: q.questionText, options: q.options, marks: q.marks,
    }));
    res.json({ _id: exam.id, title: exam.title, description: exam.description, duration: exam.duration, totalMarks: exam.totalMarks, passingMarks: exam.passingMarks, questions });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
