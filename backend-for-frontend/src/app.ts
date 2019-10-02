import express, { RequestHandler } from 'express';
import { promises } from 'fs';
import { resolve as resolvePath } from 'path';
import pino from 'pino';
import { stream } from 'got';
import config from './config';
import { name as appName, version as appVersion } from '../package.json';
import pwaManifest from './manifest.json';

const app = express();
const logger = pino();

const emptyHTMLFilePath = resolvePath(`${__dirname}/../templates/index.html`);
const skeleton = promises.readFile(emptyHTMLFilePath);

const renderEmptyHTML: RequestHandler = async (_, res) => {
  const html = (await skeleton).toString().replace(/%STATIC_HOST%/g, config.static.host);

  res
    .type('html')
    .send(html);
};

const proxyServiceWorker: RequestHandler = (_, res) => {
  // TODO use process.env
  stream(`${config.static.host}/assets/build.service-worker.js`, {
    headers: {
      'user-agent': `${appName}/${appVersion} (proxying service worker request)`,
    },
  }).pipe(res);
};

const renderPWAManifest: RequestHandler = (_, res) => {
  res.json(pwaManifest);
};

app.get('/', renderEmptyHTML);
app.get('/new', renderEmptyHTML);
app.get('/edit/:id', renderEmptyHTML);
app.get('/copy/:id', renderEmptyHTML);
app.get('/service-worker.js', proxyServiceWorker);
app.get('/manifest.json', renderPWAManifest);

app.listen(config.port, () => {
  logger.info(`App is listening to incoming connections on port ${config.port}`);
});

process.on('unhandledRejection', (err) => {
  logger.fatal(`Asynchronous action failed: ${err}`, { err });
  process.exit(1);
});
