import React from 'react';

export const ConfirmDeleteDialog = ({ open, onOpenChange, onConfirm, leadName, isMultiple = false }) => {
  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Are you absolutely sure?</h2>
            <p className="modal-subtitle">
              {isMultiple ? (
                <>
                  This action cannot be undone. This will permanently delete the selected leads
                  and remove their data from the system.
                </>
              ) : (
                <>
                  This action cannot be undone. This will permanently delete the lead
                  <strong> {leadName}</strong> and remove their data from the system.
                </>
              )}
            </p>
          </div>
        </div>
        <div className="modal-footer">
          <button className="btn-secondary" onClick={() => onOpenChange(false)}>
            Cancel
          </button>
          <button
            className="btn-danger"
            onClick={onConfirm}
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
};