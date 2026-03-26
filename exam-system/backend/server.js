const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000', 'http://127.0.0.1:3000'],
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth',    require('./routes/auth'));
app.use('/api/exams',   require('./routes/exams'));
app.use('/api/results', require('./routes/results'));
app.use('/api/users',   require('./routes/users'));

// Serve React frontend build
const buildPath = path.join(__dirname, '../frontend/build');
app.use(express.static(buildPath));

// All non-API routes → React app
app.get('*', (req, res) => {
  res.sendFile(path.join(buildPath, 'index.html'));
});

// Connect DB then start server
const PORT = process.env.PORT || 5000;

mongoose
  .connect(process.env.MONGO_URI, {
    serverSelectionTimeoutMS: 5000,
  })
  .then(() => {
    console.log('✓ MongoDB connected');
    app.listen(PORT, () => console.log(`✓ Server running on http://localhost:${PORT}`));
  })
  .catch((err) => {
    console.error('✗ MongoDB connection failed:', err.message);
    console.error('Make sure MongoDB is running: mongod --dbpath C:/data/db');
    // Start server anyway so frontend gets proper error messages
    app.listen(PORT, () => console.log(`⚠ Server running on http://localhost:${PORT} (DB disconnected)`));
  });
