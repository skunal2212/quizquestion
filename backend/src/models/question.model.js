const { DataTypes } = require('sequelize');
const sequelize = require('../config/db');
const Quiz = require('./quiz.model');

const Question = sequelize.define('Question', {
  question_text: DataTypes.STRING,
  options: DataTypes.ARRAY(DataTypes.STRING),
  correct_option_index: DataTypes.INTEGER
});

Quiz.hasMany(Question, { onDelete: 'CASCADE' });
Question.belongsTo(Quiz);

module.exports = Question;
