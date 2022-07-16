const express = require('express');
const { Feedconn } = require('../dist');
const credential = require('../cert.json');
const database = require('../database.json');
const messageExample = require('../data.json');

process.on('uncaughtException', function (err) {
  console.info('*** DEBUG uncaughtException ***');
  console.error(err.stack);
});

const app = express();
const feedconnApp = new Feedconn().loadConfig({
  app: 'app',
  credential: {
    ...credential,
    projectId: credential['projectId'] || credential.project_id,
    privateKey: credential['privateKey'] || credential.private_key,
    clientEmail: credential['clientEmail'] || credential.client_email,
  },
  databaseURL: database.url,
});

app.route('/:key').post(async function (req, res, next) {
  try {
    const result = await feedconnApp.send(
      'user1',
      messageExample[req.params.key],
    );
    res.status(200).json(result);
  } catch (err) {
    next(err);
  }
});

app.use((err, req, res, next) => {
  if (err) {
    res.status(err.code || 400).send({ ...err, message: err.message });
  }
});

setInterval(() => {
  feedconnApp.prune({ minDate: Date.now() - 1000 * 60 });
}, 10 * 1000);

app.listen(3000);
