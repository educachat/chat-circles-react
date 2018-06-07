const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
// const SocketManager = require('./SocketManager');

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../build/index.html');
const ASSETS = path.join(__dirname, '../build/static');

const server = express()
  .use('/static', express.static(ASSETS))
  .use('/', (req, res) => {
    res.sendFile(INDEX);
  })
  .listen(PORT, () => console.log(`Listening on ${ PORT }`));

const io = socketIO(server);

const events = require('../src/config/events');
const { USER, MESSAGE } = events;

const room = 'chat-circles';
let users = [];
let user = {
  color: null,
  id: null,
  room: null,
  username: null,
  x: null,
  y: null,
};

io.on('connection', (socket) => {

  socket.on('userAccessRoom', (user) => {
    socket.join(user.room);
    users.push(user);
    io.to(user.room).emit(USER.USER_LIST, users);
    console.log(`usuario ${user.username} entrou na sala ${room}.`)
  })

  socket.on(USER.USER_LIST, () => {
    console.log(USER.USER_LIST, users);
    io.emit(USER.USER_LIST, users);
  });

  socket.on('disconnect', () => {
    let user = users.find(x => x.id === socket.id);
    // console.log(user);
    socket.broadcast.emit('userLeft', user);
  });

  socket.on(MESSAGE.MESSAGE_SENT, (msg) => {
    console.log(MESSAGE.MESSAGE_SENT, msg);
    io.to(room).emit(MESSAGE.MESSAGE_RECEIVED, msg);
  });

  socket.on(USER.USER_DRAG, (newUser) => {
    users.forEach((user) => {
      (user.id === newUser.id) ? user = newUser : '';
      io.to(room).emit(USER.USER_DRAG, user);
    });
  });

  onUserTyping = (obj) => {
    console.log(obj);
    socket.to(room).emit(USER.USER_TYPING, obj);
  }

  socket.on(USER.USER_TYPING, onUserTyping);

});