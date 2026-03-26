const User = require('../models/User');

exports.getUsers = async (req, res) => {
  try {
    const { search = '', page = 1, limit = 20 } = req.query;
    const query = { role: 'student' };
    if (search) query.$or = [{ name: { $regex: search, $options: 'i' } }, { email: { $regex: search, $options: 'i' } }];
    const total = await User.countDocuments(query);
    const users = await User.find(query).select('-password').sort({ createdAt: -1 }).skip((page - 1) * limit).limit(Number(limit));
    res.json({ users, total, page: Number(page), pages: Math.ceil(total / limit) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (await User.findOne({ email })) return res.status(400).json({ message: 'Email already exists' });
    const user = await User.create({ name, email, password, role: 'student' });
    res.status(201).json({ _id: user._id, name: user.name, email: user.email, role: user.role });
  } catch (err) { res.status(400).json({ message: err.message }); }
};

exports.toggleUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    user.isActive = !user.isActive;
    await user.save();
    res.json({ message: `User ${user.isActive ? 'activated' : 'deactivated'}`, isActive: user.isActive });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.deleteUser = async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ message: 'User deleted' });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
