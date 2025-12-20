import React from 'react';
import './css/Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        <h1>Artax</h1>
      </div>
      <nav className="header-nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#contact">profile</a></li>
          <li><a href="#contact">logout</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
