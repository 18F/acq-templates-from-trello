'use strict';

require('dotenv').config();
const cfenv = require('cfenv');
const appEnv = cfenv.getAppEnv();

const knownEnvs = [
  'TRELLO_API_KEY',
  'TRELLO_API_TOK',
  'LOG_LEVEL'
];

if (appEnv.getServices() && Object.keys(appEnv.getServices()).length) {
  // If running on Cloud Foundry
  //for (const env of knownEnvs) {
  //  process.env[env] = appEnv.getServiceCreds('acq-trello-cups')[env];
  //}
}
