const express = require('express');
const app = express();
const serverless = require('serverless-http');

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Webhook Server está funcionando!');
});

app.post('/webhook', (req, res) => {
  console.log('Webhook recebido:', req.body);
  res.status(200).send('Webhook processado com sucesso!');
});

module.exports = app;
module.exports.handler = serverless(app);