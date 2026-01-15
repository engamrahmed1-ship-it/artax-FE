import React from 'react';

const activityIcons = {
  call: '📞',
  email: '✉️',
  meeting: '📅',
  note: '📝'
};

const activityColors = {
  call: 'activity-call',
  email: 'activity-email',
  meeting: 'activity-meeting',
  note: 'activity-note'
};

export const ActivityTimeline = ({ activities = [] }) => {
  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (!activities || activities.length === 0) {
    return (
      <div className="activity-timeline-container">
        <h3 className="activity-timeline-title">Activity Timeline</h3>
        <p className="activity-timeline-empty">No activities recorded yet.</p>
      </div>
    );
  }

  return (
    <div className="activity-timeline-container">
      <h3 className="activity-timeline-title">Activity Timeline</h3>
      <div className="activity-timeline">
        {activities.map((activity, index) => {
          const icon = activityIcons[activity.type] || '📝';
          const colorClass = activityColors[activity.type] || 'activity-note';
          
          return (
            <div key={activity.id} className="activity-item">
              <div className={`activity-icon ${colorClass}`}>
                {icon}
              </div>
              {index < activities.length - 1 && <div className="activity-line" />}
              
              <div className="activity-content">
                <p className="activity-type">{activity.type}</p>
                <p className="activity-description">{activity.description}</p>
                <div className="activity-meta">
                  <span>{formatTimestamp(activity.timestamp)}</span>
                  <span>•</span>
                  <span>{activity.user}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};