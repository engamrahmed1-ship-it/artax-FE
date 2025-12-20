import React from 'react';

const CustomerTabs = ({ activeTab, setActiveTab, customerData }) => {
  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'activity', label: 'Activity' },
    { id: 'purchases', label: 'Purchases' },
    { id: 'notes', label: 'Notes' },
    { id: 'documents', label: 'Documents' },
    { id: 'projects', label: 'Projects' },
    { id: 'tickets', label: 'tickets' },
    { id: 'opportunities', label: 'opportunities' },
  ];

  return (
    <div className="tabs-nav">
      {tabs.map(tab => (
        <button
          key={tab.id}
          className={`tab-btn ${activeTab === tab.id ? 'active' : ''}`}
          onClick={() => setActiveTab(tab.id)}
        >
          {tab.label}
        </button>
      ))}
      {customerData.custType === 'B2B' && (
        <button
          className={`tab-btn ${activeTab === 'contacts' ? 'active' : ''}`}
          onClick={() => setActiveTab('contacts')}
        >
          Contacts
        </button>
      )}
    </div>
  );
};

export default CustomerTabs;
