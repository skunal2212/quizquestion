const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');

const Quiz = sequelize.define('Quiz', {
  title: DataTypes.STRING,
  description: DataTypes.TEXT,
  time_limit: DataTypes.INTEGER // in seconds
});

module.exports = Quiz;
