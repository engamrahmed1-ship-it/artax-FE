import React from 'react';
import "./css/leads.css"

const Leads = () => {
  const leadData = [
    { id: 1, source: 'WEB', status: 'NEW', assignedTo: 'John Doe', createdAt: '2023-12-01' },
    { id: 2, source: 'REFERRAL', status: 'QUALIFIED', assignedTo: 'Jane Smith', createdAt: '2023-12-05' },
  ];

  return (
    <div className="tab-panel-container">
      <div className="panel-header">
        <h3>Incoming Leads</h3>
        <p className="subtitle">Unqualified prospects not yet in the Customer database.</p>
      </div>
      <table className="data-table">
        <thead>
          <tr>
            <th>Source</th>
            <th>Assigned To</th>
            <th>Status</th>
            <th>Created</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {leadData.map(lead => (
            <tr key={lead.id}>
              <td><span className="source-tag">{lead.source}</span></td>
              <td>{lead.assignedTo}</td>
              <td><span className={`status-pill-small ${lead.status.toLowerCase()}`}>{lead.status}</span></td>
              <td>{new Date(lead.createdAt).toLocaleDateString()}</td>
              <td>
                <button className="btn-convert">🚀 Convert to Customer</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Leads;