const express = require('express');
const { v4: UUID } = require('uuid');
const cors = require('cors');
const { findUser } = require('./stores');
const AppDispatcher = require('./appDispatcher');

const { API_PORT } = process.env;

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: ['*'],
  methods: ['GET', 'POST'],
  // allowedHeaders: ['"Content-Type", "Authorization"'],
  allowedHeaders: ['*'],
}));
// Stores.users.log();

app.get('/authenticate', (req, res) => {
  // eslint-disable-next-line no-prototype-builtins
  if (req.query.hasOwnProperty('username')) {
    const userID = UUID();
    AppDispatcher.dispatch({
      actionName: 'addUser',
      body: {
        id: userID,
        username: req.query.username,
      },
    });
    res.send(userID);
  } else {
    res.sendStatus(401);
  }
});

app.get('/isauthed', (req, res) => {
  // eslint-disable-next-line no-prototype-builtins
  if (req.query.hasOwnProperty('username')) {
    const found = findUser(req.query.username);
    res.send(!!found);
  } else {
    res.send(400);
  }
});

app.listen(API_PORT, () => {
  console.log(`Listening on ${API_PORT}`);
});
