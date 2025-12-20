import React from 'react';
import './css/loadingModel.css';

const LoadingModal = ({ isOpen, message = "Processing..." }) => {
  if (!isOpen) return null;

  return (
    <div className="loading-overlay">
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-message">{message}</p>
      </div>
    </div>
  );
};

export default LoadingModal;