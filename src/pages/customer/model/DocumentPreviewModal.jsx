import React, { useState, useEffect } from 'react';
import styles from '../css/documents.module.css';

const DocumentPreviewModal = ({ isOpen, onClose, fileUrl, fileName }) => {
  const [isLoading, setIsLoading] = useState(true);
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);

  useEffect(() => {
    if (isOpen) {
      setIsLoading(true);
      setZoom(1);
      setRotation(0);
    }
  }, [fileUrl, isOpen]);

  if (!isOpen) return null;

  const isPdf = fileName?.toLowerCase().endsWith('.pdf');

  // Function to handle download from within the modal
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = fileUrl;
    link.setAttribute('download', fileName || 'document');
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  return (
    <div className={styles['preview-modal-overlay']} onClick={onClose}>
      <div className={styles['preview-modal-container']} onClick={e => e.stopPropagation()}>
        <div className={styles['preview-header']} >
          <div className={styles['preview-title-section']}>
            <span className={styles['file-title']}>🔍 {fileName}</span>
          </div>

            <div className={styles['preview-controls']}>
            {/* Action Buttons */}
            <button className={styles['btn-download-action']} onClick={handleDownload} title="Download File">
              💾 Download
            </button>

            <div className={styles['divider']}></div>

            {/* Image specific controls */}
            {!isPdf && (
              <>
                <button onClick={() => setZoom(prev => Math.max(prev - 0.2, 0.5))} title="Zoom Out">➖</button>
                <span className={styles['zoom-level']}>{Math.round(zoom * 100)}%</span>
                <button onClick={() => setZoom(prev => Math.min(prev + 0.2, 3))} title="Zoom In">➕</button>
                <button onClick={() => setRotation(prev => (prev + 90) % 360)} title="Rotate">🔄</button>
                <div className={styles['divider']}></div>
              </>
            )}

            <button className={styles['close-btn']} onClick={onClose} title="Close Preview">&times;</button>
          </div>
        </div>

        <div className={styles['preview-body']}>
          {isLoading && (
            <div className={styles['spinner-overlay']}>
              <div className={styles['spinner']}></div>
              <p>Loading Preview...</p>
            </div>
            
          )}

          {isPdf ? (
            <iframe
              src={fileUrl}
              onLoad={() => setIsLoading(false)}
              title="PDF Preview"
            />
          ) : (
            <div className={styles['image-wrapper']} style={{ overflow: 'auto' }}>
              <img
                src={fileUrl}
                alt="Preview"
                onLoad={() => setIsLoading(false)}
                style={{
                  transform: `scale(${zoom}) rotate(${rotation}deg)`,
                  transition: 'transform 0.2s ease-in-out',
                  display: isLoading ? 'none' : 'block'
                }}
                className={styles['preview-image']}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default DocumentPreviewModal;