import React from 'react';

const quickActions = [
  { icon: '📞', label: 'Call', action: () => alert('Initiating call...') },
  { icon: '✉️', label: 'Email', action: () => alert('Opening email client...') },
  { icon: '📅', label: 'Schedule', action: () => alert('Opening calendar...') },
  { icon: '💬', label: 'Message', action: () => alert('Opening chat...') },
];

const QuickActions = () => {
  return (
    <div className="quick-actions">
      {quickActions.map((action, index) => (
        <button key={index} className="quick-action-btn" onClick={action.action}>
          <span className="action-icon">{action.icon}</span>
          <span className="action-label">{action.label}</span>
        </button>
      ))}
    </div>
  );
};

export default QuickActions;
