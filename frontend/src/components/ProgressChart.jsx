import React from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';

function ProgressChart({ tasks }) {
    const data = [
        { name: 'To Do', count: tasks.filter(t => t.status === 'todo').length },
        { name: 'In Progress', count: tasks.filter(t => t.status === 'inprogress').length },
        { name: 'Done', count: tasks.filter(t => t.status === 'done').length },
    ];

    return (
        <div style={{ width: '100%', height: 200 }}>
            <ResponsiveContainer>
                <BarChart
                    data={data}
                    margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                >
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />

                    <XAxis
                        dataKey="name"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        dy={10}
                    />
                    <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: '#64748b', fontSize: 12 }}
                        allowDecimals={false}
                    />

                    <Tooltip
                        cursor={{ fill: '#f1f5f9' }}
                        contentStyle={{
                            backgroundColor: '#fff',
                            border: '1px solid #e2e8f0',
                            borderRadius: '8px',
                            boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)'
                        }}
                    />

                    <Bar
                        dataKey="count"
                        fill="#2563EB"
                        radius={[4, 4, 0, 0]}
                        barSize={40}
                    />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
}

export default ProgressChart;
