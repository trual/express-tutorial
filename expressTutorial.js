var express = require('express');

var app = express();

app.disable('x-powered-by')

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// more imports here

app.use(require('body-parser').urlencoded({
  extended: true}));

var formidable = require('formidable');

var credentials = require('./credentials.js');
app.use(require('cookie-parser')(credentials.cookieSecret));

app.set('port', process.env.PORT || 3000);

app.use(express.static(__dirname + '/public'));

app.get('/', function(req, res, next){
  res.render('home');
});

app.use(function(req, res, next){
  console.log("Looking for URL : " + req.url);
  next();
});

app.get('/junk', function(req, res, next){
  console.log('tried to access /junk');
  throw new Error('/junk doesn\'t exist');
});

app.use(function(err, reqq, res, next){
  console.log('Error : ' + err.message);
  next();
});

app.get('/about', function(req, res, next){
  res.render('about');
});

app.get('/contact', function(req, res){
  res.render('contact', {csrf: 'CSRF token here'});
});

app.get('/thankyou', function(req, res){
  res.render('thankyou');
});

app.post('/process', function(req, res){
  console.log('Form' + req.query.form);
  console.log('CSRF token : ' + req.body._csrf );
  console.log('Email : ' + req.body.email);
  console.log('Question : ' + req.body.ques);
  res.redirect(303, '/thankyou');
});

app.get('/file-upload', function(req, res){
  var now = new Date();
  res.render('file-upload', {
    year: now.getFullYear(),
    month: now.getMonth()
  });
});

app.post('/file-upload/:year/:month', function( req, res){
  var form = new formidable.IncomingForm();
  form.parse(req, function(err, fields, file){
    if (err)
      return res.redirect(303, '/error');
    console.log('Received FIle');
    console.log(file);
    res.redirect(303, '/thankyou');
  });
});

app.get('/cookie', function(req, res){
  res.cookie('username', 'alex shmalex', {expire: new Date() + 9999}).send('user name has the value of Alex shmalex');
});

app.get('/listcookies', function(req, res){
  console.log("Cookies : ", req.cookies);
  res.send('Look in the console for cookies');
});

app.get('/deletecookie', function(req, res){
  res.clearCookie('username');
  res.send('username Cookie Deleted');
});

var session = require('express-session');

var parseurl = require('parseurl');

app.use(session({
  resave: false,
  saveUnitilialized: true,
  secret: credentials.cookieSecret,
}));

app.use(function(req, res, next){
  var views = req.session.views;

  if(!views){
    views = req.session.views={};
  }

  var pathname = parseurl(req).pathname;
  views[pathname] = (views[pathname] || 0) + 1;
  next();
});

app.get('/viewcount', function(req, res, next){
  res.send('You viewed this page ' + req.session.views['/viewcount'] + ' times');
});

var fs = require("fs");

app.get('/readfile', function(req, res, next){
  fs.readFile('./public/randomfile.txt', function(err, data){
    if (err){
      return console.error(err);
    }
    res.send("the file : " + data.toString());
  });
});

app.get('/writefile', function(req, res, next){
  fs.writefile('./public/randomfile.txt', 'More random text', function(err){
    if (err){
      return console.error(err);
    }
  });
});

app.use(function(req, res){
  res.type('text/html');
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});







app.listen(app.get('port'), function(){
  console.log("express started on ttp://localhost:" + app.get('port') + ' press control c to terminate');
});
