const Exam = require('../models/Exam');

exports.getExams = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 10 } = req.query;
    const query = req.user.role === 'student' ? { isActive: true } : {};
    if (search) query.title = { $regex: search, $options: 'i' };
    const total = await Exam.countDocuments(query);
    const exams = await Exam.find(query)
      .populate('createdBy', 'name')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(Number(limit));
    res.json({ exams, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.getExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id).populate('createdBy', 'name');
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createExam = async (req, res) => {
  try {
    const exam = await Exam.create({ ...req.body, createdBy: req.user._id });
    res.status(201).json(exam);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.updateExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json(exam);
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.deleteExam = async (req, res) => {
  try {
    const exam = await Exam.findByIdAndDelete(req.params.id);
    if (!exam) return res.status(404).json({ message: 'Exam not found' });
    res.json({ message: 'Exam deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.startExam = async (req, res) => {
  try {
    const exam = await Exam.findById(req.params.id);
    if (!exam || !exam.isActive) return res.status(404).json({ message: 'Exam not available' });
    // Shuffle and strip correct answers
    const shuffled = [...exam.questions].sort(() => Math.random() - 0.5);
    const questions = shuffled.map((q) => ({
      _id: q._id, questionText: q.questionText, options: q.options, marks: q.marks,
    }));
    res.json({ _id: exam._id, title: exam.title, description: exam.description, duration: exam.duration, totalMarks: exam.totalMarks, passingMarks: exam.passingMarks, questions });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
