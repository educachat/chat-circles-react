import React, { Component } from 'react';
import Moment from 'moment';

import { USER, MESSAGE } from '../config/events';
import { API_URL, SITE_TITLE } from '../config/config';

import { MessageForm } from './Messages';
import { User } from './User';
import UserService from '../services/UserService';

import Background from './chat-bg.png';

class ChatPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };

    this.onUserList = this.onUserList.bind(this);
  }
  
  componentDidMount() {
    const { socket } = this.props;
    socket.emit(USER.USER_LIST);
    socket.on(USER.USER_LIST, this.onUserList);
    socket.on(MESSAGE.MESSAGE_RECEIVED, this.onMessageReceived);
  }

  onUserList = (users) => {
    this.setState({ users });
  };

  onMessageReceived = (obj) => {

    let { message, sender } = obj;
    let elSender = document.querySelector(`#user-${sender.id}`);
    let text = document.createElement('div');

    text.innerText = message;
    elSender.appendChild(text);

    setTimeout(() => {
      text.innerText = null;
      elSender.removeChild(text);
    }, (3+(2 * message.length))*1000);
  }

  render() {
    const { socket } = this.props;
    const { users } = this.state;

    let showUsers = users.map((user, i) => <User key={i} user={user} socket={socket} />);
    let me = users.find((user) => user.id === socket.id);

    return (
      <main>
        <div id="chatArea" className="chat-area" style={{ backgroundImage: `url(${Background})`}}>
          { showUsers }
        </div>
        <MessageForm me={me} socket={socket} />
      </main>
    );
  }

}

const HelpPage = () => <div className="help-page" />;

class LogPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      messages: props.messages,
    };
  }

  render() {
    const { messages } = this.props;
    Moment.locale('pt-BR');
    let elMessages = null;
    if (messages) {
      elMessages = messages.map((message, i) => <li key={i}>({Moment(message.sendedAt).format('DD/MM/YYYY HH:mm:ss')}) {message.sender.username}: {message.message}</li>);
    } else {
      elMessages = <li>Sem mensagens a serem exibidas...</li>
    }


    return (<div className="log-page">
      <ul>
        { elMessages }
      </ul>
    </div>);
  }
};

class LoginPage extends Component {

  constructor() {
    super();

    this.state = {
      endpoint: API_URL,
      me: null,
    };

    this.changeUsername = this.changeUsername.bind(this);
    this.sendUsername = this.sendUsername.bind(this);
  }

  changeUsername(event) {
    this.setState({ username: event.target.value });
  }

  sendUsername(event) {
    event.preventDefault();
    let { socket } = this.props;
    let me = UserService.createUser(socket.id, this.state.username);
    this.setState({ me });
    socket.emit(USER.USER_JOIN_ROOM, me);
    this.props.history.push('/chat');
  }

  render() {
    return (
      <div id="loginPage" className="login page">
        <h1>Bem vindo ao { SITE_TITLE }</h1>
        <form onSubmit={this.sendUsername} id="userForm">
          <input type="text" id="usernameInput" onChange={this.changeUsername} placeholder="seu apelido..."/>
        </form>
      </div>
    );
  }
}

class LogoutPage extends Component {

  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };

    this.onUserList = this.onUserList.bind(this);
    this.onLogout = this.onLogout.bind(this);
  }
  
  componentDidMount() {
    const { socket } = this.props;
    socket.on(USER.USER_LIST, this.onUserList);
    socket.emit(USER.USER_LIST);
  }

  onUserList = (users) => {
    this.setState({ users });
  };

  onLogout = () => {
    let { socket } = this.props;
    socket.emit(USER.USER_DISCONNECT);
  }

  render() {
    return (
      <div className="logout-page">
        <button onClick={this.onLogout}>Sair do Chat</button>
      </div>
    );
  }
}

export {
  ChatPage,
  HelpPage,
  LogPage,
  LoginPage,
  LogoutPage,
}