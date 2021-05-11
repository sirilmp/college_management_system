var createError = require('http-errors');
var express = require('express');
var hbs = require('express-handlebars');
var handlebars = require('handlebars')
var fileuplode = require('express-fileupload');
var db = require('./config/connections');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var session = require('express-session')


var studentRouter = require('./routes/student')
var staffsRouter = require('./routes/staffs');
var adminRouter = require('./routes/admin');
var libraryRouter = require('./routes/library');
var teachersRouter = require('./routes/teachers');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

handlebars.registerHelper("inc", function (value, options) {
  return parseInt(value) + 1;
});

handlebars.registerHelper("math", function(lvalue, operator, rvalue, options) {
  lvalue = parseFloat(lvalue);
  rvalue = parseFloat(rvalue);
      
  return {
      "+": lvalue + rvalue,
      "-": lvalue - rvalue,
      "*": lvalue * rvalue,
      "/": lvalue / rvalue,
      "%": lvalue % rvalue
  }[operator];
});

handlebars.registerHelper('ifeq', function (a, b, options) {
  if (a == b) { return options.fn(this); }
});
handlebars.registerHelper('dueCheckT', function (a, b, options) {
  if (a == b) {
    return options.fn(this);
  } else {
    return options.inverse(this);
  }
});

//handlebars setup
app.engine('hbs', hbs({
  extname: 'hbs',
  defaultLayout: 'layouts',
  layoutsDir: __dirname + '/views/layouts/',
  partialsDir: __dirname + '/views/partials/',
}))

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(fileuplode());
app.use(session({ secret: "key", cookie: { maxAge: 60000000 } }))
db.connect(function (err) {
  if (err)
    console.log("connection error");
  else
    console.log("connected to database");
});


app.use('/students', studentRouter)
app.use('/staffs', staffsRouter);
app.use('/admin', adminRouter);
app.use('/library', libraryRouter);
app.use('/teachers', teachersRouter)
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
