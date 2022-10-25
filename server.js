import HTTP from 'http';
import path from 'path';
import { dirname } from 'path';
import { fileURLToPath } from 'url';
import Express from 'express';
import Chalk from 'chalk';
import getZMap from './lib/getZMap.js';
import getTimeSeries from './lib/getTimeseries.js';


const __dirname = dirname(fileURLToPath(import.meta.url));

// unhandled errors should crash the process
process.on('unhandledRejection', error => {
  /* eslint-disable no-console */
  console.error(error);
  console.error(JSON.stringify(error, null, 2));
  console.error(error?.toString() ?? 'THERE IS NO ERROR I JUST SHUT DOWN');
  /* eslint-enable no-console */
  if (error) throw error;
});

const expressApp = Express();

expressApp.use(Express.json());
expressApp.get('/', getIndex);
expressApp.use('/app', Express.static(path.join(__dirname, 'client', 'app')));
expressApp.use('/external', Express.static(path.join(__dirname, 'node_modules')));
expressApp.get('/resources/zmap/*', getZMap);
expressApp.use('/images', Express.static(path.join(__dirname, 'images')));
expressApp.use('/ca', Express.static(path.join(__dirname, 'images', 'results', 'derived')));
expressApp.get('/resources/timeseries/:well/:segment', getTimeSeries);

function getIndex(req, res) {
  res.sendFile(path.join(__dirname, 'client', 'index.html'))
}

const httpServer = HTTP.createServer(expressApp);

httpServer.listen(8081, err => {
  if (err) {
    console.log(Chalk.red(err));// eslint-disable-line no-console
    return;
  }
  console.log(Chalk.cyan(`Listening for connections on port 8081`));// eslint-disable-line no-console
});
