// var express = require('express');
// var router = express.Router();

// var User = require('../models/User')

// /* GET users listing. */
// router.get('/', function (req, res, next) {
//   res.send('respond with a resource');
// });
// router.post('/register', async function (req, res, next) {
//   try {
//     const { mobileNumber, password } = req.body
//     let user = new User({
//       mobileNumber,
//       password
//     })
//     await user.save()
//     let token = user.generateAuthToken()
//     res.send({ token: user.token })
//   } catch (error) {
//     console.log(error)
//     res.status(500).send("Error!")
//   }
// });
// router.post('/login', async function (req, res, next) {
//   try {
//     const { mobileNumber, password } = req.body
//     let user = await User.findOne({ mobileNumber })
//     if (!user) {
//       res.status(401).send("Wrong username!")
//       return
//     }

//     if (! await user.comparePassword(password)) {
//       res.status(401).send("Wrong password!")
//       return
//     }
//     let token = user.generateAuthToken()
//     res.send({ token: user.token })
//   } catch (error) {
//     console.log(error)
//     res.status(500).send("Error!")
//   }
// });

// module.exports = router;


// Required Libraries
const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Required Models
const User = require('../models/User');

// Multer configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'public/')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// Register new user
router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // Check if user already exists
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    const user = new User({ username, email, password });
    await user.save();

    // Generate authentication token
    const token = await user.generateAuthToken();

    res.status(201).json({ user, token });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ message: 'Server error' });
  }
});

// Verify user credentials and generate auth token
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    // Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid password' });
    }

    // Generate authentication token
    const token = await user.generateAuthToken();

    res.json({ user, token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// Fetch profile
router.get('/profile', async (req, res) => {
  try {
    const { username } = req.query;

    // Find user by username
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: 'Invalid username' });
    }

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Update user profile
router.put('/update', upload.single('profilePic'), async (req, res) => {
  try {
    const { username, mobileNumber, name, address, city, pin, state, country, dob, gender } = req.body;

    // Find user by mobile number
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user profile
    user.name = name;
    user.address = address;
    user.city = city;
    user.pin = pin;
    user.state = state;
    user.country = country;
    user.mobileNumber = mobileNumber
    user.dob = dob
    user.gender = gender

    if (req.file) {
      user.profilePic = req.file.path;
    }

    await user.save();

    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;