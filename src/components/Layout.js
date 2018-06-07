import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';

import { USER_CONNECTED, LOGOUT } from '../config/events';
import { API_URL } from '../config/config';
import { routes } from '../config/routes';
import { USER } from '../config/events';
import FirebaseService from '../services/FirebaseService';

import { Header } from './Parts';

const socketUrl = API_URL;

export default class Layout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: null,
      user: [],
      messages: [],
    };
  }

  componentWillMount() {
    this.initSocket();
  }

  componentDidMount() {
    FirebaseService.getDataList('messages', (dataReceived) => this.setState({ messages: dataReceived }));
  }

  initSocket = () => {
    const socket = io(socketUrl);
    socket.on(USER.USER_CONNECTED, () => {
      console.log('Connected');
    });
    this.setState({ socket });
  }

  setUser = (user) => {
    const { socket } = this.state;
    socket.emit(USER_CONNECTED, user);
  }

  logout = () => {
    const { socket } = this.state;
    socket.emit(LOGOUT);
    this.setState({ user: null });
  }

  render() {
    const { socket} = this.state;

    return (
      <Router>
        <div>
          <Header />
          <Route
            exact
            path={routes.CHAT.URL}
            render={routeProps => <routes.CHAT.COMPONENT { ...routeProps } socket={socket} />}
          />
          <Route
            exact
            path={routes.HELP.URL}
            render={routeProps => <routes.HELP.COMPONENT { ...routeProps } socket={socket} />}
          />
          <Route
            exact
            path={routes.LOG.URL}
            render={routeProps => <routes.LOG.COMPONENT { ...routeProps } socket={socket} messages={this.state.messages} />}
          />
          <Route
            exact
            path={routes.LOGIN.URL}
            render={routeProps => <routes.LOGIN.COMPONENT { ...routeProps } socket={socket} />}
          />
          <Route
            exact
            path={routes.LOGOUT.URL}
            render={routeProps => <routes.LOGOUT.COMPONENT { ...routeProps } socket={socket} />}
          />
        </div>
      </Router>
    )
  }
}