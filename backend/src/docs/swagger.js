const swaggerJsdoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Quiz Engine API',
      version: '1.0.0',
      description: 'Backend API for managing quizzes and user participation.'
    }
  },
  apis: ['./src/routes/*.js']
};

const specs = swaggerJsdoc(options);
module.exports = specs;
