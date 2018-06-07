// import uuid from 'uuid/v4';
import { randomNumber } from './utils';
import FirebaseService from './FirebaseService';

class UserService {

  static createUser = (id, username) => {
    let colors = [
      '#556270', '#4ECDC4', 
      '#C7F464', '#FF6B6B', 
      '#C44D58', '#281F9E', 
      '#ABC9F4', '#E54056', 
      '#EFAB81', '#93FFCD',
    ];
    
    let user = {
      color: colors[randomNumber(0,9)],
      id: id,
      room: 'chat-circles',
      username,
      x: randomNumber(0,200),
      y: randomNumber(0,200),
    };

    return user;
  }

  static getUsers = (users) => {
    console.log(users);
    this.setState({ users });
  }

  static dragUser = (user) => {
    FirebaseService.pushData('position', {
      id: user.id,
      username: user.username,
      x: user.x,
      y: user.y,
    });
  }

  static typing = (id) => {
    console.log(`typing ${id}`);
    const userElement = document.querySelector(`#user-${id}`);
    userElement.classList.add('typing');
  }
}

export default UserService;