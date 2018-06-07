import { MESSAGE } from '../config/events';
import { getTime, uuid } from './utils';

createMessage = ({ message = "", sender = "", sendedAt = ""} = {}) => ({
  id: uuid,
  message,
  sender,
  sendedAt = getTime(new Date(Date.now())),
});

export {
  createMessage,
}