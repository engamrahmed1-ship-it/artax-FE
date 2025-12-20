// ScreenNav.js
import React from "react";
import { NavLink } from "react-router-dom";
import "./css/screenNav.css";

const ScreenNav = ({ items }) => {
  return (
    <nav className="screen-nav">
      {items.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) =>
            isActive ? "screen-nav-item active" : "screen-nav-item"
          }
        >
          {item.label}
        </NavLink>
      ))}
    </nav>
  );
};

export default ScreenNav;
