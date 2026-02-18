import React, { useState, useEffect } from 'react';
import { useSocket } from './hooks/useSocket';
import KanbanBoard from './components/KanbanBoard';
import TaskForm from './components/TaskForm';
import OverviewStats from './components/OverviewStats';
import TypingIndicator from './components/TypingIndicator';

function App() {
  const { socket, isConnected } = useSocket();
  const [tasks, setTasks] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(true);

  // Consistency: MongoDB uses _id, frontend libs often expect id
  const normalizeTask = (task) => ({ ...task, id: task._id || task.id });

  useEffect(() => {
    socket.on('sync:tasks', (serverTasks) => { setTasks(serverTasks.map(normalizeTask)); setLoading(false); });
    socket.on('task:created', (newTask) => setTasks(prev => [normalizeTask(newTask), ...prev]));
    socket.on('task:updated', (updatedTask) => setTasks(prev => prev.map(t => t.id === updatedTask._id ? normalizeTask(updatedTask) : t)));
    socket.on('task:moved', (movedTask) => setTasks(prev => prev.map(t => t.id === movedTask._id ? normalizeTask(movedTask) : t)));
    socket.on('task:deleted', (deletedId) => setTasks(prev => prev.filter(t => t.id !== deletedId)));

    return () => {
      socket.off('sync:tasks'); socket.off('task:created'); socket.off('task:updated'); socket.off('task:moved'); socket.off('task:deleted');
    };
  }, [socket]);

  const handleAddTask = (taskData) => { socket.emit('task:create', taskData, () => setShowForm(false)); };
  const handleMoveTask = ({ id, status }) => { socket.emit('task:move', { id, status }); };
  const handleDeleteTask = (id) => { if (confirm('Delete this task?')) socket.emit('task:delete', id); };

  return (
    <div className="app-container">
      <header className="header">
        <div style={{ fontSize: '1.25rem', fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--text-main)' }}>
          Kanban Board Pro
        </div>

        <div className="flex items-center gap-md">
          <div className="flex items-center gap-sm text-sm font-medium text-secondary">
            <div style={{
              width: '8px', height: '8px', borderRadius: '50%',
              background: isConnected ? '#10b981' : '#ef4444'
            }}></div>
            {isConnected ? 'Online' : 'Offline'}
          </div>

          <button className="btn btn-primary" onClick={() => setShowForm(!showForm)}>
            {showForm ? 'Close' : 'New Task'}
          </button>
        </div>
      </header>

      <main>
        {!loading && !showForm && <OverviewStats tasks={tasks} />}

        {showForm && (
          <div className="card" style={{ maxWidth: '500px', margin: '0 auto', marginBottom: 'var(--space-xl)', padding: 'var(--space-lg)' }}>
            <h3 style={{ marginBottom: 'var(--space-md)' }}>Create New Task</h3>
            <TaskForm onAdd={handleAddTask} onCancel={() => setShowForm(false)} />
          </div>
        )}

        {loading ? (
          <div className="text-muted" style={{ textAlign: 'center', padding: '4rem' }}>Loading workspace...</div>
        ) : (
          <KanbanBoard tasks={tasks} onMoveTask={handleMoveTask} onDeleteTask={handleDeleteTask} />
        )}
      </main>

      <TypingIndicator />
    </div>
  );
}

export default App;
