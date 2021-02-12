const mongoose = require('mongoose');
const config = require('config');
const uri = config.get('mongoURI');

const connectDB = async() => {
  try {
    await mongoose.connect(uri, {useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true});
    console.log('MongoDB connected!');
  } catch(err) {
    console.error(err.message);
    process.exit(1); // for exiting failure code
  }
};

module.exports = connectDB;