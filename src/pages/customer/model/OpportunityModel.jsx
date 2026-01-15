import React, { useState } from 'react';
import { X, Save, Trash2, Calendar, DollarSign, Target } from 'lucide-react';
import styles from "../css/opp.module.css"// Changed to use CSS modules import

const OpportunityModel = ({ mode, opportunity, onClose, onSave, onDelete }) => {
  // Local state for form handling (Create or Update)
  const [formData, setFormData] = useState(opportunity ? {
    ...opportunity,
    opportunityId: opportunity.id || opportunity.opportunityId, // Handle both naming conventions
    currency: opportunity.currency || 'EGP'
  } : {
    name: '',
    amount: '',
    stage: 'PROSPECT',
    probability: 10,
    currency: 'EGP',
    closeDate: new Date().toISOString().split('T')[0]
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData, mode === 'details' ? formData.opportunityId : null);
    onClose();
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this opportunity?")) {
      onDelete(formData.opportunityId);
      onClose();
    }
  };

  return (
    <div className={styles['opp-modal-overlay']}>
      <div className={styles['opp-modal-content']}>
        <div className={styles['opp-modal-header']}>
          <div className={styles['opp-header-title']}>
            <div className={styles['opp-icon-badge']}>
              <Target size={20} />
            </div>
            <h3>{mode === 'create' ? 'New Opportunity' : 'Opportunity Details'}</h3>
          </div>
          <button onClick={onClose} className={styles['close-btn']}><X /></button>
        </div>
        
        <form onSubmit={handleSubmit} className={styles['modal-body']}>
          <div className={styles['opp-form-section']}>
            <label>Opportunity Name</label>
            <input 
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="e.g., Enterprise Software License"
              required
            />
          </div>

          <div className={styles['opp-form-row']}>
            <div className={styles['opp-form-section']}>
              <label>Amount</label>
              <div className={styles['input-with-icon']}>
                <DollarSign size={16} />
                <input 
                  type="number"
                  name="amount"
                  value={formData.amount}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className={styles['opp-form-section']}>
              <label>Expected Close Date</label>
              <div className={styles['input-with-icon']}>
                <Calendar size={16} />
                <input 
                  type="date"
                  name="closeDate"
                  value={formData.closeDate}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className={styles['opp-form-row']}>
            <div className={styles['opp-form-section']}>
              <label>Stage</label>
              <select name="stage" value={formData.stage} onChange={handleChange}>
                <option value="PROSPECT">Prospect</option>
                <option value="DISCOVERY">Discovery</option>
                <option value="PROPOSAL">Proposal</option>
                <option value="NEGOTIATION">Negotiation</option>
                <option value="WON">Won</option>
              </select>
            </div>
            <div className={styles['opp-form-section']}>
              <label>Probability ({formData.probability}%)</label>
              <input 
                type="range" 
                name="probability"
                min="0" max="100" 
                value={formData.probability}
                onChange={handleChange}
                className={styles['prob-slider']}
              />
            </div>
          </div>

          <div className={styles['modal-footer']}>
            {mode === 'details' && (
              <button type="button" onClick={handleDelete} className={styles['btn-delete']}>
                <Trash2 size={16} /> Delete
              </button>
            )}
            <div className={styles['footer-actions']}>
              <button type="button" onClick={onClose} className={styles['btn-secondary']}>Cancel</button>
              <button type="submit" className={styles['btn-save']}>
                <Save size={16} /> {mode === 'create' ? 'Create Deal' : 'Update Deal'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default OpportunityModel;