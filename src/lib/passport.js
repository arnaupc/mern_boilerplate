// Dependencies
import passport from 'passport';
import {Strategy as JwtStrategy, ExtractJwt} from 'passport-jwt';
import LocalStrategy from 'passport-local';

// Config
import { getConfig } from './config';
const config = getConfig();

// Models
import User from '../models/user';

// Local authentication options
const localOptions = {
  usernameField: 'username',
  passwordField: 'password'
};

// Setting up local login strategy
const localLogin = new LocalStrategy(localOptions, function(username, password, done) {
  User.getAuthenticated(username, password, function(err, user, reason) {
    if (err) { return done(err, false); }

    if (user) {
      return done(null, user);
    } else {
      return done(null, false);
    }
  });
});

// JWT authentication options
const jwtOptions = {
  // Telling Passport to check authorization headers for JWT
  jwtFromRequest: ExtractJwt.fromAuthHeader(),
  // Telling Passport where to find the secret
  secretOrKey: config.secretToken
};

// Setting up JWT login strategy
const jwtLogin = new JwtStrategy(jwtOptions, function(payload, done) {
  User.findByUserId(payload.sub, function(err, user) {
    if (err) { return done(err, false); }

    if (user) {
      done(null, user);
    } else {
      done(null, false);
    }
  });
});

passport.use(jwtLogin);
passport.use(localLogin);
