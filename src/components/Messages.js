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
  }

  handleMessage = (event) => {
    let { socket } = this.props;
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

    const { message } = this.state;
    const { me, socket } = this.props;
    let messaging = { message, sender: me };

    FirebaseService.pushData('messages', messaging);
    socket.emit(MESSAGE.MESSAGE_SENT, messaging);

    document.querySelector('#messageInput').value=null;
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