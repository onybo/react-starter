var path = require('path');
var webpack = require('webpack');
var getConfig = require('../webpack.config');

var app = new (require('express'))()
var port = 3000
var config = getConfig('development');
var compiler = webpack(config);

app.use(require('webpack-dev-middleware')(compiler, {
  noInfo: false,
  publicPath: config.output.publicPath
}));

app.use(require('webpack-hot-middleware')(compiler));

app.use("/", function(req, res){
  res.sendFile(path.join(__dirname, '../index.html'));
});
   
app.listen(port, 'localhost', function(error) {
  if (error) {
    console.error(error);
    return;
  }
  
  console.info("==> 🌎  Listening on port %s. Open up http://localhost:%s/ in your browser.", port, port)
})