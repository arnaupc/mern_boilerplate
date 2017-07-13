/*
Dependencies
*/

import express from 'express';
//import passportService from '../lib/passport';
//import passport from 'passport';

// Controllers
import devCtrl from '../controllers/dev';

// Middleware to require login/auth
//const requireAuth = passport.authenticate('jwt', { session: false });
//const requireLogin = passport.authenticate('local', { session: false });

// Router
const api = express.Router();

// Private, ruta x comprovar auth
/*
api.get('/private', requireAuth, (req, res) => {
  res.status(200).send({message: 'Access allowed'});
});
*/

// Server info
api.get('/node_info', devCtrl.nodeInfo);
api.get('/mongo_info', devCtrl.mongoInfo);
api.get('/os_info', devCtrl.osInfo);
api.get('/get_logs', devCtrl.getLogs);

export default api;
