import React, { useState } from 'react';
import '../css/customerInfo.css';
import { Trash2, X } from 'lucide-react';

const ProjectModal = ({
    isOpen,
    onClose,
    project,
    onSave,
    onDelete,
    onUpdateDetail,
    onAddDetail,
    onSaveDetail,
    onDeleteDetail,
    updatingDetailId // <-- New Prop added here
}) => {
    const [newProjectName, setNewProjectName] = useState('');
    const [newProjectBudget, setNewProjectBudget] = useState('');
    const [newProjectType, setNewProjectType] = useState('');

    const totalSubTaskBudget = project?.details?.reduce((sum, detail) => {
        // Ensure detail.budget is treated as a number
        const val = parseFloat(detail.budget) || 0;
        return sum + val;
    }, 0) || 0;

    const formattedTotalBudget = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
    }).format(totalSubTaskBudget);

    if (!isOpen) return null;

    const isExisting = !!project;

    const PRIORITY_MAP = { 'HIGH': 1, 'MEDIUM': 2, 'LOW': 3 };
    const REVERSE_PRIORITY_MAP = { 1: 'HIGH', 2: 'MEDIUM', 3: 'LOW' };
    // Add the '?' after project and details to prevent the crash
    const totalTasks = project?.details?.length || 0;

    const closedTasks = project?.details?.filter(t => t.status === 'COMPLETED').length || 0;

    const progressPercent = totalTasks > 0 ? Math.round((closedTasks / totalTasks) * 100) : 0;

    return (
        <div className="modal-overlay">
            <div className="project-modal-container">
                <div className="modal-header">
                    <div className="header-titles">
                        <h3>{isExisting ? project.projectName : '🚀 Create New Project'}</h3>
                        {isExisting && <span className="project-id-badge">project number: {project.projectId}</span>}
                    </div>
                    <button className="close-btn" onClick={onClose}><X /></button>
                </div>

                <div className="modal-body">
                    {isExisting ? (
                        <div className="project-details-view">
                            <div className="project-stats-banner">
                                <div className="stats-group">
                                    <div className="stat-card">
                                        <div className="stat-icon">💰</div>
                                        <div className="stat-info">
                                            <label>Total Budget</label>
                                            <span className="stat-value">{formattedTotalBudget}</span>
                                        </div>
                                    </div>

                                    <div className="stat-card border-left">
                                        <div className="stat-icon">📊</div>
                                        <div className="stat-info">
                                            <label>Project Status</label>
                                            <span className={`status-pill ${project.status?.toLowerCase()}`}>
                                                {project.status}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="stat-card border-left">
                                        <div className="stat-icon">🎯</div>
                                        <div className="stat-info">
                                            <label>Completion</label>
                                            <div className="progress-container">
                                                <div className="progress-track">
                                                    <div
                                                        className="progress-fill"
                                                        style={{ width: `${progressPercent}%` }}
                                                    ></div>
                                                </div>
                                                <span className="progress-text">{progressPercent}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>


                                <button type="button" className="btn-delete"  onClick={() => onDelete(project.projectId)}>
                                    <Trash2 size={16} /> Delete 
                                </button>
                            </div>

                            <div className="subtasks-section">
                                <div className="section-header">
                                    <h3>Project Sub-Tasks</h3>
                                    <button className="btn-add-subtask" onClick={() => onAddDetail(project.projectId)}>
                                        + Add Task
                                    </button>
                                </div>

                                <div className="subtasks-table-wrapper">
                                    {project.details && project.details.length > 0 ? (
                                        <table className="project-details-table">
                                            <thead>
                                                <tr>
                                                    <th>Sub-Task Name</th>
                                                    <th>Status</th>
                                                    <th>Priority</th>
                                                    <th>Budget</th>
                                                    <th className="text-center">Action</th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {project.details.map((detail) => {
                                                    const subId = detail.projectSubId;
                                                    const isNewRow = !!detail.isNew;
                                                    const isUpdating = updatingDetailId === subId; // Check if this row is saving

                                                    const displayPriority = typeof detail.priority === 'number'
                                                        ? REVERSE_PRIORITY_MAP[detail.priority]
                                                        : (detail.priority || 'MEDIUM');


                                                    return (
                                                        <tr key={subId} className={`${isNewRow ? 'new-task-row' : ''} ${isUpdating ? 'row-updating' : ''}`}>
                                                            <td>
                                                                <input
                                                                    type="text"
                                                                    className="table-inline-input"
                                                                    disabled={isUpdating} // Prevent typing while saving
                                                                    autoFocus={isNewRow}
                                                                    defaultValue={detail.subName}
                                                                    onBlur={(e) => !isNewRow && onUpdateDetail(subId, { subName: e.target.value })}
                                                                    onChange={(e) => { if (isNewRow) detail.subName = e.target.value }}
                                                                />
                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="table-inline-select"
                                                                    disabled={isUpdating}
                                                                    defaultValue={detail.status || 'OPEN'}
                                                                    onChange={(e) => {
                                                                        const val = e.target.value;
                                                                        isNewRow ? (detail.status = val) : onUpdateDetail(subId, { status: val });
                                                                    }}
                                                                >
                                                                    <option value="OPEN">OPEN</option>
                                                                    <option value="IN_PROGRESS">IN PROGRESS</option>
                                                                    <option value="COMPLETED">COMPLETED</option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                <select
                                                                    className="table-inline-select"
                                                                    disabled={isUpdating}
                                                                    defaultValue={displayPriority}
                                                                    onChange={(e) => {
                                                                        const label = e.target.value;
                                                                        const intVal = PRIORITY_MAP[label];
                                                                        isNewRow ? (detail.priority = intVal) : onUpdateDetail(subId, { priority: intVal });
                                                                    }}
                                                                >
                                                                    <option value="HIGH">High (1)</option>
                                                                    <option value="MEDIUM">Medium (2)</option>
                                                                    <option value="LOW">Low (3)</option>
                                                                </select>
                                                            </td>
                                                            <td>
                                                                
                                                                    {isNewRow ? (
                                                                        /* INPUT FOR NEW TASKS: Uses onChange and direct variable update */
                                                                        <input
                                                                            type="number"
                                                                            className="table-inline-input"
                                                                            disabled={isUpdating}
                                                                            defaultValue={detail.budget || ''}
                                                                            onChange={(e) => {
                                                                                detail.budget = e.target.value;
                                                                                // Note: We use defaultValue here so the typing isn't "blocked" by React's state
                                                                            }}
                                                                        />
                                                                    ) : (
                                                                        /* INPUT FOR EXISTING TASKS: Uses onBlur for API updates */
                                                                        <input
                                                                            type="number"
                                                                            className="table-inline-input"
                                                                            disabled={isUpdating}
                                                                            defaultValue={detail.budget || ''}
                                                                            onBlur={(e) => {
                                                                                const val = e.target.value === '' ? 0 : Number(e.target.value);
                                                                                onUpdateDetail(subId, { budget: val });
                                                                            }}
                                                                        />
                                                                    )}
                                                                
                                                            </td>
                                                            <td className="text-center">
                                                                {isUpdating ? (
                                                                    /* --- THE LOADING ICON --- */
                                                                    <div className="mini-loader">⏳</div>
                                                                ) : isNewRow ? (
                                                                    <button className="btn-save-inline" onClick={() => onSaveDetail(project.projectId, detail)}>
                                                                        ✅
                                                                    </button>
                                                                ) : (
                                                                    <button className="btn-row-delete" onClick={() => onDeleteDetail(subId)}>
                                                                        🗑️
                                                                    </button>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                            </tbody>
                                        </table>
                                    ) : (
                                        <div className="empty-subtasks">
                                            <p>No sub-tasks found. Click "+ Add Task" to begin.</p>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>
                    ) : (
                        /* CREATE MODE remains same... */
                        <div className="project-create-form">
                            <div className="form-group">
                                <label>Project Name</label>
                                <input
                                    placeholder="e.g., Q1 Security Audit"
                                    value={newProjectName}
                                    onChange={(e) => setNewProjectName(e.target.value)}
                                />
                            </div >
                            <div className='project-info'>
                                <div className="form-group">
                                    <label>Project Type</label>
                                    <input
                                        type="Text"
                                        placeholder="e.g. IT"
                                        value={newProjectType}
                                        onChange={(e) => setNewProjectType(e.target.value)}
                                    />
                                </div>
                                <div className="form-group">
                                    <label>Initial Budget</label>
                                    <input
                                        type="number"
                                        placeholder="0.00"
                                        value={newProjectBudget}
                                        onChange={(e) => setNewProjectBudget(e.target.value)}
                                    />
                                </div>
                            </div>
                            <button
                                className="btn-primary"
                                onClick={() => onSave({ projectName: newProjectName, budget: newProjectBudget, projectType: newProjectType })}
                            >
                                <span>Create Project</span>
                            </button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ProjectModal;