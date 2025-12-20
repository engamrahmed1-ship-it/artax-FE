import React from 'react';

const CustomerHeader = ({ customerData, isEditing, setIsEditing, handleSave, handleCancel }) => {
  return (
    <div className="customer-header">
      <div className="customer-header-left">
        <div className="customer-avatar">
          {customerData.firstName[0]}{customerData.lastName[0]}
        </div>
        <div className="customer-title">
          <h1>{customerData.firstName} {customerData.lastName}</h1>
          <p className="customer-subtitle">{customerData.position} at {customerData.company}</p>
          <span className={`status-badge ${customerData.status.toLowerCase()}`}>
            {customerData.status}
          </span>
        </div>
      </div>
      <div className="customer-header-right">
        {!isEditing ? (
          <button className="btn-primary" onClick={() => setIsEditing(true)}>
            ✏️ Edit
          </button>
        ) : (
          <div className="edit-actions">
            <button className="btn-success" onClick={handleSave}>💾 Save</button>
            <button className="btn-secondary" onClick={handleCancel}>✖️ Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerHeader;
