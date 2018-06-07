import React, { Component } from 'react';
import Moment from 'moment';

import { USER } from '../config/events';
import { API_URL, SITE_TITLE } from '../config/config';

import { MessageForm } from './Messages';
import { User } from './User';
import UserService from '../services/UserService';


class ChatPage extends Component {
  
  constructor(props) {
    super(props);
    this.state = {
      users: [],
    };

    this.onUserListed = this.onUserListed.bind(this);
  }
  
  componentDidMount() {
    const { socket } = this.props;
    socket.emit(USER.USER_LIST);
    socket.on(USER.USER_LIST, this.onUserListed);
  }

  onUserListed = (users) => {
    this.setState({ users });
  };

  render() {
    const { socket } = this.props;
    let { users } = this.state;

    let showUsers = users.map((user, i) => <User key={i} user={user} socket={socket} />);
    let me = users.find((user) => user.id === socket.id);

    return (
      <main>
        <div id="chatArea" className="chat-area">
          { showUsers }
        </div>
        <MessageForm me={me}socket={socket} />
      </main>
    );
  }

}

const HelpPage = () => <div className="help-page" />;

const LogPage = (props) => {
  
  Moment.locale('pt-BR');
  let messages = props.messages.map((message, i) => <li key={i}>({Moment(message.sendedAt).format('DD/MM/YYYY HH:mm:ss')}) {message.sender.username}: {message.message}</li>);


  return (<div className="log-page">
    <ul>
      { messages }
    </ul>
  </div>);
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
    console.log(me);
    this.setState({ me });
    socket.emit('userAccessRoom', me);
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

const LogoutPage = () => <div className="logout-page" />;

export {
  ChatPage,
  HelpPage,
  LogPage,
  LoginPage,
  LogoutPage,
}