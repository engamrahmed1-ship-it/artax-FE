import React, { useState } from 'react';
import styles from '../css/leads.css';

const currencies = ['USD', 'EUR', 'GBP', 'JPY', 'CAD', 'AUD', 'CHF', 'CNY', 'EGP'];

const ConvertToCustomer = ({ isOpen, onClose, leadName, onSubmit }) => {
  const [formData, setFormData] = useState({
    amount: '',
    opportunity: '',
    currency: 'EGP'
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!formData.opportunity.trim()) {
      alert('Please enter an opportunity name');
      return;
    }

    if (!formData.amount || parseFloat(formData.amount) <= 0) {
      alert('Please enter a valid amount');
      return;
    }

    if (onSubmit) {
      onSubmit(formData);
    }

    // Reset form
    setFormData({
      amount: '',
      opportunity: '',
      currency: 'USD'
    });

    // onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content modal-small" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <h2 className="modal-title">Convert to Customer</h2>
            <p className="modal-subtitle">Convert {leadName} to a customer</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="conversion-form">
          <div className="form-group">
            <label htmlFor="opportunity" className="form-label">
              Opportunity Name *
            </label>
            <input
              id="opportunity"
              type="text"
              placeholder="e.g., Q1 Enterprise Deal"
              value={formData.opportunity}
              onChange={(e) => setFormData({ ...formData, opportunity: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="amount" className="form-label">
              Amount *
            </label>
            <input
              id="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="0.00"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              className="form-input"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="currency" className="form-label">
              Currency *
            </label>
            <select
              id="currency"
              value={formData.currency}
              onChange={(e) => setFormData({ ...formData, currency: e.target.value })}
              className="form-select"
            >
              {currencies.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
          </div>

          <div className="modal-footer">
            <button type="button" className="btn-secondary" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="btn-primary">
              Convert to Customer
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ConvertToCustomer;