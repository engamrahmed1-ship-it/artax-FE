import React, { useState, useEffect } from 'react';
import { ActivityTimeline } from './ActivityTimeline';

const baseColors = {
  new: 'status-new',
  contacted: 'status-contacted',
  qualified: 'status-qualified',
  lost: 'status-lost',
  converted: 'status-converted'
};

export const statusColors = new Proxy(baseColors, {
  get: (target, prop) => {
    const key = typeof prop === 'string' ? prop.toLowerCase() : prop;
    return target[key] || 'status-default';
  }
});

// Helper components for Lead Score
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

const getScoreLabel = (score) => {
  if (score >= 80) return 'Hot';
  if (score >= 60) return 'Warm';
  return 'Cold';
};

export const LeadDetailModal = ({ open, onOpenChange, lead, onEdit, isOpen, onClose, onConvert }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState('details');
  const [formData, setFormData] = useState({});

  const isModalOpen = open || isOpen;

  // Sync form data when lead changes or editing starts
  useEffect(() => {
    if (lead) {
      setFormData({
        name: lead.name || '',
        email: lead.email || '',
        phone: lead.phone || '',
        company: lead.company || '',
        status: lead.status || 'new',
        source: lead.source || '',
        notes: lead.notes || '',
        assignee: lead.assignee || ''
      });
    }
  }, [lead, isEditing]);

  if (!isModalOpen || !lead) return null;

  const handleClose = () => {
    setIsEditing(false);
    if (onOpenChange) onOpenChange(false);
    if (onClose) onClose();
  };

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    onEdit(lead.id, formData);
    setIsEditing(false);
  };

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div style={{ flex: 1 }}>
            {isEditing ? (
              <input 
                className="form-input" 
                value={formData.name} 
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="Lead Name"
              />
            ) : (
              <>
                <h2 className="modal-title">{lead.name}</h2>
                <p className="modal-subtitle">{lead.company}</p>
              </>
            )}
          </div>
          <div className="modal-header-actions">
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn-secondary btn-sm">
                ✏️ Edit Lead
              </button>
            )}
          </div>
        </div>

        <div className="modal-tabs">
          <button
            className={`modal-tab ${activeTab === 'details' ? 'modal-tab-active' : ''}`}
            onClick={() => setActiveTab('details')}
          >
            Details
          </button>
          <button
            className={`modal-tab ${activeTab === 'activity' ? 'modal-tab-active' : ''}`}
            onClick={() => setActiveTab('activity')}
          >
            Activity
          </button>
        </div>

        <div className="modal-body">
          {activeTab === 'details' && (
            <>
              {/* Lead Score Section (Static) */}
              {lead.score !== undefined && (
                <div className="lead-score-section">
                  <div className="lead-score-display">
                    <div className={`lead-score-icon ${getScoreBadge(lead.score)}`}>📈</div>
                    <div>
                      <p className="lead-score-label">Lead Score</p>
                      <p className={`lead-score-value ${getScoreColor(lead.score)}`}>{lead.score}/100</p>
                    </div>
                  </div>
                  <span className={`score-badge ${getScoreBadge(lead.score)}`}>
                    {getScoreLabel(lead.score)} Lead
                  </span>
                </div>
              )}

              {/* Status and Source Row */}
              <div className="detail-status-row">
                <div className="detail-status-item">
                  <span className="detail-status-label">Status:</span>
                  {isEditing ? (
                    <select 
                      className="form-select" 
                      value={formData.status} 
                      onChange={(e) => handleChange('status', e.target.value)}
                    >
                      <option value="new">New</option>
                      <option value="contacted">Contacted</option>
                      <option value="qualified">Qualified</option>
                      <option value="lost">Lost</option>
                    </select>
                  ) : (
                    <span className={`status-badge ${statusColors[lead.status]}`}>
                      {lead.status}
                    </span>
                  )}
                </div>
                <div className="detail-status-divider" />
                <div className="detail-status-item">
                  <span className="info-icon">🏷️</span>
                  {isEditing ? (
                    <input 
                      className="form-input" 
                      value={formData.source} 
                      onChange={(e) => handleChange('source', e.target.value)} 
                    />
                  ) : (
                    <span>{lead.source}</span>
                  )}
                </div>
              </div>

              <div className="detail-section-title">Contact Information</div>
              <div className="detail-grid">
                <div className="detail-item">
                  <span className="detail-icon">✉️</span>
                  <div style={{ flex: 1 }}>
                    <p className="detail-label">Email</p>
                    {isEditing ? (
                      <input className="form-input" value={formData.email} onChange={(e) => handleChange('email', e.target.value)} />
                    ) : (
                      <p className="detail-value">{lead.email}</p>
                    )}
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📞</span>
                  <div style={{ flex: 1 }}>
                    <p className="detail-label">Phone</p>
                    {isEditing ? (
                      <input className="form-input" value={formData.phone} onChange={(e) => handleChange('phone', e.target.value)} />
                    ) : (
                      <p className="detail-value">{lead.phone}</p>
                    )}
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">🏢</span>
                  <div style={{ flex: 1 }}>
                    <p className="detail-label">Company</p>
                    {isEditing ? (
                      <input className="form-input" value={formData.company} onChange={(e) => handleChange('company', e.target.value)} />
                    ) : (
                      <p className="detail-value">{lead.company}</p>
                    )}
                  </div>
                </div>
                <div className="detail-item">
                  <span className="detail-icon">📅</span>
                  <div>
                    <p className="detail-label">Created</p>
                    <p className="detail-value">{new Date(lead.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              </div>

              <div className="detail-section-title">Assigned To</div>
              <div className="assignee-display">
                <div className="assignee-avatar">
                  {(isEditing ? formData.assignee : lead.assignee)?.split(' ').map(n => n[0]).join('') || 'U'}
                </div>
                {isEditing ? (
                  <input className="form-input" value={formData.assignee} onChange={(e) => handleChange('assignee', e.target.value)} placeholder="Assignee name" />
                ) : (
                  <span>{lead.assignee}</span>
                )}
              </div>

              <div className="detail-section-title">Notes</div>
              <div className="detail-notes">
                {isEditing ? (
                  <textarea 
                    className="form-textarea" 
                    value={formData.notes} 
                    onChange={(e) => handleChange('notes', e.target.value)} 
                    rows={4}
                  />
                ) : (
                  <p className="detail-value">{lead.notes || "No notes available."}</p>
                )}
              </div>
            </>
          )}

          {activeTab === 'activity' && <ActivityTimeline activities={lead.activities} />}
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            {isEditing ? 'Discard Changes' : 'Close'}
          </button>
          
          {isEditing ? (
            <button className="btn-primary" onClick={handleSave}>
              💾 Save Updates
            </button>
          ) : (
            lead.status?.toLowerCase() !== 'lost' && onConvert && (
              <button className="btn-primary" onClick={onConvert}>
                🚀 Convert to Customer
              </button>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default LeadDetailModal;