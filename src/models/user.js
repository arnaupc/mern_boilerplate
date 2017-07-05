// Dependencies
import mongoose, {Schema} from 'mongoose';
import bcrypt from 'bcrypt-nodejs';
import crypto from 'crypto';
import shortid from 'shortid';

// Config
const SALT_WORK_FACTOR = 10;
const MAX_LOGIN_ATTEMPTS = 5;
const LOCK_TIME = 2 * 60 * 60 * 1000;

// Schema
const UserSchema = Schema({
  active: {type: Boolean, default: true},
  role: {
    type: String,
    enum: ['user','admin','super'],
    default: 'user'
  },
  userId: {
    type: String,
    unique: true,
    default: shortid.generate
  },
  userName: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: { type: String  }, //select: false // evitem que torni el camp al tornar el model de la bd
  avatar: String,
  profile: {
    firstName: { type: String },
    lastName: { type: String }
  },
  // Logins
  numLogins: { type: Number, default: 0 },
  lastLogin: Date,
  // For reseting password
  resetPasswordToken: String,
  resetPasswordExpires: Date,
  // For login control
  loginAttempts: { type: Number, default: 0 },
  lockUntil: { type: Number }
},
{
  timestamps: true
});

// Indexs
UserSchema.index({ userName: 1, email: 1, created: 1 }); // schema level

// Funcio a executar abans
UserSchema.pre('save', function (next) {
  let user = this;

  if (!user.isModified('password')) return next();

  bcrypt.genSalt(SALT_WORK_FACTOR, (err, salt) => {
    if (err) return next(err);

    bcrypt.hash(user.password, salt, null, (err, hash) => {
      if (err) return next(err);

      user.password = hash;
      next();
    });
  });
});

// Comparar password
UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

// Si està bloquejat
UserSchema.virtual('isLocked').get(function() {
    // check for a future lockUntil timestamp
    return !!(this.lockUntil && this.lockUntil > Date.now());
});

// Incrementar intents
UserSchema.methods.incLoginAttempts = function(cb) {
    // if we have a previous lock that has expired, restart at 1
    if (this.lockUntil && this.lockUntil < Date.now()) {
        return this.update({
            $set: { loginAttempts: 1 },
            $unset: { lockUntil: 1 }
        }, cb);
    }
    // otherwise we're incrementing
    var updates = { $inc: { loginAttempts: 1 } };
    // lock the account if we've reached max attempts and it's not locked already
    if (this.loginAttempts + 1 >= MAX_LOGIN_ATTEMPTS && !this.isLocked) {
        updates.$set = { lockUntil: Date.now() + LOCK_TIME };
    }
    return this.update(updates, cb);
};

// Autenticar
UserSchema.static('getAuthenticated', function(username, password, cb) {
  // find user by email or userName
  this.findOne({$or: [{email: username},{userName: username}]}, (err, user) => {
    if (err) return cb(err);
    if (!user || !password) return cb(null, null, 'NOT_FOUND');

    // check if the account is currently locked
    if (user.isLocked) {
        // just increment login attempts if account is already locked
        return user.incLoginAttempts(function(err) {
            if (err) return cb(err);
            return cb(null, null, 'MAX_ATTEMPTS');
        });
    }

    // test a matching password
    user.comparePassword(password, function(err, isMatch) {

      if (err) return cb(err);
      if (!isMatch) {
        // password is incorrect, so increment login attempts before responding
        return user.incLoginAttempts(function(err) {
            if (err) return cb(err);
            return cb(null, null, 'PASSWORD_INCORRECT');
        });
      }

      // reset attempts and lock info
      var updates = {
          $set: {
            loginAttempts: 0,
            lastLogin: Date.now()
          },
          $inc: { numLogins: 1 },
          $unset: { lockUntil: 1 }
      };

      return user.update(updates, function(err) {
          if (err) return cb(err);
          return cb(null, user);
      });
    });
  });
});

// Buscar segons id
UserSchema.static('findByUserId', function (id, cb) {
  this.findOne({ userId: id }, (err, user) => {
    if (err) return cb(err);
    return cb(null, user);
  });
});

module.exports = mongoose.model('User', UserSchema);
