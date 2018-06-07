import React from 'react';
import { Link } from 'react-router-dom';

import { routes } from '../config/routes';

const Header = () => {
  return (
    <header className="mb-auto">
      <Navigation />
    </header>
  );
}

const Navigation = () => {

  let elRoutes = Object.keys(routes).map((route, i) => {
    if (routes[route].ONLY_AUTH === true) {
      return (
        <li className="nav-item" key={i}>
          <Link className="nav-link" to={ routes[route].URL }>{ routes[route].NAME }</Link>
        </li>
      );
    }
    return '';
  });

  return (
    <nav className="navbar navbar-expand-lg navbar-light" style={{ backgroundColor: "transparent" }}>
      <a className="navbar-brand" href="/">Chat Circles</a>
      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
        <span className="navbar-toggler-icon"></span>
      </button>

      <div className="collapse navbar-collapse" id="navbarSupportedContent">
        <ul className="navbar-nav ml-auto">
          { elRoutes }
        </ul>
      </div>
    </nav>
  );
}

export {
  Header,
  Navigation,
}