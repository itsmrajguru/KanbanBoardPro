import React, { useState } from 'react';
import { useSocket } from '../hooks/useSocket';

// simple form to add new task
// handles file upload too
function TaskForm({ onAdd, onCancel }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [priority, setPriority] = useState('low');
    const [category, setCategory] = useState('feature');
    const [fileUrl, setFileUrl] = useState('');
    const [fileName, setFileName] = useState('');
    const { socket } = useSocket();

    const handleTyping = () => {
        if (socket) {
            socket.emit('user:typing', { user: 'Anonymous User' });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // basic check
        if (!title) {
            alert("Title is required!");
            return;
        }

        const newTask = {
            id: Date.now().toString(), // simple id generation
            title,
            description,
            status: 'todo', // default status
            priority,
            category,
            attachments: fileUrl ? [{ name: fileName, url: fileUrl }] : []
        };

        onAdd(newTask);

        // reset form
        setTitle('');
        setDescription('');
        setPriority('low');
        setCategory('feature');
        setFileUrl('');
        setFileName('');
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // check if it is image or pdf
            if (file.type.startsWith('image/') || file.type === 'application/pdf') {
                const url = URL.createObjectURL(file);
                setFileUrl(url);
                setFileName(file.name);
            } else {
                alert("Only images and PDFs are allowed!");
                e.target.value = ''; // clear input
            }
        }
    };

    return (
        <div>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Add New Task</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-md">

                <input
                    className="input"
                    type="text"
                    placeholder="Task Title"
                    value={title}
                    onChange={(e) => {
                        setTitle(e.target.value);
                        handleTyping();
                    }}
                />

                <textarea
                    className="textarea"
                    placeholder="Description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                />

                <div className="flex gap-md">
                    <div className="w-full">
                        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Priority</label>
                        <select className="select" value={priority} onChange={(e) => setPriority(e.target.value)}>
                            <option value="low">Low Priority</option>
                            <option value="medium">Medium Priority</option>
                            <option value="high">High Priority</option>
                        </select>
                    </div>

                    <div className="w-full">
                        <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Category</label>
                        <select className="select" value={category} onChange={(e) => setCategory(e.target.value)}>
                            <option value="bug">Bug</option>
                            <option value="feature">Feature</option>
                            <option value="enhancement">Enhancement</option>
                        </select>
                    </div>
                </div>

                <div>
                    <label style={{ display: 'block', marginBottom: 'var(--space-xs)', fontSize: 'var(--font-size-xs)', fontWeight: 600 }}>Attachment</label>
                    <input type="file" onChange={handleFileChange} className="input" style={{ padding: '6px' }} />
                    {fileName && <div style={{ fontSize: 'var(--font-size-xs)', marginTop: '4px', color: 'var(--text-muted)' }}>Selected: {fileName}</div>}
                </div>

                <div className="flex gap-md mt-md">
                    <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Add Task</button>
                    <button type="button" onClick={onCancel} className="btn btn-secondary" style={{ flex: 1 }}>Cancel</button>
                </div>

            </form>
        </div>
    );
}

export default TaskForm;
