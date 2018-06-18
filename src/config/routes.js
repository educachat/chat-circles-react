import { ChatPage, HelpPage, LoginPage, LogPage, LogoutPage } from '../components/Pages';

const routes = {
  CHAT: {
    COMPONENT: ChatPage,
    NAME: 'Chat',
    ONLY_AUTH: true,
    URL: '/chat',
  },
  LOG: {
    COMPONENT: LogPage,
    NAME: 'Log',
    ONLY_AUTH: true,
    URL: '/log',
  },
  HELP: {
    COMPONENT: HelpPage,
    NAME: 'Help',
    ONLY_AUTH: true,
    URL: '/help',
  },
  LOGIN: {
    COMPONENT: LoginPage,
    NAME: 'Login',
    ONLY_AUTH: false,
    URL: '/',
  },
  LOGOUT: {
    COMPONENT: LogoutPage,
    NAME: 'Logout',
    ONLY_AUTH: true,
    URL: '/logout',
  },
};

export {
  routes,
}