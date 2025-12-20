import React from 'react';

const ActivityTab = ({ activities }) => {
  const getActivityIcon = (type) => {
    switch (type) {
      case 'call': return '📞';
      case 'email': return '✉️';
      case 'meeting': return '👥';
      default: return '📄';
    }
  };

  return (
    <div className="activity-timeline">
      <h3 className="section-title">Activity Timeline</h3>
      {activities.map(activity => (
        <div key={activity.id} className="timeline-item">
          <div className={`timeline-icon ${activity.type}`}>
            {getActivityIcon(activity.type)}
          </div>
          <div className="timeline-content">
            <div className="timeline-date">{activity.date}</div>
            <div className="timeline-description">{activity.description}</div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ActivityTab;
