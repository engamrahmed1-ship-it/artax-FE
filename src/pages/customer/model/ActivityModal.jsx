import React, { useState } from 'react';
import '../css/customerInfo.css';
import { X, Phone, Mail, Calendar, MessageSquare } from 'lucide-react';

const ActivityModal = ({ isOpen, onClose, onSubmit, activityType }) => {
  const [formData, setFormData] = useState({
    type: activityType || 'call',
    subject: '',
    description: '',
    duration: '',
    outcome: '',
    scheduledDate: '',
    scheduledTime: '',
    notes: ''
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const getModalConfig = () => {
    switch (activityType) {
      case 'call':
        return {
          title: '📞 Log Call Activity',
          icon: <Phone size={24} />,
          fields: ['subject', 'duration', 'outcome', 'notes']
        };
      case 'email':
        return {
          title: '✉️ Log Email Activity',
          icon: <Mail size={24} />,
          fields: ['subject', 'description', 'notes']
        };
      case 'meeting':
        return {
          title: '👥 Schedule Meeting',
          icon: <Calendar size={24} />,
          fields: ['subject', 'scheduledDate', 'scheduledTime', 'duration', 'notes']
        };
      case 'message':
        return {
          title: '💬 Log Message Activity',
          icon: <MessageSquare size={24} />,
          fields: ['subject', 'description', 'notes']
        };
      default:
        return {
          title: 'Log Activity',
          icon: null,
          fields: ['subject', 'description', 'notes']
        };
    }
  };

  const config = getModalConfig();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.subject.trim()) {
      newErrors.subject = 'Subject is required';
    }

    if (activityType === 'call' && !formData.duration) {
      newErrors.duration = 'Duration is required for calls';
    }

    if (activityType === 'meeting') {
      if (!formData.scheduledDate) {
        newErrors.scheduledDate = 'Date is required';
      }
      if (!formData.scheduledTime) {
        newErrors.scheduledTime = 'Time is required';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validateForm()) return;

    const activityData = {
      type: activityType,
      subject: formData.subject,
      description: formData.description || formData.notes,
      duration: formData.duration ? parseInt(formData.duration) : null,
      outcome: formData.outcome || null,
      scheduledDateTime: (formData.scheduledDate && formData.scheduledTime) 
        ? `${formData.scheduledDate}T${formData.scheduledTime}:00`
        : null,
      notes: formData.notes
    };

    onSubmit(activityData);
    handleClose();
  };

  const handleClose = () => {
    setFormData({
      type: activityType || 'call',
      subject: '',
      description: '',
      duration: '',
      outcome: '',
      scheduledDate: '',
      scheduledTime: '',
      notes: ''
    });
    setErrors({});
    onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h3>{config.title}</h3>
          <button className="close-btn" onClick={handleClose}>
            <X />
          </button>
        </div>

        <div className="modal-body">
          <form className="modal-form">
            <div className="form-grid">
              {/* Subject Field - Always shown */}
              <div className={`form-group ${config.fields.includes('scheduledDate') ? '' : 'full-width'}`}>
                <label>Subject *</label>
                <input
                  type="text"
                  name="subject"
                  value={formData.subject}
                  onChange={handleChange}
                  placeholder={`Enter ${activityType} subject`}
                  className={errors.subject ? 'input-error' : ''}
                />
                {errors.subject && <span className="error-text">{errors.subject}</span>}
              </div>

              {/* Duration Field - For calls and meetings */}
              {config.fields.includes('duration') && (
                <div className="form-group">
                  <label>Duration (minutes) {activityType === 'call' ? '*' : ''}</label>
                  <input
                    type="number"
                    name="duration"
                    value={formData.duration}
                    onChange={handleChange}
                    placeholder="e.g., 30"
                    min="1"
                    className={errors.duration ? 'input-error' : ''}
                  />
                  {errors.duration && <span className="error-text">{errors.duration}</span>}
                </div>
              )}

              {/* Scheduled Date - For meetings */}
              {config.fields.includes('scheduledDate') && (
                <div className="form-group">
                  <label>Date *</label>
                  <input
                    type="date"
                    name="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={handleChange}
                    className={errors.scheduledDate ? 'input-error' : ''}
                  />
                  {errors.scheduledDate && <span className="error-text">{errors.scheduledDate}</span>}
                </div>
              )}

              {/* Scheduled Time - For meetings */}
              {config.fields.includes('scheduledTime') && (
                <div className="form-group">
                  <label>Time *</label>
                  <input
                    type="time"
                    name="scheduledTime"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                    className={errors.scheduledTime ? 'input-error' : ''}
                  />
                  {errors.scheduledTime && <span className="error-text">{errors.scheduledTime}</span>}
                </div>
              )}

              {/* Outcome Field - For calls */}
              {config.fields.includes('outcome') && (
                <div className="form-group full-width">
                  <label>Call Outcome</label>
                  <select
                    name="outcome"
                    value={formData.outcome}
                    onChange={handleChange}
                  >
                    <option value="">Select outcome</option>
                    <option value="Connected">Connected</option>
                    <option value="Voicemail">Left Voicemail</option>
                    <option value="No Answer">No Answer</option>
                    <option value="Follow-up Required">Follow-up Required</option>
                    <option value="Successful">Successful</option>
                  </select>
                </div>
              )}

              {/* Description Field - For emails and messages */}
              {config.fields.includes('description') && (
                <div className="form-group full-width">
                  <label>Description</label>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    placeholder="Enter details..."
                    rows="4"
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                  />
                </div>
              )}

              {/* Notes Field - Always shown */}
              <div className="form-group full-width">
                <label>Additional Notes</label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleChange}
                  placeholder="Add any additional notes..."
                  rows="3"
                  style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #d1d5db' }}
                />
              </div>
            </div>
          </form>
        </div>

        <div className="modal-footer">
          <button className="btn-secondary" onClick={handleClose}>
            Cancel
          </button>
          <button className="btn-save" onClick={handleSubmit}>
            Save Activity
          </button>
        </div>
      </div>
    </div>
  );
};

export default ActivityModal;