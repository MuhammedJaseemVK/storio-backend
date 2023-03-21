var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const cors = require('cors')

require('dotenv').config();

// database connection
let connectDb = require('./db/db')
connectDb().then(async () => {
  console.log("Database connected")
}).catch(error=>{
  console.log(error)
  console.log("Error connecting database !")
})

// var admin = require("firebase-admin");
// var serviceAccount = require("./storio-aaa61-firebase-adminsdk-3g0hh-f9c8a5402d.json");

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var productRouter = require('./routes/products')
var userAuth = require('./middlewares/auth/userAuth')

var app = express();

// socket.io setup
var io = require('socket.io')({}, {
  cors: {
    origin: "*",
    credentials: true
  }
});
app.io = io;

// firebase admin setup
// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
//   databaseURL: "https://storio-aaa61-default-rtdb.asia-southeast1.firebasedatabase.app"
// });
// var db = admin.database();

// route for virtual cart
var cartRouter = require('./routes/virtualCart')(io);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(cors())
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/virtual-cart', () => {
  io.on('connection', socket => {
    let { id } = socket;
    console.log('new connection iddddd:', id);

    socket.on('disconnect', socket => {
      console.log('disconnect id:', id);
    });

    socket.on('ping', socket1 => {
      socket.emit('pong')
    });
  });
});
app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/products', productRouter);

app.get('/login', userAuth, function (req, res) {
  res.send("login")
})

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
