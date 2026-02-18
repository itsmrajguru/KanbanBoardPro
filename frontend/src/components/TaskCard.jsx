import React from 'react';
import { useDraggable } from '@dnd-kit/core';

function TaskCard({ task, onDelete }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id: task.id });

    const style = transform ? {
        transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
        zIndex: 999,
    } : undefined;

    const getBadgeStyle = (p) => {
        if (p === 'high') return { bg: 'var(--badge-high-bg)', color: 'var(--badge-high-text)' };
        if (p === 'medium') return { bg: 'var(--badge-med-bg)', color: 'var(--badge-med-text)' };
        return { bg: 'var(--badge-low-bg)', color: 'var(--badge-low-text)' };
    };

    const badge = getBadgeStyle(task.priority);

    return (
        <div
            ref={setNodeRef}
            className="card"
            style={{
                ...style,
                padding: 'var(--space-md)',
                cursor: 'grab',
                transition: 'box-shadow 0.2s',
                position: 'relative'
            }}
            {...listeners}
            {...attributes}
            onMouseEnter={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-md)'}
            onMouseLeave={(e) => e.currentTarget.style.boxShadow = 'var(--shadow-sm)'}
        >
            <div className="flex justify-between items-start" style={{ marginBottom: '0.5rem' }}>
                <span style={{
                    fontSize: '0.75rem',
                    fontWeight: 500,
                    color: badge.color,
                    background: badge.bg,
                    padding: '2px 8px',
                    borderRadius: '4px'
                }}>
                    {task.priority}
                </span>

                <button
                    onClick={(e) => { e.stopPropagation(); onDelete(task.id); }}
                    onPointerDown={(e) => e.stopPropagation()}
                    style={{
                        background: 'none',
                        border: 'none',
                        color: 'var(--text-muted)',
                        padding: 0,
                        cursor: 'pointer',
                        fontSize: '1rem'
                    }}
                    title="Delete"
                >
                    &times;
                </button>
            </div>

            <div style={{
                fontWeight: 500,
                fontSize: '0.875rem',
                color: 'var(--text-main)',
                marginBottom: '0.25rem'
            }}>
                {task.title}
            </div>

            {task.description && (
                <div className="text-secondary text-sm" style={{ marginBottom: '0.75rem', lineHeight: '1.4' }}>
                    {task.description}
                </div>
            )}

            <div className="flex items-center gap-sm" style={{ borderTop: '1px solid var(--bg-app)', paddingTop: '0.5rem', marginTop: '0.5rem' }}>
                <span style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-muted)',
                    background: 'var(--bg-app)',
                    padding: '2px 6px',
                    borderRadius: '4px'
                }}>
                    {task.category}
                </span>
            </div>
        </div>
    );
}

export default TaskCard;
