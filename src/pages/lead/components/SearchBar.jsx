import React from 'react';
import { LEAD_STATUS } from '../types/lead';
import '../css/leads.css';

const SearchBar = ({ searchTerm, onSearchChange, statusFilter, onStatusChange, onExportAll }) => {
  return (
    <div className="search-bar-container">
      <div className="search-input-wrapper">
        <input
          type="text"
          placeholder="Search by name or phone..."
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          className="search-input"
        />
        <span className="search-icon">🔍</span>
      </div>
      
      <select 
        value={statusFilter} 
        onChange={(e) => onStatusChange(e.target.value)}
        className="status-filter"
      >
        <option value="All">All Statuses</option>
        <option value={LEAD_STATUS.NEW}>New</option>
        <option value={LEAD_STATUS.CONTACTED}>Contacted</option>
        <option value={LEAD_STATUS.QUALIFIED}>Qualified</option>
        <option value={LEAD_STATUS.LOST}>Lost</option>
      </select>

      {onExportAll && (
        <button className="btn-secondary export-btn" onClick={onExportAll}>
          <span className="export-icon">📥</span>
          Export All
        </button>
      )}
    </div>
  );
};

export default SearchBar;