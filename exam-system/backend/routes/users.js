const router = require('express').Router();
const { getUsers, createUser, toggleUser, deleteUser } = require('../controllers/userController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect, adminOnly);
router.get('/', getUsers);
router.post('/', createUser);
router.put('/:id/toggle', toggleUser);
router.delete('/:id', deleteUser);

module.exports = router;
