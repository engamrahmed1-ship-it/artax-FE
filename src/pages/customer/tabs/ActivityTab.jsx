import React, { useMemo } from 'react';
import ActivityModal from '../model/ActivityModal';
import '../css/customerInfo.css';

const getActivityConfig = (type) => {
  const configs = {
    call: { icon: '📞', color: '#3b82f6', label: 'Phone Call' },
    email: { icon: '✉️', color: '#f59e0b', label: 'Email Sent' },
    meeting: { icon: '👥', color: '#10b981', label: 'Meeting' },
    message: { icon: '💬', color: '#8b5cf6', label: 'Message' },
    default: { icon: '📄', color: '#6b7280', label: 'Activity' }
  };
  return configs[type?.toLowerCase()] || configs.default;
};

const getSafeDate = (activity) => {
  // Check all possible date fields in your Entity/DTO
  const rawDate = activity.createdAt || activity.scheduledDateTime || activity.interactionDate || activity.date;

  if (!rawDate) return null;

  // If it's a string like "2026-01-11 14:00:00", replace space with 'T' for ISO compliance
  const formattedDate = typeof rawDate === 'string' ? rawDate.replace(' ', 'T') : rawDate;

  const d = new Date(formattedDate);
  return isNaN(d.getTime()) ? null : d;
};

const ActivityTab = ({ activities = [],
totalPages = 1, 
  currentPage = 0,
  onPageChange,
  onAddActivity, onDeleteActivity }) => {
  const [showModal, setShowModal] = React.useState(false);
  const [selectedActivityType, setSelectedActivityType] = React.useState('call');

  // Memoized stats for the right sidebar
  const stats = useMemo(() => {
    const total = activities.length;
    const types = activities.reduce((acc, curr) => {
      acc[curr.type?.toLowerCase()] = (acc[curr.type?.toLowerCase()] || 0) + 1;
      return acc;
    }, {});
    return { total, types };
  }, [activities]);

const sortedActivities = useMemo(() => {
    return [...activities].sort((a, b) => {
        const dateA = getSafeDate(a) || new Date(0);
        const dateB = getSafeDate(b) || new Date(0);
        return dateB - dateA;
    });
}, [activities]);


  return (
    <div className="activity-dashboard-layout">
      {/* LEFT SIDE: Timeline (70%) */}
      <div className="timeline-section">
        <div className="action-grid">
          {['call', 'email', 'meeting', 'message'].map((type) => (
            <div key={type} className={`action-card ${type}`} onClick={() => { setSelectedActivityType(type); setShowModal(true); }}>
              <span className="card-icon">{getActivityConfig(type).icon}</span>
              <span className="card-label">{type.toUpperCase()}</span>
            </div>
          ))}
        </div>

        <div className="timeline-container">
          <div className="timeline-thread"></div>
          {sortedActivities.length > 0 ? (
            sortedActivities.map((activity) => {
              const config = getActivityConfig(activity.type);
              return (
                <div key={activity.id} className="modern-timeline-item" style={{ '--accent-color': config.color }}>
                  <div className="timeline-dot-wrapper">
                    <div className="timeline-dot">{config.icon}</div>
                  </div>
                  <div className="modern-card">
                    <div className="card-header">
                      <div className="header-meta">
                        <span className="activity-label">{config.label}</span>
                        <span className="dot-separator">•</span>
                        <span className="time-stamp">
                          {(() => {
                            const validDate = getSafeDate(activity);
                            return validDate
                              ? validDate.toLocaleString([], {
                                month: 'short',
                                day: 'numeric',
                                hour: '2-digit',
                                minute: '2-digit',
                                hour12: true
                              })
                              : 'Date Pending';
                          })()}
                        </span>
                      </div>
                      <button className="btn-delete" onClick={() => onDeleteActivity(activity.id)}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" /></svg>
                      </button>
                    </div>

                    <div className="card-body-content email-style">
                      {/* SUBJECT: Mimics Email Header */}
                      <div className="subject-row">
                        <span className="email-indicator">✉️</span>
                        <h4 className="card-subject">
                          {activity.subject || 'No Subject'}
                        </h4>
                      </div>

                      {/* DESCRIPTION: Mimics Email Body/Reading Pane */}
                      {activity.description && (
                        <div className="email-body-preview">
                          <div className="body-content">
                            {activity.description}
                          </div>
                          {/* Visual 'fade' effect if text is long */}
                          <div className="body-fade"></div>
                        </div>
                      )}

                      {/* NOTES: Styled as a 'Post-it' or 'Internal Memo' */}
                      {activity.notes && (
                        <div className="notes-box">
                          <span className="notes-label">Internal Note:</span>
                          <p className="card-note">{activity.notes}</p>
                        </div>
                      )}
                    </div>
                    <div className="card-footer-creative">
                      <div className="card-tags">
                        {activity.duration && <span className="tag duration">⏱️ {activity.duration}m</span>}
                        {activity.outcome && <span className={`tag outcome ${activity.outcome.toLowerCase()}`}>{activity.outcome}</span>}
                      </div>

                      {/* 👤 Added agentId Section */}
                      <div className="agent-badge" title={`Logged by ${activity.agentId || 'System'}`}>
                        <span className="agent-icon">👤</span>
                        <span className="agent-name">{activity.agentId || 'System'}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          ) : (
            <div className="empty-state-creative">No history found.</div>
          )}
        </div>
      </div>


      {/* 🔢 Numbered Pagination Bar */}
      {/* 🔢 Add this Pagination Bar at the bottom of timeline-container */}
          {totalPages > 1 && (
            <div className="pagination-bar">
              <button 
                className="pag-nav-btn" 
                disabled={currentPage === 0}
                onClick={() => onPageChange(currentPage - 1)}
              >
                ← Prev
              </button>
              
              {[...Array(totalPages)].map((_, i) => (
                <button 
                  key={i} 
                  className={`pag-num-btn ${currentPage === i ? 'active' : ''}`}
                  onClick={() => onPageChange(i)}
                >
                  {i + 1}
                </button>
              ))}

              <button 
                className="pag-nav-btn" 
                disabled={currentPage === totalPages - 1}
                onClick={() => onPageChange(currentPage + 1)}
              >
                Next →
              </button>
            </div>
          )}



      {/* RIGHT SIDE: Stats (30%) */}
      <div className="stats-sidebar">
        <div className="stats-card">
          <h4 className="stats-title">Activity Insights</h4>
          <div className="total-count-display">
            <span className="big-number">{stats.total}</span>
            <span className="number-label">Total Interactions</span>
          </div>

          <div className="type-breakdown">
            {Object.entries(stats.types).map(([type, count]) => (
              <div key={type} className="breakdown-item">
                <span className="breakdown-label">
                  {getActivityConfig(type).icon} {type.charAt(0).toUpperCase() + type.slice(1)}s
                </span>
                <span className="breakdown-value">{count}</span>
              </div>
            ))}
          </div>

          <div className="sidebar-footer-info">
            <p>Showing latest activity for the current customer record.</p>
          </div>
        </div>
      </div>

      <ActivityModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSubmit={(data) => { onAddActivity(data); setShowModal(false); }}
        activityType={selectedActivityType}
      />
    </div>
  );
};

export default ActivityTab;