import React, { useState } from 'react';
import { X, Save, Trash2, Tag, AlertCircle, MessageSquare, CheckCircle, User } from 'lucide-react';
import "../css/customerInfo.css"

const TicketModel = ({ mode, ticket, onClose, onSave, onDelete, teamMembers, loadingMembers }) => {
    const [formData, setFormData] = useState(ticket ? {
        ...ticket,
        id: ticket.id,
        subject: ticket.subject || '',
        priority: ticket.priority || 'MEDIUM',
        status: ticket.status || 'OPEN',
        assignedTo: ticket.assignedTo === '—' ? '' : (ticket.assignedTo || ''),
        description: ticket.description || '',
        resolution: ticket.resolution || '' // Added Resolution
    } : {
        subject: '',
        priority: 'MEDIUM',
        status: 'OPEN',
        assignedTo: '',
        description: '',
        resolution: ''
    });

    //     const teamMembers = [
    //     { code: 'SUP01', name: 'Ahmed Ali' },
    //     { code: 'SUP02', name: 'Sarah Johnson' },
    //     { code: 'SUP03', name: 'Support Team Admin' },
    // ];

    /**
 * Converts a date string into a human-readable "time ago" format.
 */
    const formatTimeAgo = (dateString) => {
        if (!dateString) return "-";

        const now = new Date();
        const past = new Date(dateString);
        const diffInSeconds = Math.floor((now - past) / 1000);

        // If the date is in the future or less than a minute
        if (diffInSeconds < 60) return "Just now";

        const intervals = {
            year: 31536000,
            month: 2592000,
            week: 604800,
            day: 86400,
            hour: 3600,
            minute: 60
        };

        for (const [unit, secondsInUnit] of Object.entries(intervals)) {
            const interval = Math.floor(diffInSeconds / secondsInUnit);
            if (interval >= 1) {
                return interval === 1
                    ? `1 ${unit} ago`
                    : `${interval} ${unit}s ago`;
            }
        }
        return past.toLocaleDateString();
    };

    const handleChange = (e) => {
        console.log(formData)
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleReopen = () => {
        setFormData(prev => ({
            ...prev,
            status: 'OPEN',
            resolution: '', // Clear resolution
            closedAt: null  // Clear date locally (BE will also clear it via @PreUpdate)
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        // Pass the data to the handler. 
        // We use formData.id because that is where ticketId was mapped in normalizedApiTickets
        const {
            createdAt,
            updatedAt,
            closedAt,
            ticketCode,
            date,
            ...payload
        } = formData;

        console.log("Submitting Ticket Form Data:", formData);

        console.log("Submitting Cleaned Payload:", payload);
        const result = await onSave(payload, mode === 'details' ? formData.id : null);

        // Only close if the save was actually triggered
        onClose();
    };

    console.log("Current Form AssignedTo:", formData.assignedTo);

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <div className="header-title">
                        <div className="icon-badge"><Tag size={20} /></div>
                        <h3>{mode === 'create' ? 'Create Ticket' : 'Edit Ticket'}</h3>
                    </div>
                    <button onClick={onClose} className="close-btn"><X /></button>
                </div>
                {/* NEW METADATA BAR */}
                {mode !== 'create' && (
                    <div className="ticket-metadata-bar">
                        <div className="metadata-item">
                            <strong>Code:</strong> <span className="code-badge">{formData.ticketCode}</span>
                        </div>
                        <div className="metadata-item" title={new Date(formData.updatedAt).toLocaleString()}>
                            <span className="update-pulse"></span>
                            <strong>Updated:</strong> {formatTimeAgo(formData.updatedAt)}
                        </div>
                        <div className="metadata-item">
                            <strong>Status:</strong>
                            <span style={{
                                color: formData.status === 'CLOSED' ? '#10b981' : '#3b82f6',
                                fontWeight: 'bold'
                            }}>
                                {formData.status}
                            </span>
                        </div>

                        <div className="metadata-item">
                            <strong>Closed:</strong>
                            <span className={!formData.closedAt ? 'text-muted' : 'closed-date-text'}>
                                {formData.closedAt ? formatTimeAgo(formData.closedAt) : 'Still Open'}
                            </span>
                        </div>
                    </div>
                )}

                <form onSubmit={handleSubmit} className="modal-body">
                    {/* Subject */}
                    <div className="form-section">
                        <label>Subject</label>
                        <input name="subject" value={formData.subject} onChange={handleChange} placeholder="Briefly describe the issue" required />
                    </div>

                    {/* Row 1: Priority & Status */}
                    <div className="form-row">
                        <div className="form-section">
                            <label>Priority</label>
                            <select name="priority" value={formData.priority} onChange={handleChange}>
                                <option value="LOW">Low</option>
                                <option value="MEDIUM">Medium</option>
                                <option value="HIGH">High</option>
                                <option value="URGENT">Urgent</option>
                            </select>
                        </div>
                        <div className="form-section">
                            <label>Status</label>
                            <select name="status" value={formData.status} onChange={handleChange}>
                                <option value="OPEN">Open</option>
                                <option value="IN_PROGRESS">In Progress</option>
                                <option value="RESOLVED">Resolved</option>
                                <option value="CLOSED">Closed</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 2: Assignee (NEW) */}
                    <div className="form-section">
                        <label>Assignee</label>
                        <div className="input-with-icon">
                            <User size={16} />
                            <select name="assignedTo" value={formData.assignedTo} onChange={handleChange}>
                                <option value="">Unassigned</option>
                                {teamMembers.map(member => (
                                    <option key={member.code} value={member.code}>
                                        {member.name} : {member.code}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>

                    {/* Description */}
                    <div className="form-row">
                        <div className="form-section">
                            <label>Description</label>
                            <div className="textarea-with-icon">
                                <MessageSquare size={16} className="textarea-icon" />
                                <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Request details..." rows="5" />
                            </div>
                        </div>

                        {/* Resolution (NEW) - Usually visible in details or when status is Resolved */}
                        <div className="form-section resolution-area">
                            <label>Resolution Details</label>
                            <div className="textarea-with-icon">
                                <CheckCircle size={16} className="textarea-icon success-icon" />
                                <textarea
                                    name="resolution"
                                    value={formData.resolution}
                                    onChange={handleChange}
                                    placeholder="How was this issue resolved?"
                                    rows="5"
                                    style={{ borderColor: formData.status === 'RESOLVED' ? '#10b981' : '#cbd5e1' }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="modal-footer">
                        {mode === 'details' && (
                            <button type="button"
                                onClick={() => onDelete(formData.id)} className="btn-delete">
                                <Trash2 size={16} /> Delete
                            </button>
                        )}
                        <div className="footer-actions">
                            <button type="button" onClick={onClose} className="btn-secondary">Cancel</button>
                            <button type="submit" className="btn-save">
                                <Save size={16} /> {mode === 'create' ? 'Create Ticket' : 'Update Ticket'}
                            </button>
                            {(formData.status === 'CLOSED' || formData.status === 'RESOLVED') && (
                                <button
                                    type="button"
                                    onClick={handleReopen}
                                    className="btn-reopen"
                                    style={{
                                        marginRight: 'auto',
                                        backgroundColor: '#f59e0b',
                                        color: 'white',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '8px',
                                        padding: '8px 16px',
                                        borderRadius: '6px',
                                        border: 'none',
                                        cursor: 'pointer'
                                    }}
                                >
                                    <AlertCircle size={16} /> Re-open Ticket
                                </button>
                            )}
                        </div>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default TicketModel;