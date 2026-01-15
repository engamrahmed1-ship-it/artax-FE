import React, { useEffect, useMemo, useState } from 'react';
import TicketModel from '../model/TicketModel';
import { getSupportTeamApi } from '../../../api/userApi';
import "../css/customerInfo.css"

const Tickets = ({ token, tickets, totalCount, onSave, onDelete }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState('create'); // 'create' or 'details'
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [teamMembers, setTeamMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(true);

  useEffect(() => {
    // Only fetch if we have a token and haven't loaded members yet
    if (token) {
      const loadTeam = async () => {
        try {
          setLoadingMembers(true);
          const response = await getSupportTeamApi(token);

          console.log("Support Team API Response:", response);
          // Logic: Check if response is the array directly or wrapped in .data.data
          const memberList = response.data?.data || response.data || [];
          // const memberList = response || [];
          setTeamMembers(memberList);
        } catch (error) {
          console.error("Failed to load support team:", error);
        } finally {
          setLoadingMembers(false);
        }
      };
      loadTeam();
    }
  }, [token]);

 const normalizedApiTickets = useMemo(() => {
    if (!Array.isArray(tickets)) return [];

      console.log("Normalizing Tickets:", tickets);

    return tickets
        // Filter out Ticket ID 4 (the empty record) so it doesn't show an empty row
        // .filter(t => t && t.subject !== null) 
        .map(t => ({
            ...t,
            // Use ticketId from your JSON to fix the key/ID mismatch
            id: t.ticketId, 
            ticketCode: t.ticketCode || `TKT-${t.ticketId}`,
            subject: t.subject || '⚠️ EMPTY RECORD (Needs Deletion)',
            priority: (t.priority || 'MEDIUM').toUpperCase(),
            assignedTo: t.assignedTo || '—',
            status: (t.status || 'OPEN').toUpperCase(),
            date: t.createdAt?.split('T')[0] || '—'
        }));
}, [tickets]);

  const handleOpenCreate = () => {
    setModalMode('create');
    setSelectedTicket(null);
    setIsModalOpen(true);
  };

  const handleOpenDetails = (ticket) => {
    setModalMode('details');
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };



  return (
    <div className="tab-panel-container">
      <div className="panel-header">
        <h3>
          Support Tickets
          <span className="count-badge">{normalizedApiTickets.length}</span>
        </h3>
        <button className="btn-primary" onClick={handleOpenCreate}>
          + New Ticket
        </button>
      </div>

      {normalizedApiTickets.length === 0 ? (
        <div className="empty-state">No tickets available</div>
      ) : (
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Subject</th>
              <th>Priority</th>
              <th>Status</th>
              <th>Assigned_To</th>
              <th>Created</th>
            </tr>
          </thead>
          <tbody>
            {normalizedApiTickets.map((ticket, index) => (
              <tr
                // Use ticket.id, but fallback to ticketCode or index if id is missing/null
                key={ticket.id || ticket.ticketCode || `ticket-${index}`}
                onClick={() => handleOpenDetails(ticket)}
                className="clickable-row"
              >
                <td><strong>{ticket.ticketCode}</strong></td>
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
                <td>{ticket.assignedTo || '—'}</td>
                <td>{ticket.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {isModalOpen && (
        <TicketModel
          mode={modalMode}
          ticket={selectedTicket}
          teamMembers={teamMembers}
          loadingMembers={loadingMembers}
          onClose={() => setIsModalOpen(false)}
          // FIX: Use the props onSave and onDelete passed from CustomerInfo
          onSave={onSave}
          onDelete={onDelete}
        />
      )}
    </div>
  );
};

export default Tickets;