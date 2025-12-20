import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import styles from './css/SideMenu.module.css';

const SideMenu = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // Define all possible menu items with the roles that can see them
  const menuItems = [
    { path: '/', label: 'Dashboard', allowedRoles: ['dashboard-list','admin'] },
    { path: '/profile', label: 'Profile', allowedRoles: ['user', 'admin'] },
    { path: '/admin', label: 'Admin Panel', allowedRoles: ['admin'] },
    { path: '/customer', label: 'Customer', allowedRoles: ['customer-list','customer-edit', 'admin'] },
    { path: '/product', label: 'Product', allowedRoles: ['product-list','product-edit','admin'] },
    { path: '/order', label: 'Orders', allowedRoles: ['order-list','order-edit','admin'] },
    { path: '/inventory', label: 'Inventory', allowedRoles: ['inventory-list','inventory-edit','admin'] },
    { path: '/billing', label: 'Billing', allowedRoles: ['bill-list','bill-edit','admin'] },
    { path: '/leads', label: 'Leads', allowedRoles: ['lead-list','lead-edit','admin'] },
  ];

  // Filter menu items based on the current user's roles
  const availableMenuItems = menuItems.filter(item =>
    item.allowedRoles.some(role => user?.roles.includes(role))
  );

  // Handle logout and redirect
  const handleLogout = () => {
    logout(); // Clear auth state
    navigate('/login', { replace: true }); // Redirect to login
  };

  return (
    <aside className={styles.sideMenu}>
      <nav>
        <ul>
          {availableMenuItems.map(item => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) => (isActive ? styles.active : '')}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
      <div className={styles.userInfo}>
        <p>Welcome, {user?.name}</p>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </aside>
  );
};

export default SideMenu;
