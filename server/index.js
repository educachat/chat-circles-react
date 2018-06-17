const express = require('express');
const socketIO = require('socket.io');
const path = require('path');

const PORT = process.env.PORT || 3005;
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

let users = [];
const room = 'chat-circles';
let user = {
  color: null,
  id: null,
  room: null,
  username: null,
  x: null,
  y: null,
};

io.on(USER.USER_CONNECT, (socket) => {

  const sid = socket.id;

  console.log(`Usuário conectado com id: ${sid}`)
  socket.emit(USER.USER_CONNECTED, sid);

  socket.on(USER.USER_JOIN_ROOM, (user) => {
    socket.join(room);
    users.push(user);
    io.sockets.emit(USER.USER_LIST, users);
    console.log(`Usuário ${user.username} entrou na sala ${user.room}.`)
  });

  socket.on(USER.USER_LIST, () => {
    console.log(USER.USER_LIST, users);
    socket.to(room).emit(USER.USER_LIST, users);
  });

  socket.on(USER.USER_MOVE, (newUser) => {
    users.forEach((user) => {
      if (user.id === newUser.id) { 
        user.x = newUser.x;
        user.y = newUser.y;
      }
    });
    io.sockets.in(room).emit(USER.USER_LIST, users);
  });

  socket.on(MESSAGE.MESSAGE_SEND, (msg) => {
    io.sockets.in(room).emit(MESSAGE.MESSAGE_RECEIVED, msg);
  });
  
  onUserTyping = (obj) => {
    console.log(obj);
    socket.to(room).emit(USER.USER_TYPING, obj);
  }

  socket.on(USER.USER_TYPING, onUserTyping);

  // === Corrigir ===


  socket.on('disconnect', () => {
    let user = users.find(x => x.id === socket.id);
    // console.log(user);
    socket.broadcast.emit('userLeft', user);
  });

});