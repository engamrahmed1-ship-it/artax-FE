import React from 'react';

export const BulkActionsToolbar = ({ 
  selectedCount, 
  onDelete, 
  onAssign, 
  onExport, 
  onClearSelection 
}) => {
  if (selectedCount === 0) return null;

  return (
    <div className="bulk-actions-toolbar">
      <div className="bulk-actions-content">
        <div className="bulk-actions-info">
          <span className="bulk-count">{selectedCount}</span>
          <span>lead{selectedCount > 1 ? 's' : ''} selected</span>
        </div>
        
        <div className="bulk-actions-divider" />
        
        <div className="bulk-actions-buttons">
          <button
            className="bulk-action-btn bulk-action-assign"
            onClick={onAssign}
          >
            <span className="bulk-action-icon">👤</span>
            Assign
          </button>
          
          <button
            className="bulk-action-btn bulk-action-export"
            onClick={onExport}
          >
            <span className="bulk-action-icon">📥</span>
            Export
          </button>
          
          <button
            className="bulk-action-btn bulk-action-delete"
            onClick={onDelete}
          >
            <span className="bulk-action-icon">🗑️</span>
            Delete
          </button>
        </div>
        
        <div className="bulk-actions-divider" />
        
        <button
          className="bulk-action-close"
          onClick={onClearSelection}
        >
          ✕
        </button>
      </div>
    </div>
  );
};