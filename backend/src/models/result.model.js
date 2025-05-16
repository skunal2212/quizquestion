const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const User = require('./user.model');
const Quiz = require('./quiz.model');

const Result = sequelize.define('Result', {
  score: DataTypes.INTEGER,
  total: DataTypes.INTEGER
});

User.hasMany(Result);
Result.belongsTo(User);
Quiz.hasMany(Result);
Result.belongsTo(Quiz);

module.exports = Result;
