import React from 'react';
import '../css/customerInfo.css'; 

const ProjectsTab = ({ 
  projects, 
  handleAddNewProject, 
  getStatusColor, 
  setSelectedProject, 
  setShowProjectModal, 
  handleDeleteProject,
  handleAddNewTaskRow // Added this prop
}) => {
  
  const inProgressCount = projects.filter(p => p.status?.toUpperCase() === 'IN_PROGRESS').length;
  const closedCount = projects.filter(p => p.status?.toUpperCase() === 'CLOSED').length;
  const openCount = projects.filter(p => p.status?.toUpperCase() === 'OPEN').length;

  return (
    <div className="projects-visual-container">
      <div className="projects-header-flex">
        <h3 className="section-title">Project Portfolio</h3>
        <button className="btn-primary" onClick={handleAddNewProject}>
          <span> + New Project</span>
        </button>
      </div>

      {/* Project Summary Tiles */}
      <div className="project-stats-grid">
        <div className="stat-tile blue">
          <span className="tile-label">Total</span>
          <span className="tile-value">{projects.length}</span>
        </div>
        <div className="stat-tile orange">
          <span className="tile-label">In Progress</span>
          <span className="tile-value">{inProgressCount}</span>
        </div>
        <div className="stat-tile green">
          <span className="tile-label">Completed</span>
          <span className="tile-value">{closedCount}</span>
        </div>
        <div className="stat-tile red">
          <span className="tile-label">Open</span>
          <span className="tile-value">{openCount}</span>
        </div>
      </div>

      {/* Project List */}
      <div className="projects-modern-grid">
        {projects.length > 0 ? (
          projects.map((project) => {
            const totalTasks = project.details?.length || 0;
            const closedTasks = project.details?.filter(d => d.status === 'COMPLETED').length || 0;
            const progress = totalTasks > 0 ? Math.round((closedTasks / totalTasks) * 100) : 0;

            return (
              <div key={project.projectId} className="visual-project-card">
                <div className="card-top">
                  <span className={`status-pill-small ${project.status?.toLowerCase()}`}>
                    {project.status}
                  </span>
                </div>

                <h4 className="project-name-display">{project.projectName}</h4>

                <div className="progress-container">
                  <h6 className="project-budget">Total Budget: ${project.budget}</h6>
                  <div className="progress-text">
                    <span>Task Completion</span>
                    <span>{progress}%</span>
                  </div>
                  <div className="progress-bar-bg">
                    <div
                      className="progress-bar-fill"
                      style={{ 
                        width: `${progress}%`, 
                        backgroundColor: getStatusColor(project.status) 
                      }}
                    ></div>
                  </div>
                </div>

                {/* ACTIONS ROW - Buttons implemented here */}
                <div className="card-actions-row">
                  <button className="btn-action view" onClick={() => {
                    setSelectedProject(project);
                    setShowProjectModal(true);
                  }}>
                    👁️ View Details
                  </button>
                  
                  {/* <button className="btn-action add" onClick={() => {
                    handleAddNewTaskRow(project.projectId);
                  }}>
                    ➕ Add Task
                  </button> */}
                </div>

                <div className="card-footer-info">
                  <div className="task-count">
                    📋 {totalTasks} Sub-tasks
                  </div>
                  <button className="delete-proj-btn" onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteProject(project.projectId);
                  }}>🗑️</button>
                </div>
              </div>
            );
          })
        ) : (
          <div className="empty-projects-view">
            <div className="empty-icon">📂</div>
            <p>No projects found. Create your first project to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProjectsTab;