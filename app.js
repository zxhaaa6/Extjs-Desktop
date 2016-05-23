var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var session = require('express-session');
var MongoStore = require('connect-mongo')(session);
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var routes = require('./routes/index');
var users = require('./routes/users');

//------------------------初始化日志模块 start------------------------
var fs = require('fs');
var tools = require('./lib/tools');
//logs 文件夹不存在则创建
var hasLogForder = fs.existsSync(__dirname + '/logs');
if (!hasLogForder) {
    fs.mkdirSync(__dirname + '/logs');
}
var log4js = require('log4js');
log4js.configure(__dirname + '/config/log4js.json', {
    cwd: __dirname
});
//------------------------初始化日志模块 end------------------------

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(session({
    secret: '1_donot_kn0w.',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({ url: 'mongodb://localhost/firstExt_session_store' })
}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/users', users);

app.response.sendResult = function(err, data, info) {
    if (data) {
        if (err) {
            var jsonObj = {
                errors: err.stack
            };
            if (info) jsonObj.info = info;
            this.json(500, jsonObj);
        } else {
            var jsonObj = {
                success: true,
                data: data
            };
            if (info) jsonObj.info = info;
            this.json(jsonObj);
        }
    } else {
        if (err instanceof Error) {
            var jsonObj = {
                errors: err.stack
            };
            if (info) jsonObj.info = info;
            this.json(500, jsonObj);
        } else {
            var jsonObj = {
                success: true,
                data: err
            };
            if (info) jsonObj.info = info;
            this.json(jsonObj);
        }
    }
};

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
