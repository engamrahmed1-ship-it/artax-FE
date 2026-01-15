import React, { useState } from 'react';
import { salesRepresentatives } from '../mock/mockLeads';

export const AssignLeadModal = ({ open, onOpenChange, leads, onAssign }) => {
  const [selectedRep, setSelectedRep] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (selectedRep) {
      const rep = salesRepresentatives.find(r => r.id === selectedRep);
      onAssign(rep.name);
      setSelectedRep('');
    }
  };

  if (!open) return null;

  return (
    <div className="modal-overlay" onClick={() => onOpenChange(false)}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Assign Lead{leads?.length > 1 ? 's' : ''}</h2>
            <p className="modal-subtitle">
              {leads?.length > 1 
                ? `Assign ${leads.length} selected leads to a sales representative.`
                : 'Assign this lead to a sales representative.'
              }
            </p>
          </div>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="modal-body">
            <div className="form-group">
              <label htmlFor="sales-rep" className="form-label">Sales Representative *</label>
              <select
                id="sales-rep"
                value={selectedRep}
                onChange={(e) => setSelectedRep(e.target.value)}
                className="form-select"
                required
              >
                <option value="">Select a representative</option>
                {salesRepresentatives.map((rep) => (
                  <option key={rep.id} value={rep.id}>
                    {rep.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={() => onOpenChange(false)}>
              Cancel
            </button>
            <button type="submit" className="btn-primary" disabled={!selectedRep}>
              Assign
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};