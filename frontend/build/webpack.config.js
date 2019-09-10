const webResourcesConfig = require('./webpack.web-resources');
const serviceWorkerConfig = require('./webpack.service-worker');

module.exports = [
  webResourcesConfig,
  serviceWorkerConfig,
];
