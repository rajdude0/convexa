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



const app = express();
const compiler = webpack(webpackConfig);

app.use(webpackDevMiddleware(compiler, {
  publicPath:webpackConfig.output.publicPath
}))
app.use(webpackHotMiddleware(compiler));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}))
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')))


app.use(function(req, res, next){
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
})


// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function(err, req, res, next) {
      res.status(err.status || 500);
      res.json({
        message: err.message,
        error: err
      });
    });
  }
  
  // production error handler
  // no stacktraces leaked to user
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.json({
      message: err.message,
      error: {}
    });
  });


const devServer = new webpackDevServer(webpack(webpackConfig), { proxy:{
  "/api":"http://localhost:3000/"
}, contentBase:"app", inline:true, hot:true, stats: { colors: true }, publicPath: webpackConfig.output.publicPath})
devServer.listen(3001, 'localhost' , (err) => {
  if (err) {
    console.log(err);
  }
  console.log('Listening at localhost:' + 3001 );
  console.log('Opening your system browser...');
  
});
  
const server = http.createServer(app);
server.listen(3000);


