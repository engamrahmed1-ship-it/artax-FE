import React, { useState } from 'react';
import "../css/customerInfo.css";
import CreateNoteModal from '../model/CreateNoteModal';

const NotesTab = ({ notes, onDeleteNote, onAddNote, onUpdateNote }) => {

  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [isNoteModalOpen, setIsNoteModalOpen] = useState(false);
  const [editingNote, setEditingNote] = useState(null);

  const handleEditClick = (note) => {
    setEditingNote(note); // This passes the data to initialData in the Modal
    setIsNoteModalOpen(true);
  };

  const handleDelete = (noteId) => {
    if (window.confirm("Are you sure you want to delete this note?")) {
      onDeleteNote(noteId); // Ensure this matches your prop name
    }
  };

  const handleCloseModal = () => {
    setIsNoteModalOpen(false);
    setEditingNote(null);
  };

  if (!Array.isArray(notes)) return <div className="p-4">Loading notes...</div>;
  return (
    <div className="notes-container">
      <div className="notes-main-content">
        <div className="notes-header">
          <h3 className="section-title">Customer Notes</h3>
          <button className="btn-primary" onClick={() => {
            setEditingNote(null); // Ensure we are in "Add" mode
            setIsNoteModalOpen(true);
          }}>+ Add Note</button>
        </div>

        <div className="notes-grid">
          {notes.map((note) => (
            <div key={note.noteId} className="note-card">
              {/* ... confirm delete overlay ... */}

              <div className="note-card-header">
                <span className="note-author">{note.author}</span>
                <div className="note-actions">
                  <button className="btn-edit" onClick={() => handleEditClick(note)}>edit</button>
                  {/* FIX: Call handleDelete directly */}
                  <button className="btn-delete" onClick={() => handleDelete(note.noteId)}>delete</button>
                </div>
              </div>

              <div className="note-content">{note.content}</div>

              <div className="note-footer">
                <div className="note-tags">
                  {note.tags ? (
                    // Check if tags is already an array (from JSON) or a string (from CSV)
                    (Array.isArray(note.tags) ? note.tags : note.tags.split(',')).map((tag, idx) => (
                      // Change this line:
                      <span key={`${note.noteId}-tag-${idx}`}
                        className={`tag tag-${tag.toLowerCase().trim()}`}>
                        #{tag.trim()}
                      </span>
                    ))
                  ) : (
                    // Fallback if tags is null or undefined
                    <span className="tag-none">#general</span>
                  )}
                </div>
                <span className="note-date">{new Date(note.createdAt).toLocaleDateString()}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* RIGHT SIDE: THE CREATIVE VERTICAL TIMELINE */}
      <div className="notes-sidebar">
        <h4 className="sidebar-title">Activity Trail</h4>
        <div className="vertical-timeline">
          {notes.map((note, index) => (
            // Change this line:
            <div key={`time-${note.noteId}`} className="timeline-item">
              <div className="timeline-marker"></div>
              <div className="timeline-info">
                <p className="timeline-date">{note.date}</p>
                <p className="timeline-summary">{note.content.substring(0, 30)}...</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <CreateNoteModal
        isOpen={isNoteModalOpen}
        onClose={handleCloseModal}
        onSave={editingNote ? (data) => onUpdateNote(editingNote.noteId, data) : onAddNote}
        initialData={editingNote}
      />
    </div >
  );
};

export default NotesTab;