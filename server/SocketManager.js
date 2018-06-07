(socket) => {

  socket.on('userAccessRoom', (user) => {
    socket.join(user.room);
    users.push(user);
    io.to(user.room).emit('usersListed', users);
    console.log(`usuario ${user.username} entrou na sala ${room}.`)
  })

  socket.on('usersListed', (username) => {
    io.emit('userConnected', username);
    io.emit('usersListed', users);
    console.log(`${username} entrou no chat`);
    console.log(users);
  });

  socket.on('disconnect', () => {
    let user = users.find(x => x.id === socket.id);
    // console.log(user);
    socket.broadcast.emit('userLeft', user);
  });

  socket.on('userSendMessage', (msg) => {
    // console.log(`${msg.user.username} falou ${msg.text}.`);
    io.to(room).emit('chatMessage', msg);
  });

  socket.on('dragUser', (newUser) => {
    users.forEach((user) => {
      (user.id === newUser.id) ? user = newUser : '';
      socket.broadcast.to(room).emit('dragUser', user);
    });
  });

  onUserTyping = (user) => {
    socket.broadcast.to(room).emit('userTyping', user);
  }
  onUserTypingStop = (user) => {
    socket.broadcast.to(room).emit('userTypingStop', user);
  }

  socket.on('userTyping', onUserTyping);
  socket.on('userTypingStop', onUserTypingStop);

}