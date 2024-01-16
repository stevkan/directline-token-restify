// Copyright (c) Microsoft Corporation. All rights reserved.
// Licensed under the MIT License.
const path = require('path');
const restify = require('restify');
const bodyParser = require('body-parser');
const request = require('request');
const corsMiddleware = require('restify-cors-middleware');
const ENV_FILE = path.join(__dirname, '.env');
require('dotenv').config({
    path: ENV_FILE || process.env.directLineSecret
});
const cors = corsMiddleware({
    origins: ['http://localhost:3500', 'http://localhost:4200', 'http://localhost:8000', 'https://webchats.ngrok.io'],
    allowHeaders: ['*']
});
// Create HTTP server.
let server = restify.createServer();
server.pre(cors.preflight);
server.use(cors.actual);
server.use(bodyParser.json({
    extended: false
}));
server.dl_name = 'DirectLine';
server.listen(process.env.port || process.env.PORT || 3500, function() {
    console.log(`\n${ server.dl_name } listening to ${ server.url }.`);
});
// Listen for incoming requests.
server.post('/directline/token', (req, res, next) => {
    // console.log(req, res)
    const userId = (req.body && req.body.id) ? req.body.id : `dl_${Date.now() + Math.random().toString(36) }`;
    const options = {
      method: 'POST',
      uri: 'https://directline.botframework.com/v3/directline/tokens/generate',
      headers: {
        // 'Authorization': `Bearer ${process.env.botberg}`
        Authorization: `Bearer IuEDEaLlbgE.Z65fJZBB2q_ibjy-dmHwWCwmx_2oiK_8HSyl01ZFQZs`,
      },
      json: {
        user: {
          ID: userId,
        },
      },
    };
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.send(body);
        } else {
            res.status(500)
            res.send('Call to retrieve token from DirectLine failed');
        }
    });
});

server.post('/speechservices/token', async (req, res) => {
  const origin = req.header('origin');

  console.log('Someone requested a speech token...');

  const options = {
    method: 'POST',
    uri: `https://${ process.env.SPEECH_SERVICES_REGION }.api.cognitive.microsoft.com/sts/v1.0/issueToken`,
    headers: {
      'Ocp-Apim-Subscription-Key': process.env.SPEECH_SERVICES_SUBSCRIPTION_KEY
    }
  };
  request.post(options, (error, response, body) => {
    if (!error && response.statusCode < 300) {
      res.send(body);
      console.log('Someone requested a speech token...');
    } else {
      res.status(500);
      res.send('Call to retrieve token from DirectLine failed');
    }
  });
});
