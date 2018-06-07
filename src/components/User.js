import React, { Component } from 'react';
import socketIOClient from 'socket.io-client';

import { API_URL } from '../config/config';
import { USER, MESSAGE } from '../config/events';
import UserService from '../services/UserService';

class UsernameForm extends Component {

  constructor() {
    super();
    const room = 'chat-circles';
    const colors = [
      '#e21400', '#91580f', '#f8a700', '#f78b00',
      '#58dc00', '#287b00', '#a8f07a', '#4ae8c4',
      '#3b88eb', '#3824aa', '#a700ff', '#d300e7'
    ];
    this.state = {
      endpoint: API_URL,
      me: {
        color: colors[Math.floor(Math.random() * colors.length)],
        id: null,
        room,
        username: null,
        x: null,
        y: null,
      }
    };

    this.changeUsername = this.changeUsername.bind(this);
    this.sendUsername = this.sendUsername.bind(this);
    this.onDragEv = this.onDragEv.bind(this);
  }

  changeUsername = (event) => {
    let me = this.state.me;
    me.username = event.target.value
    this.setState({ me: me });
  }

  sendUsername = (event) => {
    event.preventDefault();
    const socket = socketIOClient(this.state.endpoint);
    let loginPage = document.querySelector('#loginPage');
    socket.emit('userAccessRoom', this.state.me);
    loginPage.style.display = 'none';
  }

  render() {
    return (
      <div id="loginPage" className="login page">
        <h1>Bem vindo ao Chat Circle</h1>
        <form onSubmit={this.sendUsername} id="userForm">
          <input type="text" id="usernameInput" onChange={this.changeUsername} placeholder="seu apelido..."/>
        </form>
      </div>
    );
  }
}

class User extends Component {

  constructor(props) {
    super(props);
    this.state = {
      user: props.user,
    };
  }

  onUserTyping = (obj) => {
    const userElement = document.querySelector(`#user-${obj.id}`);
    if (obj.textLength) {
      userElement.classList.add('typing');
    } else {
      userElement.classList.remove('typing');
    }
  }

  onDrag = (ev) => {
    const { socket } = this.props;
    let { user } = this.state;
    
    let elUser = document.querySelector(`#user-${user.id}`);
    let areaChat = document.querySelector(`#chatArea`);
    let newPos = {};

    if (ev.clientX > areaChat.offsetLeft && ev.clientX < (areaChat.offsetWidth + areaChat.offsetLeft - elUser.offsetWidth)) {
      newPos.x = ev.clientX - areaChat.offsetLeft;
    }
    if (ev.clientY > areaChat.offsetTop && ev.clientY < (areaChat.offsetHeight + areaChat.offsetTop - elUser.offsetHeight)) {
      newPos.y = ev.clientY - areaChat.offsetTop;
    }

    if(newPos.x && newPos.y) {
      user.x = newPos.x;
      user.y = newPos.y;
      this.setState({ user });
    }

    socket.emit(USER.USER_DRAG, user);
    UserService.dragUser(user);

  }

  onMessageReceived = (obj) => {
    let { message, sender } = obj;
    let elSender = document.querySelector(`#user-${sender.id}`);
    let text = document.createElement('div');

    text.innerText = message;
    elSender.appendChild(text);

    setTimeout(() => {
      text.innerText = null;
      elSender.removeChild(text);
    }, (1+(0.04 * message.length))*1000);
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on(USER.USER_TYPING, this.onUserTyping);
    socket.on(USER.USER_DRAG, this.onDrag);
    socket.on(MESSAGE.MESSAGE_RECEIVED, this.onMessageReceived);
  }
  
  render() {
    const { socket } = this.props;
    let { user } = this.state;
    let me = (user.id === socket.id) ? user : null;
    let styleUser = { backgroundColor: user.color, left: user.x, top: user.y };

    if (me) {
      return <div
                className="user me"
                id={ "user-" + user.id }
                style={ styleUser }
                draggable="true"
                onDrag={(ev) => {this.onDrag(ev)}}
                data-username={user.username}
              >
              </div>
    } else {
      return <div
                className="user"
                id={ "user-" + user.id }
                style={ styleUser }
                data-username={user.username}
              >
              </div>
    }
  }
}

export {
  UsernameForm,
  User,
}