const { Op } = require('sequelize');
const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const where = { role: 'student' };
    if (search) where[Op.or] = [{ name: { [Op.like]: `%${search}%` } }, { email: { [Op.like]: `%${search}%` } }];
    const offset = (page - 1) * limit;
    const { count, rows } = await User.findAndCountAll({ where, attributes: { exclude: ['password'] }, order: [['createdAt', 'DESC']], limit: Number(limit), offset });
    res.json({ users: rows, total: count, page: Number(page), pages: Math.ceil(count / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ where: { email } })) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, role: 'student' });
    res.status(201).json({ _id: user.id, name: user.name, email: user.email, role: user.role });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.update({ isActive: !user.isActive });
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    await user.destroy();
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
