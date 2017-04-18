const mongoose = require('mongoose');

const URI = process.env.MONGOLAB_URI || process.env.MONGODB_URI || 'mongodb://localhost:27017/tesi';
const DEBUG = process.env.DEBUG;

module.exports = () => {
  mongoose.Promise = global.Promise;

  mongoose.connection.on('error', (err) => {
    console.error('MongoDB connection error: ' + err);
    process.exit(-1);
  });

  mongoose.connection.on('connected', () => {
    console.log('[DATABASE] => Successfully connected to ' + URI);
  });

  mongoose.connection.on('disconnected', () => {
    console.log('Mongoose connection disconnected');
  });

  process.on('SIGINT', () => {
    mongoose.connection.close(() => {
      console.log('Mongoose connection disconnected through app termination');
      process.exit(0);
    })
  });

  mongoose.connect(URI);
  mongoose.set('debug', DEBUG);

  return mongoose;
};

