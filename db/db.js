let mongoose = require('mongoose');

// import User from './user';
// import Message from './message';

const connectDb = () => {
  return mongoose.connect('mongodb://localhost:27017/storio', {useNewUrlParser: true});
};

module.exports = connectDb