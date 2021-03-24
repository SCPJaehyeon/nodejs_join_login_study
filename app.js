var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');

var indexRouter = require('./routes/index');

const https = require('https');
const fs = require('fs');
var app = express();
 
// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.set('port', process.env.PORT || 3000);

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

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


const options = {
	  key: fs.readFileSync('/etc/letsencrypt/live/csecret.ga/privkey.pem'),
	  cert: fs.readFileSync('/etc/letsencrypt/live/csecret.ga/cert.pem'),
	  ca: fs.readFileSync('/etc/letsencrypt/live/csecret.ga/fullchain.pem'),
	  minVersion: "TLSv1.2" 
};
https.createServer(options, app, (req, res) => {
	  res.writeHead(200);
	  res.end('hello SecureSign\n');
}).listen(3000);
