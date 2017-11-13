/*
Dependencies
*/

import express from 'express';
import path from 'path';
import bodyParser from 'body-parser';
import morgan from 'morgan';
import cors from 'cors';
import compression from 'compression';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import cookieSession from 'cookie-session';
import csrf from 'csrf';
import hbs from 'express-handlebars';
import mongoose from 'mongoose';
import fs from 'fs';
import https from 'https';
import webpack from 'webpack';
import webpackDevMiddleware from 'webpack-dev-middleware';
import webpackHotMiddleware from 'webpack-hot-middleware';
import open from 'open'; // si no hi ha errors ens obre automàticament la pàgina


// Config
import { getEnv, getConfig } from './lib/config';
const env = getEnv();
const config = getConfig();

// Webpack Configuration
import webpackConfig from '../webpack.config.babel';

// Custom libs
import logger from './lib/logger';
import * as hbsHelper from './lib/handlebars';

// Routes
import api from './routes/api';


/*
Start Express app
*/

const app = express();

const host = process.env.HOST || 'localhost';
const isDevelopment = env.name !== 'production';

/*
Connect DB
*/

// Build the connection string
// 'mongodb://tvUser:xyz123@localhost:27017/matinales_tv'
const dbURI = `mongodb://${((config.db.user)? config.db.user + ':' + config.db.password + '@' :'') + config.db.host}:${config.db.port}/${config.db.db_name}`;
// Mongoose connection with mongodb
const dbOptions = {};

//mongoose.Promise = global.Promise;
mongoose.Promise = require('bluebird');
mongoose.connect(dbURI, dbOptions)
.then(() => { // if all is ok we will be here
  console.log(`Database connected!!! ${dbURI}`);
})
.catch(err => { // if error we will be here
    console.error('App starting error:', err.stack);
    process.exit(1);
});

/*
Middleware stack
*/

// trust first proxy
app.set('trust proxy', 1);

// Disable x-powered-by
app.disable('x-powered-by');

// Logs
//logger.debug('Overriding Express logger');
app.use(morgan('short', { 'stream': logger.stream }));

// Parse Cookie header and populate req.cookies
app.use(cookieParser(config.secretCookies));
// Cookie session
app.use(cookieSession({
  name: 'session',
  secret: config.secretCookies,
  httpOnly: true,
  maxAge: 24 * 60 * 60 * 1000 // 24 hours
}));

// CSRF protection
//app.use(csrf({ cookie: true }));

// Armoring the API with Helmet
app.use(helmet());
app.use(helmet.referrerPolicy());

// Allow Cross-Origin Resource Sharing (CORS)
app.use(cors());

// Compacting requests using GZIP middleware
app.use(compression());

// Populates request body
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// Public
app.use(express.static(path.join(__dirname,'./public')));

// Template Engine
app.engine('.hbs', hbs({
  extname: '.hbs',
  helpers: hbsHelper
}));
// View Engine setup
app.set('views', path.join(__dirname, './views'));
app.set('view engine', '.hbs');

// Webpack Middleware
if (isDevelopment) {
  // Webpack Compiler
  const webpackCompiler = webpack(webpackConfig);

  app.use(webpackDevMiddleware(webpackCompiler, {
    publicPath: '/build/',
    stats: { colors: true }
  }));

  app.use(webpackHotMiddleware(webpackCompiler));
}

/*
Routes
*/

app.use('/api', api);

// Sending all traffic to react
app.get('*', (req,res) => {
  res.render('index'); // És una plantilla hbs per poder utilitzar compress
});


// Error handlers, last items on middleware stack
/*
// 404
app.use((req, res) => {
  res.status(404);
  res.send('File not found!');
});

// 500
app.use((err, req, res, next) => {
  res.status(500);
  res.send(`Internal server error. ${err.message}`);
});
*/

/*
Server
*/

/*
// Init server, HTTPS??
var credentials = {
  key: fs.readFileSync("key.pem", "utf8"),
  cert: fs.readFileSync("cert.pem", "utf8")
};

https
  .createServer(credentials, app)
  .listen(config.port, () => {
      console.log(`API RESTful http://localhost:${config.port}!`);
  });
  */

// Init server
app.listen(config.port, (err) => {
  if (err) {
    console.log(`Error on db connect!!! ${err}`);
  } else {
    console.log(`Server running on ${host}:${config.port}!`);
    if (isDevelopment) {
      open(`${host}:${config.port}`);
    }
  }
});
