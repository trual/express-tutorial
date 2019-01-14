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














app.listen(app.get('port'), function(){
  console.log("express started on ttp://localhost:" + app.get('port') + ' press control c to terminate');
});
