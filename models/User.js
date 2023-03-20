const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  mobileNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  token: {
    type: String
  }
}, {timestamps:true});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  const user = this;

  if (user.isModified('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }

  next();
});

// Compare the password with the hashed password
userSchema.methods.comparePassword = async function (password) {
  const user = this;

  return bcrypt.compare(password, user.password);
};

// Generate an authentication token
userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);

  user.token = token
  await user.save();

  return token;
};

const User = mongoose.model('User', userSchema);

module.exports = User;