import React, { useState } from 'react';
import styles from '../css/documents.module.css';

const UploadDocumentModal = ({ isOpen, onClose, onUpload, projects = [] }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [projectId, setProjectId] = useState('');
  const [fileType, setFileType] = useState(''); // Default empty for validation
  const [customType, setCustomType] = useState('');

  if (!isOpen) return null;

  const fileCategories = [
    { value: 'ID', label: 'Identity Document (ID)' },
    { value: 'CONTRACT', label: 'Contract' },
    { value: 'INVOICE', label: 'Invoice' },
    { value: 'PERMIT', label: 'Permit' },
    { value: 'OTHER', label: 'Other (Custom)' },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation
    if (!fileType) {
      alert("Please select a Document Category");
      return;
    }

    if (selectedFile) {
      // If "OTHER" is selected, use the custom text; otherwise use the dropdown value
      const finalDocType = fileType === 'OTHER' ? customType : fileType;

      onUpload(selectedFile, finalDocType, projectId || null);

      // Reset and close
      setSelectedFile(null);
      setProjectId('');
      setFileType('');
      setCustomType('');
      onClose();
    }
  };

  return (
    <div className={styles['preview-modal-overlay']} onClick={onClose}>
      <div className={styles['preview-modal-container']} style={{ maxWidth: '500px', height: 'auto' }} onClick={e => e.stopPropagation()}>
        <div className={styles['preview-header']} >
          <span className={styles['file-title']}>📎 Upload Document</span>
          <button className={styles['close-btn']} onClick={onClose}>&times;</button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '20px' }}>
          <div className={styles['doc-form-group']}>
            <label>Select Project (Optional)</label>
            <select
              className={styles['doc-filter-dropdown']}
              style={{ width: '100%', marginBottom: '15px' }}
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">No Specific Project</option>
              {projects.map(proj => (
                <option key={proj.projectId} value={proj.projectId}>
                  {proj.projectName || `Project #${proj.projectId}`}
                </option>
              ))}
            </select>
          </div>

          {/* File Type Selection */}
          <div className={styles['doc-form-group']} style={{ marginBottom: '15px' }}>
            <label >Document Category</label>
            <select
              className={styles['doc-filter-dropdown']}
              style={{ width: '100%' }}
              value={fileType}
              onChange={(e) => setFileType(e.target.value)}
              required
            >
              <option value="">-- Select Category --</option>
              {fileCategories.map(cat => (
                <option key={cat.value} value={cat.value}>{cat.label}</option>
              ))}
            </select>
          </div>

          {/* Conditional Custom Input */}
          {fileType === 'OTHER' && (
            <div className={styles['doc-form-group']} style={{ marginBottom: '15px' }}>
              <label >Specify Type</label>
              <input
                type="text"
                className={styles['doc-filter-dropdown']}
                style={{ width: '100%', padding: '8px' }}
                placeholder="e.g. Tax Report, Site Photo..."
                value={customType}
                onChange={(e) => setCustomType(e.target.value)}
                required
              />
            </div>
          )}


          {/* Attached File  */}
          <div className={styles['doc-form-group']}>
            <label>File</label>
            <input
              type="file"
              className={styles['doc-filter-dropdown']}
              style={{ width: '100%', padding: '10px' }}
              onChange={(e) => setSelectedFile(e.target.files[0])}
              required
            />
          </div>

          <div style={{ marginTop: '20px', display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
            <button type="button" className={styles['btn-secondary']}  onClick={onClose}>Cancel</button>
            <button type="submit" className={styles['btn-primary']}  disabled={!selectedFile}>
              Upload to Project
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UploadDocumentModal;