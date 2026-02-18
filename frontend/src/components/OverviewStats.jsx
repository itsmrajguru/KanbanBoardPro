import React from 'react';
import ProgressChart from './ProgressChart';

function OverviewStats({ tasks }) {
    const total = tasks.length;
    const inProgress = tasks.filter(t => t.status === 'inprogress').length;
    const completed = tasks.filter(t => t.status === 'done').length;
    const rate = total > 0 ? Math.round((completed / total) * 100) : 0;

    const StatCard = ({ label, value, subtext }) => (
        <div className="card" style={{ padding: 'var(--space-md)' }}>
            <div className="text-sm text-secondary font-medium">{label}</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 600, marginTop: '4px' }}>{value}</div>
            {subtext && <div className="text-xs text-muted" style={{ marginTop: '4px' }}>{subtext}</div>}
        </div>
    );

    return (
        <div style={{ marginBottom: 'var(--space-xl)' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 'var(--space-md)', marginBottom: 'var(--space-lg)' }}>
                <StatCard label="Total Tasks" value={total} subtext="Active tickets" />
                <StatCard label="In Progress" value={inProgress} subtext="Currently working" />
                <StatCard label="Completion Rate" value={`${rate}%`} subtext={`${completed} tasks done`} />
            </div>

            <div className="card" style={{ padding: 'var(--space-lg)', maxWidth: '600px', margin: '0 auto' }}>
                <h4 style={{ marginBottom: 'var(--space-md)', textAlign: 'center' }}>Task Velocity</h4>
                <ProgressChart tasks={tasks} />
            </div>
        </div>
    );
}

export default OverviewStats;
