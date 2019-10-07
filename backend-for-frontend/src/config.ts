export default {
  logLevel: process.env.LOGLEVEL || 'info',
  port: process.env.PORT || 80,
  static: {
    host: 'http://localhost:8081',
  },

};
