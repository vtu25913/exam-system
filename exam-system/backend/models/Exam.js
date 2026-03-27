const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Exam = sequelize.define('Exam', {
  id:           { type: DataTypes.INTEGER, autoIncrement: true, primaryKey: true },
  title:        { type: DataTypes.STRING, allowNull: false },
  description:  { type: DataTypes.TEXT, defaultValue: '' },
  duration:     { type: DataTypes.INTEGER, allowNull: false },
  totalMarks:   { type: DataTypes.INTEGER, defaultValue: 0 },
  passingMarks: { type: DataTypes.INTEGER, defaultValue: 0 },
  isActive:     { type: DataTypes.BOOLEAN, defaultValue: true },
  createdBy:    { type: DataTypes.INTEGER },
  questions:    { type: DataTypes.JSON, defaultValue: [] },
}, { tableName: 'exams', timestamps: true });

module.exports = Exam;
