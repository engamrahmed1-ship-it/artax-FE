import React from 'react';
import { useTabContext } from '../../context/TabContext';
import './css/tabBar.css';

const TabBar = () => {
  const { tabs, activeTabId, switchTab, closeTab } = useTabContext();

  const checkSelection = (action) => {
    // Check if a global flag or a specific DOM element indicates editing
    // We can check if the "Save" button exists or use window.isEditing
    if (window.isCustomerEditing) {
      const confirmLeave = window.confirm("You have unsaved changes. Are you sure you want to leave?");
      if (!confirmLeave) return;
    }
    // If confirmed or not editing, proceed
    window.isCustomerEditing = false;
    action();
  };

  if (tabs.length === 0) {
    return null;
  }

  return (
    <div className="tab-bar">
      <div className="tab-list">
        {tabs.map(tab => (
          <div
            key={tab.id}
            className={`tab-item ${activeTabId === tab.id ? 'active' : ''}`}
          onClick={() => checkSelection(() => switchTab(tab.id))}
          >
            <span className="tab-icon">
              {tab.type === 'B2B' ? '🏢' : '👤'}
            </span>
            <span className="tab-title">{tab.title}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                checkSelection(() => closeTab(tab.id));
              }}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default TabBar;