const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const config = require('../config/config.js');
const sequelize = new Sequelize(config.database, config.username, config.password, config);

const db = {};

const modelFiles = fs.readdirSync(__dirname).filter(file => file.endsWith('.model.js'));

for (const file of modelFiles) {
const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
db[model.name] = model;
}

// Destructure after all models are loaded
const { Quiz, Question, User, Result } = db;

// Define associations after initialization
Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions', onDelete: 'CASCADE' });
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

User.hasMany(Result, { foreignKey: 'userId', as: 'results' });
Result.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Quiz.hasMany(Result, { foreignKey: 'quizId', as: 'results' });
Result.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;

console.log('Loaded models:', Object.keys(db));