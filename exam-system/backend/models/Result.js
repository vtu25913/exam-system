const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Result = sequelize.define('Result', {
  id:          { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  studentId:   { type: DataTypes.INTEGER, allowNull: false },
  examId:      { type: DataTypes.INTEGER, allowNull: false },
  answers:     { type: DataTypes.JSON, defaultValue: [] },
  score:       { type: DataTypes.FLOAT, defaultValue: 0 },
  totalMarks:  { type: DataTypes.FLOAT, defaultValue: 0 },
  percentage:  { type: DataTypes.FLOAT, defaultValue: 0 },
  passed:      { type: DataTypes.BOOLEAN, defaultValue: false },
  timeTaken:   { type: DataTypes.INTEGER },
  submittedAt: { type: DataTypes.DATE, defaultValue: DataTypes.NOW },
}, { tableName: 'results', timestamps: true });

module.exports = Result;
