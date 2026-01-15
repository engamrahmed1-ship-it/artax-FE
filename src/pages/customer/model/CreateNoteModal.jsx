import React, { useEffect, useState } from 'react';
import "../css/customerInfo.css";

const CreateNoteModal = ({ isOpen, onClose, onSave, initialData }) => {
    const [noteData, setNoteData] = useState({
        author: '',
        content: '',
        tags: []
    });

    const MAX_CHARACTERS = 1000;
    const availableTags = ['Urgent', 'Billing', 'Follow-up', 'General'];

    const handleTagToggle = (tag) => {
        setNoteData(prev => ({
            ...prev,
            tags: prev.tags.includes(tag)
                ? prev.tags.filter(t => t !== tag)
                : [...prev.tags, tag]
        }));
    };

    // Inside CreateNoteModal.jsx handleSubmit
    const handleSubmit = (e) => {
        e.preventDefault();

        // 1. Prepare the payload specifically for the API
        const payload = {
            author: noteData.author,
            content: noteData.content,
            // Convert array ["Follow-up"] to string "Follow-up" for the BE Record
            tags: noteData.tags.join(',')
        };

        // 2. Pass the clean payload to your handler
        // Your handler (onSave) will call createNoteApi
        onSave(payload);

        // 3. Reset form and close
        setNoteData({ author: '', content: '', tags: [] });
        onClose();
    };

    // FIX: Populate form when editing
    useEffect(() => {
        if (initialData && isOpen) {
            setNoteData({
                author: initialData.author || '',
                content: initialData.content || '',
                // Ensure tags is an array for the UI toggle logic
                tags: Array.isArray(initialData.tags)
                    ? initialData.tags
                    : (initialData.tags?.split(',') || [])
            });
        } else if (!initialData && isOpen) {
            // Reset for "Add New" mode
            setNoteData({ author: '', content: '', tags: [] });
        }
    }, [initialData, isOpen]);

    if (!isOpen) return null;

    return (
        <div className="note-modal-overlay">
            <div className="note-modal-container">
                <div className="note-modal-header">
                    <h3>{initialData ? 'Update Note' : 'Create New Note'}</h3>
                    <button className="close-btn" onClick={onClose}>&times;</button>
                </div>
                <div className="note-modal-body"  >
                    <form onSubmit={handleSubmit}>
                        <div className="note-form-group">
                            <label>Author Name</label>
                            <input
                                type="text"
                                placeholder="e.g. Sarah J."
                                required
                                value={noteData.author}
                                onChange={(e) => setNoteData({ ...noteData, author: e.target.value })}
                            />
                        </div>

                        <div className="note-form-group">
                            <div className="label-row">
                                <label>Note Content</label>
                                {/* --- Character Counter UI --- */}
                                <span className={`char-counter ${noteData.content.length >= MAX_CHARACTERS ? 'limit' : ''}`}>
                                    {noteData.content.length} / {MAX_CHARACTERS}
                                </span>
                            </div>
                            <textarea
                                rows="8"
                                maxLength={MAX_CHARACTERS}
                                placeholder="Write your note here..."
                                required
                                value={noteData.content}
                                onChange={(e) => setNoteData({ ...noteData, content: e.target.value })}
                            ></textarea>
                        </div>

                        <div className="note-form-group">
                            <label>Select Tags</label>
                            <div className="tag-selector">
                                {availableTags.map(tag => (
                                    <button
                                        key={tag}
                                        type="button"
                                        className={`tag-option ${noteData.tags.includes(tag) ? 'active' : ''}`}
                                        onClick={() => handleTagToggle(tag)}
                                    >
                                        {tag}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="note-modal-actions">
                            <button type="button" className="btn-secondary" onClick={onClose}>Cancel</button>
                            <button type="submit" className="btn-primary">Save Note</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateNoteModal;