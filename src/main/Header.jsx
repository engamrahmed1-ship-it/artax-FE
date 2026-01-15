import React from 'react';
import './css/Header.css';
import logo from '../assets/images/Logo-v2.png'; // Import at the top

const Header = () => {
  return (
    <header className="header">
      <div className="header-logo">
        {/* <h1>Artax</h1> */}
        <img src={logo} alt="Artax Logo" className="logo-image default" />
        {/* <h1>rtax</h1>  */}
      </div>
      <nav className="header-nav">
        <ul>
          <li><a href="#home">Home</a></li>
          <li><a href="#profile">Profile</a></li>
          <li><a href="#logout">Logout</a></li>
        </ul>
      </nav>
    </header>
  );
};

export default Header;
