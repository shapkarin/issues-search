var express = require('express'),
    app = express(),
    port = 3000,
    stylus = require('stylus'),
    nib = require('nib');

app
  .set(
    'port', port
  ).set(
    'views', __dirname
  ).set(
    'view engine', 'jade');

function compile(str, path) {
  return stylus(str)
    .set('filename', path)
    .use(nib())
}

app.use(stylus.middleware(
  {
    src: __dirname + '/styles',
    compile: compile
  }
));

app.use(express.static(__dirname ));

app.get('/', function (req, res) {
  res.render('layout',
    { some: 'data'}
  )
});

app.listen(port, function(){
  console.log('App is running at: http://localhost:%s', port);
});
