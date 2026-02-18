import React from 'react';
import { useDroppable } from '@dnd-kit/core';
import TaskCard from './TaskCard';

function Column({ id, title, tasks, onDeleteTask }) {
    const { setNodeRef } = useDroppable({ id });

    return (
        <div ref={setNodeRef} className="column" style={{ minHeight: '500px' }}>
            <div className="column-header">
                <span>{title}</span>
                <span style={{
                    background: '#e2e8f0',
                    padding: '2px 8px',
                    borderRadius: '12px',
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)'
                }}>
                    {tasks.length}
                </span>
            </div>

            <div style={{ padding: 'var(--space-md)', flex: 1, display: 'flex', flexDirection: 'column', gap: 'var(--space-md)' }}>
                {tasks.map(task => (
                    <TaskCard key={task.id} task={task} onDelete={onDeleteTask} />
                ))}

                {tasks.length === 0 && (
                    <div style={{
                        border: '1px dashed var(--border)',
                        borderRadius: 'var(--radius-md)',
                        padding: '2rem 1rem',
                        textAlign: 'center',
                        color: 'var(--text-muted)',
                        fontSize: '0.875rem'
                    }}>
                        No tasks
                    </div>
                )}
            </div>
        </div>
    );
}

export default Column;
