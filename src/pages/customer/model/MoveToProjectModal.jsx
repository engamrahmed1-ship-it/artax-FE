import React, { useState } from 'react';
import styles from '../css/documents.module.css';

const MoveToProjectModal = ({ isOpen, onClose, onMove, projects, docName }) => {
  const [selectedProjectId, setSelectedProjectId] = useState('');

  if (!isOpen) return null;

  return (
    <div className={styles['preview-modal-overlay']}  onClick={onClose}>
      <div className={styles['preview-modal-container']} style={{maxWidth: '400px', height: 'auto'}} onClick={e => e.stopPropagation()}>
        <div className={styles['preview-header']} >
          <span className={styles['file-title']}>Move "{docName}"</span>
          <button className={styles['close-btn']} onClick={onClose}>&times;</button>
        </div>
        <div style={{padding: '20px'}}>
          <p style={{marginBottom: '15px', fontSize: '0.9rem', color: '#666'}}>
            Assign this document to a specific project:
          </p>
          <select 
           className={styles['doc-filter-dropdown']}
            style={{width: '100%', marginBottom: '20px'}}
            value={selectedProjectId}
            onChange={(e) => setSelectedProjectId(e.target.value)}
          >
            <option value="">-- Select Project --</option>
            {projects.map(p => (
              <option key={p.projectId} value={p.projectId}>{p.projectName}</option>
            ))}
          </select>

          <div style={{display: 'flex', gap: '10px', justifyContent: 'flex-end'}}>
            <button className={styles['btn-secondary']} onClick={onClose}>Cancel</button>
            <button 
              className={styles['btn-primary']} 
              disabled={!selectedProjectId}
              onClick={() => {
                onMove(selectedProjectId);
                onClose();
              }}
            >
              Update Project
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoveToProjectModal;