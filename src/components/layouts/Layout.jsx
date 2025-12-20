import React from 'react';
import { Outlet } from 'react-router-dom';
import SideMenu from './SideMenu';
import './css/layout.css';
import Header from '../../main/Header';

const Layout = () => {
  return (
    <div className="layout-container">
      <Header />

      <div className="body-container">
        <SideMenu />
        <main className="content">
          <Outlet />
        </main>
      </div>
    </div>

  );
};

export default Layout;
