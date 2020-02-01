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
    origins: ['*']
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
server.post('/directline/token', (req, res) => {
    // userId must start with `dl_`
    const userId = (req.body && req.body.id) ? req.body.id : `dl_${Date.now() + Math.random().toString(36) }`;
    const options = {
        method: 'POST',
        uri: 'https://directline.botframework.com/v3/directline/tokens/generate',
        headers: {
            'Authorization': `Bearer ${process.env.directLineSecret}`
        }
    };
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.send({
                token: body.token
            });
        } else {
            res.status(500).send('Call to retrieve token from DirectLine failed');
        }
    });
});

// Listen for incoming requests.
server.post('/directline/alttoken', (req, res) => {
    // userId must start with `dl_`
    const userId = (req.body && req.body.id) ? req.body.id : `dl_${Date.now() + Math.random().toString(36) }`;
    const options = {
        method: 'POST',
        uri: 'https://directline.botframework.com/v3/directline/tokens/generate',
        headers: {
            'Authorization': `Bearer ${process.env.directLineSecret}`
        }
    };
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.send({
                token: body.token
            });
        } else {
            res.status(500).send('Call to retrieve token from DirectLine failed');
        }
    });
});

// Listen for incoming requests.
server.post('/directline/hometoken', (req, res) => {
    // userId must start with `dl_`
    const userId = (req.body && req.body.id) ? req.body.id : `dl_${Date.now() + Math.random().toString(36) }`;
    const options = {
        method: 'POST',
        uri: 'https://directline.botframework.com/v3/directline/tokens/generate',
        headers: {
            'Authorization': `Bearer ${process.env.homeDirectLine}`
        }
    };
    request.post(options, (error, response, body) => {
        if (!error && response.statusCode < 300) {
            res.send({
                token: body.token
            });
        } else {
            res.status(500).send('Call to retrieve token from DirectLine failed');
        }
    });
});
