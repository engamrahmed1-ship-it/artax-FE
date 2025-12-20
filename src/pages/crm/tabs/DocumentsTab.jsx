import React from 'react';

const DocumentsTab = () => {
  // Static mock data based on the original component
  const documents = [
    { id: 1, icon: '📄', name: 'Contract_2024.pdf', meta: '2.4 MB • Uploaded Nov 15, 2024' },
    { id: 2, icon: '📊', name: 'Proposal_Q4.xlsx', meta: '1.8 MB • Uploaded Oct 28, 2024' },
  ];

  return (
    <div className="documents-section">
      <div className="documents-header">
        <h3 className="section-title">Documents</h3>
        <button className="btn-primary">📎 Upload Document</button>
      </div>
      <div className="documents-grid">
        {documents.map(doc => (
          <div key={doc.id} className="document-item">
            <div className="document-icon">{doc.icon}</div>
            <div className="document-info">
              <div className="document-name">{doc.name}</div>
              <div className="document-meta">{doc.meta}</div>
            </div>
            <button className="btn-icon">⬇️</button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DocumentsTab;
