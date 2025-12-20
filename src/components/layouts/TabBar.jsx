import React from 'react';
import { useTabContext } from '../../context/TabContext';
import './css/tabBar.css';

const TabBar = () => {
  const { tabs, activeTabId, switchTab, closeTab } = useTabContext();

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
            onClick={() => switchTab(tab.id)}
          >
            <span className="tab-icon">
              {tab.type === 'B2B' ? '🏢' : '👤'}
            </span>
            <span className="tab-title">{tab.title}</span>
            <button
              className="tab-close"
              onClick={(e) => {
                e.stopPropagation();
                closeTab(tab.id);
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