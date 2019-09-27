/**VARIABLES SECTION*/
const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const indexRouter = require('./routes/index');
const usersRouter = require('./routes/users');
const coursesRouter = require('./routes/courses');
const app = express();
const models = require('./models');
const sequelize = models.sequelize; //declare and init model
const { User, Course } = models;

//MIDDLEWARE, ENGINE SETUP, & ROUTES SECTION
app.set('views', path.join(__dirname, 'views'));
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));
app.use('/', indexRouter);
app.use('/api/users', usersRouter);
app.use('/api/courses', coursesRouter);

//ERROR HANDLER SECTION
// catch 404 then handle error
app.use(function(req, res, next) {
  next(createError(404));
});

// global error handler
app.use(function(err, req, res, next) {
  // set locals and provide error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render error page
  res.status(err.status || 500);
  res.json(err);
});

module.exports = app;