import React from 'react';

const NotesTab = ({ notes }) => {
  return (
    <div className="notes-section">
      <div className="notes-header">
        <h3 className="section-title">Notes</h3>
        <button className="btn-primary">+ Add Note</button>
      </div>
      {notes.map(note => (
        <div key={note.id} className="note-item">
          <div className="note-header">
            <span className="note-author">{note.author}</span>
            <span className="note-date">{note.date}</span>
          </div>
          <div className="note-content">{note.content}</div>
        </div>
      ))}
    </div>
  );
};

export default NotesTab;
