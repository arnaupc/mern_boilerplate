// Dependencies
import axios from 'axios';


module.exports = {

  login(username, passsword, cb) {

    if (localStorage.token) {
      if (cb) cb(true);
      this.onChange(true);
      return;
    }

    pretendRequest(username, passsword, (res) => {
      if (res.authenticated) {
        localStorage.token = res.token;
        if (cb) cb(true);
        this.onChange(true);
      } else {
        if (cb) cb(false, res);
        this.onChange(false);
      }
    });
  },

  getToken() {
    return localStorage.token;
  },

  logout(cb) {
    delete localStorage.token;
    if (cb) cb();
    this.onChange(false);
  },

  loggedIn() {
    return !!localStorage.token;
  },

  onChange() {}

};

function pretendRequest(username, password, cb) {
  setTimeout(() => {

    axios.post('/api/signin', { username: username, password: password})
    .then(res => {
      return cb(res.data);
    })
    .catch(err => {
      return cb({
        status: err.response.status,
        message: err.response.data.message
      });
    });

  }, 0);
}
