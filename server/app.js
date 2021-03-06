const createError = require('http-errors');
const express = require('express');
const path = require('path');
const cookieParser = require('cookie-parser');

var cors = require('cors')

const mongoose = require('mongoose');
const bodyParser = require('body-parser');



let dev_db_url = 'mongodb://admin:admin123@ds149676.mlab.com:49676/full-ie-projekt';
//let dev_db_url = 'mongodb://jakub07:jakub07@ds155529.mlab.com:55529/ii_projekt';
let mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, {useCreateIndex: true, useNewUrlParser: true});
mongoose.Promise = global.Promise;
let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

//Imports routes for the everything
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/userRoute');

const ticketRouter = require('./routes/ticketRoute');
const lineRouter = require('./routes/lineRoute');
const adminRouter = require('./routes/adminRoute');

const app = express();
app.use(cors());
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');



app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
//Przypisanie zmiennych do url
app.use('/api', indexRouter);
app.use('/api/user', usersRouter);
app.use('/api/admin', adminRouter);
app.use('/api/ticket', ticketRouter);
app.use('/api/line', lineRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});



module.exports = app;
