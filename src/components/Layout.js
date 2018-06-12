import React, { Component } from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import io from 'socket.io-client';

import { API_URL } from '../config/config';
import { routes } from '../config/routes';
import { USER } from '../config/events';

import { Header } from './Parts';

const socketUrl = API_URL;

export default class Layout extends Component {

  constructor(props) {
    super(props);

    this.state = {
      socket: io(socketUrl),
    };
  }

  componentDidMount() {
    const { socket } = this.state;
    socket.on(USER.USER_CONNECTED, (id) => {
      console.log(`Connected on id: ${id}`);
    });
  }

  render() {
    const { socket } = this.state;

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
            render={routeProps => <routes.LOG.COMPONENT { ...routeProps } socket={socket} />}
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