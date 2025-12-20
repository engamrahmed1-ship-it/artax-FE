import React, { useMemo } from 'react';

const Tickets = ({ tickets = [], totalCount = 0 }) => {

  // --- TEST DATA (KEEP FOR DEV / FALLBACK) ---
  const ticketData = [
    // { id: 'TKT-101', subject: 'Login Issue', priority: 'HIGH', status: 'OPEN', date: '2023-10-01' },
    // { id: 'TKT-102', subject: 'Server Latency', priority: 'MEDIUM', status: 'IN_PROGRESS', date: '2023-10-03' },
    // { id: 'TKT-103', subject: 'UI Bug in Dashboard', priority: 'LOW', status: 'CLOSED', date: '2023-09-28' },
  ];

  // --- NORMALIZE API TICKETS ---
  const normalizedApiTickets = useMemo(() => {
    if (!Array.isArray(tickets)) return [];

    return tickets.map(t => ({
      id: t.ticketCode || t.id,
      subject: t.subject || t.title || 'No subject',
      priority: (t.priority || 'MEDIUM').toUpperCase(),
      status: (t.status || 'OPEN').toUpperCase(),
      date: t.createdAt?.split('T')[0] || '—'
    }));
  }, [tickets]);

  // --- MERGE TEST + API DATA ---
  const combinedTickets = useMemo(
    () => [...ticketData, ...normalizedApiTickets],
    [normalizedApiTickets]
  );

  return (
    <div className="tab-panel-container">
      <div className="panel-header">
        <h3>
          Support Tickets
          <span className="count-badge">
            {combinedTickets.length}
          </span>
        </h3>

        <button className="btn-primary">
          + New Ticket
        </button>
      </div>

      {combinedTickets.length === 0 ? (
        <div className="empty-state">
          No tickets available
        </div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {combinedTickets.map(ticket => (
              <tr key={ticket.id}>
                <td><strong>{ticket.id}</strong></td>
                <td>{ticket.subject}</td>
                <td>
                  <span className={`priority-tag ${ticket.priority.toLowerCase()}`}>
                    {ticket.priority}
                  </span>
                </td>
                <td>
                  <span className={`status-pill-small ${ticket.status.toLowerCase()}`}>
                    {ticket.status.replace('_', ' ')}
                  </span>
                </td>
                <td>{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default Tickets;
