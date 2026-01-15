import React, { useState } from 'react';
import { ConfirmDeleteDialog } from './ConfirmDeleteDialog';

const baseColors = {
  new: 'status-new',
  contacted: 'status-contacted',
  qualified: 'status-qualified',
  lost: 'status-lost',
  converted: 'status-converted'
};

// This Proxy makes statusColors accept any casing (e.g., statusColors['nEw'])
export const statusColors = new Proxy(baseColors, {
  get: (target, prop) => {
    // If prop is a string, lowercase it; otherwise return as is
    const key = typeof prop === 'string' ? prop.toLowerCase() : prop;
    return target[key] || 'status-default';
  }
});

const getScoreColor = (score) => {
  if (score >= 80) return 'score-high';
  if (score >= 60) return 'score-medium';
  return 'score-low';
};

const getScoreBadge = (score) => {
  if (score >= 80) return 'score-badge-high';
  if (score >= 60) return 'score-badge-medium';
  return 'score-badge-low';
};

export const LeadCard = ({ lead, onClick, onDelete, isSelected, onSelect }) => {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);

  console.log('Rendering LeadCard for lead:', lead.status);

  const handleDelete = (e) => {
    e.stopPropagation();
    setShowDeleteDialog(true);
  };

  const confirmDelete = () => {
    onDelete(lead.id);
    setShowDeleteDialog(false);
  };

  const handleCheckboxClick = (e) => {
    e.stopPropagation();
  };

  const handleCheckboxChange = (e) => {
    onSelect(lead.id, e.target.checked);
  };

  return (
    <>
      <div 
        className={`lead-card ${isSelected ? 'lead-card-selected' : ''}`}
        onClick={onClick}
      >
        <div className="lead-card-header">
          <div className="lead-card-header-left">
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              onClick={handleCheckboxClick}
              className="lead-checkbox"
            />
            <div className="lead-card-title">
              <h3 className="lead-name">{lead.name}</h3>
              <p className="lead-company">{lead.company}</p>
            </div>
          </div>
          <div className="lead-card-header-right">
            {lead.score !== undefined && (
              <span className={`score-badge ${getScoreBadge(lead.score)} ${getScoreColor(lead.score)}`}>
                <span className="score-icon">📈</span>
                {lead.score}
              </span>
            )}
            <button
              className="lead-delete-btn"
              onClick={handleDelete}
            >
              🗑️
            </button>
          </div>
        </div>
        
        <div className="lead-card-body">
          <div className="lead-info-row">
            <span className="info-icon">✉️</span>
            <span className="info-text">{lead.email}</span>
          </div>
          <div className="lead-info-row">
            <span className="info-icon">📞</span>
            <span className="info-text">{lead.phone}</span>
          </div>
          {lead.assignee && (
            <div className="lead-info-row">
              <span className="info-icon">👤</span>
              <span className="info-text">{lead.assignee}</span>
            </div>
          )}
          <div className="lead-info-row">
            <span className="info-icon">📅</span>
            <span className="info-text">{new Date(lead.createdAt).toLocaleDateString()}</span>
          </div>
          <div className="lead-card-footer">
            <span className={`status-badge ${statusColors[lead.status]}`}>
              {lead.status||'Unknown'}
            </span>
            <span className="lead-source">{lead.source}</span>
          </div>
        </div>
      </div>

      <ConfirmDeleteDialog
        open={showDeleteDialog}
        onOpenChange={setShowDeleteDialog}
        onConfirm={confirmDelete}
        leadName={lead.name}
      />
    </>
  );
};

export default LeadCard;