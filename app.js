import express from 'express';
import logger from 'morgan';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';
import path from 'path';
import http from 'http';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware'
import webpackHotMiddleware from 'webpack-hot-middleware';
import webpackConfig from './webpack.config';
import webpackDevServer from 'webpack-dev-server';
import os from 'os';
import mongoose from 'mongoose';
import configs from './configs';
import { exec } from 'child_process';



mongoose.Promise = global.Promise;
mongoose.connect(`${configs.MONGODB}/node-demo`);
var inputSchema = new mongoose.Schema({
    iname:String,
    ivalue:String
});
var studioSchema = new mongoose.Schema({
    api: String,
    userinputs: [{}],
    method: String,
    intents:Array,
    resType:String

});
var Studio = mongoose.model("Studio", studioSchema);



const app = express();
const compiler = webpack(webpackConfig);
const router = express.Router();

app.use(webpackDevMiddleware(compiler, {
  publicPath:webpackConfig.output.publicPath
}))
app.use(webpackHotMiddleware(compiler));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))


router.get("/", (req, res, next) => {
  res.json({ message: "API is working" });
})

router.post('/save', function(req, res) {
  var myData = new Studio(req.body);
  myData.save().then(function(item){
      res.send("Name saved to database");
  })
  .catch(function(err){
      res.status(400).send("Unable to save to database");
 });

});

app.use('/api', router)
app.use(function (req, res, next) {
  const err = new Error('Not Found');
  err.status = 404;
  next(err);
})


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.json({
    message: err.message,
    error: {}
  });
});


const devServer = new webpackDevServer(webpack(webpackConfig), {
  proxy: {
    "/api/*": `http://localhost:${configs.APIPORT}/`
  }, contentBase: "app", inline: true, hot: true, stats: { colors: true }, publicPath: webpackConfig.output.publicPath
})
devServer.listen(configs.UIPORT, 'localhost', (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + configs.UIPORT);
  console.log('Opening your system browser...');
  const cmdPrex = os.type() === 'Darwin' ? 'open' : 'start';
  exec(`${cmdPrex} http://localhost:${configs.UIPORT}`);

});

const server = http.createServer(app);
server.listen(configs.APIPORT);


