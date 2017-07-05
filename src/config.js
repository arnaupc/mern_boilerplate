module.exports = {
  port: process.env.PORT || 3000,
  db: process.env.MONGODB || 'mongodb://localhost:27017/api-rest',
  SECRET_TOKEN: '6777CD62A3E97C837CAF58BCC2AEC',
  SECRET_COOKIES: '6777CD62A3E97C837CAF58BCC2AEC',
};
