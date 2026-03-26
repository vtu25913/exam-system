const router = require('express').Router();
const { getExams, getExam, createExam, updateExam, deleteExam, startExam } = require('../controllers/examController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.get('/', getExams);
router.get('/:id/start', startExam);
router.get('/:id', getExam);
router.post('/', adminOnly, createExam);
router.put('/:id', adminOnly, updateExam);
router.delete('/:id', adminOnly, deleteExam);

module.exports = router;
