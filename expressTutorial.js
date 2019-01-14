var express = require('express');

var app = express();

app.disable('x-powered-by')

var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');

// more imports here

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
  console.log('Errpr : ' + err.message);
  next();
});

app.get('/about', function(req, res, next){
  res.render('about');
});














app.listen(app.get('port'), function(){
  console.log("express started on ttp://localhost:" + app.get('port') + ' press control c to terminate');
});
