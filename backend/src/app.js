const express = require('express');
const app = express();
const sequelize = require('./config/db');
const authRoutes = require('./routes/auth.routes');
const quizRoutes = require('./routes/quiz.routes');
const resultRoutes = require('./routes/result.routes');
const swaggerUI = require('swagger-ui-express');
const specs = require('./docs/swagger');
const path = require('path');

app.use(express.json());
app.use(express.static(path.join(__dirname, '../../frontend')));
app.use('/api', authRoutes);
app.use('/api/quizzes', quizRoutes);
app.use('/api/results', resultRoutes);
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(specs));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, '../../frontend/index.html'));
});

sequelize.sync().then(() => console.log('DB synced')).catch(console.error);

module.exports = app;
