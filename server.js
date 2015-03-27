var express = require('express');
var app = express();

// set the port of our application
// process.env.PORT lets the port be set by Heroku
var port = process.env.PORT || 8080;

// set the view engine to ejs
app.set('view engine', 'ejs');

// map the EJS template engine to “.html” files
app.engine('html', require('ejs').renderFile);

// change default views directory
app.set('views', __dirname + '/app/pages');

// make express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/app'));

// set the home page route
app.get('/', function(req, res) {

    // ejs render automatically looks in the views folder
    res.render('index.html');
});

app.listen(port, function() {
    console.log('Web Math Editor is running on http://localhost:' + port);
});