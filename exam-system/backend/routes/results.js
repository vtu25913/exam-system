const router = require('express').Router();
const { submitExam, getMyResults, getMyResultByExam, getAllResults, getAnalytics } = require('../controllers/resultController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.post('/submit', submitExam);
router.get('/analytics', adminOnly, getAnalytics);
router.get('/my', getMyResults);
router.get('/my/:examId', getMyResultByExam);
router.get('/', adminOnly, getAllResults);

module.exports = router;
