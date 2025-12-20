import React, { useState } from 'react';

const AddContactModal = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    title: 'Mr',
    firstName: '',
    secondName: '',
    email: '',
    phone: '',
    jobTitle: '',
    relation: 'Employee'
  });

  const [errors, setErrors] = useState({});

  if (!isOpen) return null;

  const validate = () => {
    let tempErrors = {};
    if (!formData.firstName.trim()) tempErrors.firstName = "Required";
    if (!formData.email.trim()) {
      tempErrors.email = "Required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      tempErrors.email = "Invalid format";
    }
    if (!formData.phone) tempErrors.phone = "Required";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: null }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) onSave(formData);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>Add New Contact</h3>
          <button className="modal-close-btn" onClick={onClose} aria-label="Close">
            <span className="close-icon">&times;</span>
          </button>
        </div>
        
        <form onSubmit={handleSubmit} className="modal-form">
          <div className="form-grid">
            {/* Row 1 */}
            <div className="form-group">
              <label>Title</label>
              <select name="title" value={formData.title} onChange={handleChange}>
                <option value="Mr">Mr</option>
                <option value="Ms">Ms</option>
                <option value="Mrs">Mrs</option>
                <option value="Eng">Eng</option>
              </select>
            </div>
            <div className="form-group">
              <label>Job Title</label>
              <input name="jobTitle" value={formData.jobTitle} onChange={handleChange} placeholder="e.g. Manager" />
            </div>

            {/* Row 2 */}
            <div className="form-group">
              <label>First Name*</label>
              <input 
                name="firstName" 
                className={errors.firstName ? 'input-error' : ''}
                value={formData.firstName} 
                onChange={handleChange} 
              />
              {errors.firstName && <span className="error-text">{errors.firstName}</span>}
            </div>
            <div className="form-group">
              <label>Second Name</label>
              <input name="secondName" value={formData.secondName} onChange={handleChange} />
            </div>

            {/* Row 3 */}
            <div className="form-group">
              <label>Email Address*</label>
              <input 
                name="email" 
                className={errors.email ? 'input-error' : ''}
                value={formData.email} 
                onChange={handleChange} 
              />
              {errors.email && <span className="error-text">{errors.email}</span>}
            </div>
            <div className="form-group">
              <label>Phone Number*</label>
              <input 
                name="phone" 
                className={errors.phone ? 'input-error' : ''}
                value={formData.phone} 
                onChange={handleChange} 
              />
              {errors.phone && <span className="error-text">{errors.phone}</span>}
            </div>

            {/* Row 4 */}
            <div className="form-group full-width">
              <label>Relation</label>
              <input name="relation" value={formData.relation} onChange={handleChange} />
            </div>
          </div>

          <div className="modal-actions">
            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
            <button type="submit" className="btn-primary">Save Contact</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddContactModal;