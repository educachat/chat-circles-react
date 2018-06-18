import React, { Component } from 'react';

import { USER } from '../config/events';
import UserService from '../services/UserService';

class User extends Component {

  constructor(props) {
    super(props);
    // this.state = {
    //   user: props.user,
    // };
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
    let { user } = this.props;
    
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
    }

    this.onMoveUser(user);
    socket.emit(USER.USER_MOVE, user);
    UserService.dragUser(user);
  }

  onMoveUser = (user) => {
    // this.setState({ user });
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.on(USER.USER_TYPING, this.onUserTyping);
  }
  
  render() {
    const { socket } = this.props;
    let { user } = this.props;
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
  // UsernameForm,
  User,
}