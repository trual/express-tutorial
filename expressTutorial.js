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

var crendentials = require('./credentials.js');
app.user(require('cookie-parser')(credentials.cookieSecret));

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









app.listen(app.get('port'), function(){
  console.log("express started on ttp://localhost:" + app.get('port') + ' press control c to terminate');
});
