/* eslint-disable camelcase */
// eslint-disable-next-line no-unused-vars
const dotenv = require('dotenv').config();
const express = require('express');
const cors = require('cors');

const app = express();

const server = require('http').Server(app);
const io = require('socket.io')(server);
const routes = require('./routes');

const connectedUsers = {};

io.on('connection', socket => {
  const {
    scope,
    refresh_token,
    expiry_date,
    access_token,
    token_type,
  } = socket.handshake.query;
  connectedUsers[refresh_token] = {
    socket: socket.id,
    tokens: {
      scope,
      refresh_token,
      expiry_date,
      access_token,
      token_type,
    },
  };
});

app.use((req, res, next) => {
  req.io = io;
  req.connectedUsers = connectedUsers;
  return next();
});

app.use(cors());
app.use(express.json());
app.use(routes);

server.listen(3333, () => console.log(`Listening on 3333`));
