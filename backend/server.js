// import libraries
const mongoose = require('mongoose');
const app = require("./config/express")
const config = require('./config/config');
const logger = require('./config/logger');

// connect to mongo db
let server;

// Connection of mongodb
mongoose.connect(config.mongo.url).then(() => {
  logger.info('Connected to MongoDB');
  server = app.listen(config.port, () => {
    logger.info(`Listening to port ${config.port}`);

  });
}).catch(err => {
  console.log("Mongoose connection error", err.message);
  server.close(() => {
    logger.info('Server closed');
    process.exit(1);
  });
});

// Server process handler
const exitHandler = () => {
  if (server) {
    server.close(() => {
      logger.info('Server closed');
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
};

// Unexpected error handler
const unexpectedErrorHandler = (error) => {
  logger.error(error);
  exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);
new Promise((_, reject) => reject({ test: 'Error' })).catch(() => { });
process.on('SIGTERM', () => {
  logger.info('SIGTERM received');
  if (server) {
    server.close();
  }
});



