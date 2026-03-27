const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const sequelize = require('./config/db');
const app = express();

app.use(cors({ origin: ['http://localhost:3000', 'http://127.0.0.1:3000'], credentials: true }));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/exams',   require('./routes/exams'));
app.use('/api/results', require('./routes/results'));
app.use('/api/users',   require('./routes/users'));

// Serve React frontend build
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));
app.get('*', (req, res) => res.sendFile(path.join(buildPath, 'index.html')));

const PORT = process.env.PORT || 5000;

sequelize.sync({ alter: true })
  .then(() => {
    console.log('✓ MySQL connected & tables synced');
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('✗ MySQL connection failed:', err.message);
    process.exit(1);
  });
