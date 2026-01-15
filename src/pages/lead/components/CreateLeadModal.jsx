import React, { useState, useEffect } from 'react';
import { LEAD_STATUS } from '../types/lead';
import '../css/leads.css';

const CreateLeadModal = ({ isOpen, onClose, onSave }) => {
  const initialState = {
    leadType: 'B2B',
    status: LEAD_STATUS.NEW,
    source: '',
    notes: '',
    firstName: '',
    lastName: '',
    company: '',
    contactPersonName: '',
    email: '',
    phone: '',
    productInterests: [],
    relatedPartyId: null,
    relatedPartyRole: '',
    assignee: '',
    score: 0
  };

  const [formData, setFormData] = useState(initialState);
  const [errors, setErrors] = useState({});
  const [interestInput, setInterestInput] = useState('');

  // Reset state whenever the modal opens
  useEffect(() => {
    if (isOpen) {
      setFormData(initialState);
      setErrors({});
      setInterestInput('');
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.firstName.trim()) newErrors.firstName = 'First Name is required';
    if (!formData.lastName.trim()) newErrors.lastName = 'Last Name is required';
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    if (!formData.phone.trim()) newErrors.phone = 'Phone is required';
    if (!formData.source.trim()) newErrors.source = 'Source is required';

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    // IMPORTANT: prevent standard form behavior AND bubbling
    e.preventDefault();
    e.stopPropagation(); 
    
    if (validateForm()) {
      // Capture any text left in the input box that hasn't been "Entered" yet
      const currentInterests = [...formData.productInterests];
      if (interestInput.trim() && !currentInterests.includes(interestInput.trim())) {
        currentInterests.push(interestInput.trim());
      }

let finalInterests = [...formData.productInterests];
    if (interestInput.trim() && !finalInterests.includes(interestInput.trim())) {
      finalInterests.push(interestInput.trim());
    }

      onSave({ ...formData, productInterests: finalInterests });
      // onClose(); // Explicitly close only after successful validation
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const addInterest = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      e.stopPropagation(); // Stop Enter from submitting the whole form
      const trimmedValue = interestInput.trim();
      if (trimmedValue && !formData.productInterests.includes(trimmedValue)) {
        setFormData(prev => ({
          ...prev,
          productInterests: [...prev.productInterests, trimmedValue]
        }));
        setInterestInput('');
      }
    }
  };

  const removeInterest = (index) => {
    setFormData(prev => ({
      ...prev,
      productInterests: prev.productInterests.filter((_, i) => i !== index)
    }));
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={(e) => {
        // Only close if the background overlay is clicked, not the content
        if (e.target === e.currentTarget) onClose();
    }}>
      <div className="modal-content modal-large" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Create New Lead</h2>
            <p className="modal-subtitle">Details will map to LeadCreateRequest DTO</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="create-lead-form">
          <div className="form-grid">
            <div className="form-group">
              <label className="form-label">Lead Type</label>
              <select name="leadType" value={formData.leadType} onChange={handleChange} className="form-select">
                <option value="B2B">Business (B2B)</option>
                <option value="B2C">Individual (B2C)</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Status *</label>
              <select name="status" value={formData.status} onChange={handleChange} className="form-select">
                <option value={LEAD_STATUS.NEW}>New</option>
                <option value={LEAD_STATUS.CONTACTED}>Contacted</option>
                <option value={LEAD_STATUS.QUALIFIED}>Qualified</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">First Name *</label>
              <input 
                name="firstName" 
                value={formData.firstName} 
                onChange={handleChange} 
                className={`form-input ${errors.firstName ? 'input-error' : ''}`} 
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Last Name *</label>
              <input 
                name="lastName" 
                value={formData.lastName} 
                onChange={handleChange} 
                className={`form-input ${errors.lastName ? 'input-error' : ''}`} 
              />
              {errors.lastName && <span className="error-text">{errors.lastName}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Email *</label>
              <input name="email" type="email" value={formData.email} onChange={handleChange} className="form-input" />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Phone *</label>
              <input name="phone" type="tel" value={formData.phone} onChange={handleChange} className="form-input" />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Company</label>
              <input name="company" value={formData.company} onChange={handleChange} className="form-input" />
            </div>

            <div className="form-group">
              <label className="form-label">Contact Person Name</label>
              <input name="contactPersonName" value={formData.contactPersonName} onChange={handleChange} className="form-input" placeholder="Primary Contact" />
            </div>

            <div className="form-group">
              <label className="form-label">Source *</label>
              <input name="source" value={formData.source} onChange={handleChange} className="form-input" />
              {errors.source && <span className="error-text">{errors.source}</span>}
            </div>

            <div className="form-group">
              <label className="form-label">Assignee</label>
              <input name="assignee" value={formData.assignee} onChange={handleChange} className="form-input" />
            </div>
          </div>

          <div className="form-group" style={{ marginTop: '1rem' }}>
            <label className="form-label">Product Interests (Press Enter to add)</label>
            <div className="interest-tags-container">
              {formData.productInterests.map((item, index) => (
                <span key={index} className="interest-tag">
                  {item} <button type="button" onClick={() => removeInterest(index)}>&times;</button>
                </span>
              ))}
              <input 
                value={interestInput} 
                onChange={(e) => setInterestInput(e.target.value)} 
                onKeyDown={addInterest} 
                placeholder="e.g. Software, Consulting" 
                className="form-input"
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Notes</label>
            <textarea name="notes" rows="3" value={formData.notes} onChange={handleChange} className="form-textarea" />
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={(e) => {
                e.preventDefault();
                onClose();
            }}>Cancel</button>
            <button type="submit" className="btn-primary">Create Lead</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateLeadModal;