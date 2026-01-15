import React, { useMemo, useRef, useState } from 'react';
import { getDocumentPreview } from '../../../api/docApi';
import DocumentPreviewModal from '../model/DocumentPreviewModal';
import { triggerGlobalLogout } from '../../../context/AuthContext';
import UploadDocumentModal from '../model/UploadDocumentModal';
import MoveToProjectModal from '../model/MoveToProjectModal';
import styles from '../css/documents.module.css';

const DocumentsTab = ({
  documents = [],
  projects = [],
  onUpload,
  onDownload,
  onDelete,
  onUpdateProject,
  token
}) => {
  const fileInputRef = useRef(null);

  // States for Preview Logic
  const [preview, setPreview] = useState({ isOpen: false, url: '', name: '' });
  const [isFetching, setIsFetching] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [filterType, setFilterType] = useState('ALL');
  const [filterProject, setFilterProject] = useState('ALL');
  const [isMoveModalOpen, setIsMoveModalOpen] = useState(false);
  const [selectedDocToMove, setSelectedDocToMove] = useState(null);

  // Helper to get project name by ID
  const getProjectName = (pid) => {
    if (!pid) return 'General';
    const project = projects.find(
      p => String(p.projectId || p.id) === String(pid)
    );
    return project ? project.projectName : `Project #${pid}`;
  };

  // 2. Improved projectsInDocs logic
  // Change this useMemo in DocumentsTab.jsx
  const projectOptions = useMemo(() => {
    return projects.map(p => ({
      id: String(p.projectId || p.id),
      name: p.projectName || `Project #${p.projectId}`
    }));
  }, [projects]);


  const getFileIcon = (fileName) => {
    if (!fileName) return '📁';
    const ext = fileName.split('.').pop().toLowerCase();

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp', 'jfif'].includes(ext)) return '🖼️';
    if (ext === 'pdf') return '📄';
    if (['doc', 'docx', 'odt'].includes(ext)) return '🟦'; // Word/Docs
    if (['xls', 'xlsx', 'csv'].includes(ext)) return '🟩'; // Excel/Sheets
    if (['ppt', 'pptx'].includes(ext)) return '🟧';       // PowerPoint
    if (['zip', 'rar', '7z'].includes(ext)) return '📦';  // Compressed

    return '📝'; // Default for other text/unknown files
  };


  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUpload(file, 'OTHER');
      e.target.value = '';
    }
  };

  const handlePreview = async (doc) => {
    if (!token) {
      alert('Session expired. Please log in again.');
      triggerGlobalLogout();
      return;
    }

    const docId = doc.documentId || doc.id;
    if (!docId) return;

    try {
      setIsFetching(true);
      const response = await getDocumentPreview(token, docId);

      const url = response.data?.previewUrl || response.data?.url || response.data;

      if (url && typeof url === 'string') {
        setPreview({ isOpen: true, url, name: doc.fileName || doc.name });
      }
    } catch (error) {
      // 2. Silence the error so core.js doesn't "see" it and crash
      console.error("Preview blocked or unauthorized");

      // If the interceptor hasn't kicked in yet, force it
      if (error.response?.status === 401) {
        setPreview({ isOpen: false, url: '', name: '' }); // Reset local state
      }
    } finally {
      setIsFetching(false);
    }
  };

  const filteredDocs = useMemo(() => {
    return documents.filter(doc => {
      const name = doc.documentName || doc.fileName || '';
      const ext = name.split('.').pop().toLowerCase();

      const typeMatch =
        filterType === 'ALL' ||
        (filterType === 'PDF' && ext === 'pdf') ||
        (filterType === 'IMAGE' && ['jpg', 'jpeg', 'png', 'jfif'].includes(ext));

      const docProjId = doc.projectId ? String(doc.projectId) : 'null';
      const projectMatch =
        filterProject === 'ALL' || docProjId === String(filterProject);

      return typeMatch && projectMatch;
    });
  }, [documents, filterType, filterProject]);




  return (
    <div className={styles['documents-section']}>
      <div className={styles['documents-header']}>
        <div className={styles['header-left-group']}>
          <h3 className={styles['doc-section-title']}>Documents ({filteredDocs.length})</h3>
          <select
            className={styles['doc-filter-dropdown']}
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="ALL">All Types</option>
            <option value="PDF">PDFs</option>
            <option value="EXCEL">Spreadsheets</option>
            <option value="WORD">Documents</option>
            <option value="IMAGE">Images</option>
          </select>

          {/* Project Filter */}
          <select
            className={styles['doc-filter-dropdown']}
            value={filterProject}
            onChange={(e) => setFilterProject(e.target.value)}
          >
            <option value="ALL">All Projects</option>

            {projectOptions.map(p => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
        </div>
        <input
          type="file"
          ref={fileInputRef}
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />
        <button
          className={styles['btn-primary']}
          onClick={() => setIsUploadModalOpen(true)} // Open modal instead of hidden input
          disabled={isFetching}
        >
          {isFetching ? '⏳ Processing...' : '📎 Upload Document'}
        </button>
      </div>


      <div className={styles['documents-grid']}>
        {filteredDocs.length === 0 &&
          <p className={styles['empty-msg']}>No documents match these filters.</p>}

        {filteredDocs.map(doc => {
          const docId = doc.documentId || doc.id;
          // 1. Resolve the CSS Class based on documentType
          const normalizedType = doc.docType?.toUpperCase() || 'OTHER';
          const typeClass = styles[`badge${normalizedType}`] || styles.badgeOTHER;
            console.log(doc)
          // Safely format the date
          const displayDate = doc.uploadDate && !isNaN(Date.parse(doc.uploadDate))
            ? new Date(doc.uploadDate).toLocaleDateString()
            : 'Recently';

          return (
            <div key={docId} className={styles['document-item']}>
              {/* Change: Use doc.fileName || doc.name to catch both mapper versions */}
              <div className={styles['document-header']}>
                <div className={styles['document-icon']} onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation(); // Stops the event from reaching the 'core.js' listeners
                  handlePreview(doc);
                }}>
                  {getFileIcon(doc.fileName || doc.documentName)}
                </div>

                <div className={styles['document-actions']}>
                  <button
                    className={styles['btn-icon']}
                    onClick={(e) => {
                      e.stopPropagation();
                      handlePreview(doc);
                    }}
                    title="Preview"
                  >
                    👁️
                  </button>
                  <button
                    className={styles['btn-icon']}
                    onClick={(e) => {
                      e.stopPropagation();
                      onDownload(docId, doc.fileName || doc.documentName);
                    }}
                    title="Download"
                  >
                    ⬇️
                  </button>
                  <button
                    className={`${styles['btn-icon']} ${styles.delete}`}
                    onClick={() => onDelete(docId)}
                    title="Delete"
                  >
                    🗑️
                  </button>
                </div>
              </div>

              <div className={styles['document-info']} onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                handlePreview(doc);
              }}>

                <div className={styles['document-meta']} style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  {/* The Colorful Badge */}
                  <div className={styles['document-body']}>
                    <div className={styles['document-name']}>{doc.fileName || doc.documentName || 'Untitled Document'}</div>

                    {/* 2. Updated Badge using CSS Modules */}
                    <span className={`${styles.badge} ${typeClass}`}>
                      {doc.docType || 'OTHER'}
                    </span>

                    <span> • {doc.formattedSize || '0 KB'}</span>

                  </div>
                  <div className={styles['document-footer']}>
                    {doc.projectId ? (
                      <div>
                        <span>Project: </span>
                        <span className={styles['project-tag']}>
                                📁 {getProjectName(doc.projectId)}</span>
                      </div>
                    ) : (
                      <div className={styles['move-project-container']}>
                        <button
                          className={styles['btn-link']}
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedDocToMove(doc);
                            setIsMoveModalOpen(true);
                          }}
                        >
                          + Move to Project
                        </button>
                      </div>
                    )}
                    <span>• Uploaded {displayDate}</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Preview Modal Integration */}
      <DocumentPreviewModal
        isOpen={preview.isOpen}
        onClose={() => setPreview({ ...preview, isOpen: false })}
        fileUrl={preview.url}
        fileName={preview.name}
      />
      <UploadDocumentModal
        isOpen={isUploadModalOpen}
        onClose={() => setIsUploadModalOpen(false)}
        projects={projects} // Pass the full list for selection
        onUpload={(file, type, pid) => onUpload(file, type, pid)} // Pass all 3 parameters
      />
      <MoveToProjectModal
        isOpen={isMoveModalOpen}
        onClose={() => setIsMoveModalOpen(false)}
        projects={projects}
        docName={selectedDocToMove?.documentName || selectedDocToMove?.fileName}
        onMove={(pid) => onUpdateProject(selectedDocToMove.documentId, pid)}
      />
    </div >
  );
};

export default DocumentsTab;