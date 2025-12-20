import '../css/customerInfo.css'; // Assuming this path is correct

import React from 'react';

const ContactsTab = ({ customerData, setShowAddModal, handleDeleteContact, handleSetPrimaryContact }) => {
  const contacts = customerData.b2b?.contacts || [];
  const primaryContactId = customerData.b2b?.primaryContactId;

  return (
    <div className="contacts-section">
      <div className="contacts-header">
              <div className="contacts-header-row">
                <h3 className="section-title">Business Contacts</h3>
                <button className="btn-primary" onClick={() => setShowAddModal(true)}>
                  + Add Contact
                </button>
              </div>
      </div>
      {
        Array.isArray(contacts) && contacts.length > 0 ? (
                <div className="contacts-grid">
                  {contacts.map((contact, index) => {
                    const isPrimary = contact.id && contact.id === primaryContactId;

                    const fullName =
                      contact.fullName ||
                      [contact.firstName, contact.lastName]
                        .filter(Boolean)
                        .join(' ') ||
                      'Unnamed Contact';

                    return (
                      <div
                        key={contact.id || index}
                        className={`contact-card ${isPrimary ? 'primary-card' : 'secondary-card'}`}
                      >
                        {isPrimary && <div className="primary-ribbon">Primary Contact</div>}
                        

                        <div className="contact-body">
                          <div className="contact-main-info">
                            <div className="contact-avatar">
                              <div className="customer-avatar">
                                {customerData.firstName?.[0] || ''}{customerData.lastName?.[0] || customerData.b2b?.contacts?.find(c => c.id === customerData.b2b.primaryContactId)?.secondName?.[0] || ''}
                              </div>
                            </div>
                            <div>
                              <h4 className="contact-name">{contact.title} {fullName}</h4>
                              <p className="contact-position">
                                {contact.jobTitle || contact.role || 'No position listed'}
                              </p>
                            </div>
                          </div>

                          <div className="contact-details-grid">
                            <div className="detail-item">
                              <span className="detail-label">Email</span>
                              <span className="detail-value">{contact.email || '—'}</span>
                            </div>
                            <div className="detail-item">
                              <span className="detail-label">Phone</span>
                              <span className="detail-value">{contact.phone || '—'}</span>
                            </div>
                            {contact.department && (
                              <div className="detail-item">
                                <span className="detail-label">Department</span>
                                <span className="detail-value">{contact.department}</span>
                              </div>
                            )}
                          </div>

 {/* can Be added in BE  */}
                          {contact.notes && (
                            <div className="contact-notes-box">
                              <strong>Notes:</strong> {contact.notes}
                            </div>
                          )}
                        </div>

                        <div className="contact-footer-actions">
                          {!isPrimary && (
                            <button
                              className="btn-link"
                              onClick={() => handleSetPrimaryContact(contact.id)}
                            >
                              Make Primary
                            </button>
                          )}
                          {!isPrimary && (<button
                            className="btn-danger-text"
                            onClick={() => handleDeleteContact(contact.id)}
                          >
                            Delete Contact
                          </button>)}
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <div className="empty-state">
                  <p>No contacts added yet. Click the button above to add your first contact.</p>
                </div>
              )}

      {/* <table className="data-table contacts-table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Title</th>
            <th>Email</th>
            <th>Phone</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td>{contact.firstName} {contact.secondName}</td>
              <td>{contact.jobTitle}</td>
              <td>{contact.email}</td>
              <td>{contact.phone}</td>
              <td>
                {contact.id === primaryContactId ? (
                  <span className="status-badge active">Primary</span>
                ) : (
                  <span className="status-badge inactive">Secondary</span>
                )}
              </td>
              <td>
                {contact.id !== primaryContactId && (
                  <button
                    className="btn-link"
                    onClick={() => handleSetPrimaryContact(contact.id)}
                  >
                    Set Primary
                  </button>
                )}
                <button
                  className="btn-link text-danger"
                  onClick={() => handleDeleteContact(contact.id)}
                  disabled={contact.id === primaryContactId}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table> */}
    </div>
  );
};

export default ContactsTab;
