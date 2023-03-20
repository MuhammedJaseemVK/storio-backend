var express = require('express');
var router = express.Router();

var User = require('../models/User')

/* GET users listing. */
router.get('/', function (req, res, next) {
  res.send('respond with a resource');
});
router.post('/register', async function (req, res, next) {
  try {
    const { mobileNumber, password } = req.body
    let user = new User({
      mobileNumber,
      password
    })
    await user.save()
    let token = user.generateAuthToken()
    res.send({ token: user.token })
  } catch (error) {
    console.log(error)
    res.status(500).send("Error!")
  }
});
router.post('/login', async function (req, res, next) {
  try {
    const { mobileNumber, password } = req.body
    let user = await User.findOne({ mobileNumber })
    if (!user) {
      res.status(401).send("Wrong username!")
      return
    }
    
    if (! await user.comparePassword(password)) {
      res.status(401).send("Wrong password!")
      return
    }
    let token = user.generateAuthToken()
    res.send({ token: user.token })
  } catch (error) {
    console.log(error)
    res.status(500).send("Error!")
  }
});

module.exports = router;
