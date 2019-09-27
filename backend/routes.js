const express = require('express');

const routes = express.Router();

const Authentication = require('./src/Authentication');
const Subscribe = require('./src/Subscribe');

routes.get('/signin', Authentication.getAuthorizeUrl);
routes.get('/authenticate', Authentication.authenticate);
routes.post('/subscribe', Subscribe.subscribe);

module.exports = routes;
