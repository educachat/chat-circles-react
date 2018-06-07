import { getTime, uuid } from './utils';

createUser = ({ username = "" } = {}) => ({
  id: uuid,
  username,
});

export {
  createUser,
}