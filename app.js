var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session');
var bodyParser = require('body-parser');
var passport = require('passport');

// 경로 
var passportConfig = require('./app/config/passport');
var indexRouter = require('./app/routes/index');
var usersRouter = require('./app/routes/users');
var noticeRouter = require('./app/routes/notice/notice');
var loginRouter = require('./app/routes/member/login');
var roomRouter = require('./app/routes/room/room');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'app/views'));
app.set('view engine', 'hbs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(bodyParser.json());
app.use(session({
    secret:'keyboard cat',
    resave:false,
    saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());
passportConfig();


app.use('/', indexRouter);
app.use('/users', usersRouter);
app.use('/login', loginRouter);
app.use('/notice', noticeRouter);
app.use('/room', roomRouter);

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
