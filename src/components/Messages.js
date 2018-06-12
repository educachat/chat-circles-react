import React, { Component } from 'react';

import FirebaseService from '../services/FirebaseService';

import { USER, MESSAGE } from '../config/events';

class MessageForm extends Component {

  constructor(props) {
    super(props);
    this.state = {
      messages: {},
      message: null,
    };

    this.handleMessage = this.handleMessage.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  handleMessage = (event) => {
    const { socket } = this.props;
    let obj = {
      id: socket.id,
      textLength: event.target.value.length || 0,
    };
    const userElement = document.querySelector(`#user-${obj.id}`);

    if (obj.textLength) {
      userElement.classList.add('typing');
    } else {
      userElement.classList.remove('typing');
    }

    socket.emit(USER.USER_TYPING, obj);
    this.setState({ message: event.target.value });
  }

  onSubmit = (event) => {
    event.preventDefault();
    const { me, socket } = this.props;
    let obj = {
      id: socket.id,
      textLength: 0,
    };
    const userElement = document.querySelector(`#user-${obj.id}`);

    const { message } = this.state;
    let messaging = { message, sender: me };

    socket.emit(MESSAGE.MESSAGE_SEND, messaging);
    FirebaseService.pushData('messages', messaging);

    document.querySelector('#messageInput').value=null;
    userElement.classList.remove('typing');
    socket.emit(USER.USER_TYPING, obj);
  }

  render() {
    return (
      <form onSubmit={this.onSubmit} id="messageForm">
        <div className="form-group col-md-12">
          <label htmlFor="messageInput">Message:</label>
          <div className="input-group mb-3">
            <input type="text" id="messageInput" className="form-control" placeholder="Digite sua mensagem..." aria-label="Digite sua mensagem..." onChange={this.handleMessage} aria-describedby="basic-addon2" />
            <div className="input-group-append">
              <button type="submit" className="btn btn-secondary">Send</button>
            </div>
          </div>
        </div>
      </form>
    );
  }
};

export {
  MessageForm,
};