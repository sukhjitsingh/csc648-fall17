var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var expressValidator = require('express-validator');
var flash = require('connect-flash');
var session = require('express-session');
var passport = require('passport');

var index = require('./routes/index');
var signup = require('./routes/signup');
var listing = require('./routes/listing');
var dashboard = require('./routes/dashboard');
var settings = require('./routes/settings');
var search = require('./routes/search');
var login = require('./routes/login');
var agent = require('./routes/agent');



var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());

app.use(express.static(path.join(__dirname, 'public')));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//app.set('trust proxy', 1);
app.use(session({
    secret: 'keyboard cat',
    saveUninitialized: true,
    resave: false,
    //cookie: {secure: true }
}));

app.use(flash());

//express validator middleware
app.use(expressValidator({
    errorFormatter: function(param, msg, value) {
        var namespace = param.split('.')
            , root    = namespace.shift()
            , formParam = root;

        while(namespace.length) {
            formParam += '[' + namespace.shift() + ']';
        }
        return {
            param : formParam,
            msg   : msg,
            value : value
        };
    }
}));
require('./config/passport')(passport);

app.use(passport.initialize());
app.use(passport.session());


app.use(logger('dev'));

app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
});

app.use('/', index);
app.use('/signup', signup);
app.use('/search', search);
app.use('/listing', listing);
app.use('/dashboard', dashboard);
app.use('/settings', settings);
app.use('/login', login);
app.use('/agent', agent);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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
