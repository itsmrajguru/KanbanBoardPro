const taskService = require('../services/taskService');

const socketManager = (io) => {
    io.on('connection', async (socket) => {
        console.log(`User Connected: ${socket.id}`);

        // Send initial data efficiently
        try {
            const tasks = await taskService.getAllTasks();
            socket.emit('sync:tasks', tasks);
        } catch (err) {
            console.error('Initial sync failed:', err);
        }

        // --- Event Handlers ---

        // Create Task
        socket.on('task:create', async (data, callback) => {
            try {
                const newTask = await taskService.createTask(data);
                // Broadcast to all (including sender) to ensure sync
                io.emit('task:created', newTask);
                // Acknowledge receipt
                if (callback) callback({ status: 'ok', data: newTask });
            } catch (err) {
                if (callback) callback({ status: 'error', message: err.message });
            }
        });

        // Update Task
        socket.on('task:update', async (data, callback) => {
            try {
                const { id, ...updates } = data;
                const updatedTask = await taskService.updateTask(id, updates);
                io.emit('task:updated', updatedTask);
                if (callback) callback({ status: 'ok', data: updatedTask });
            } catch (err) {
                if (callback) callback({ status: 'error', message: err.message });
            }
        });

        // Move Task
        socket.on('task:move', async (data, callback) => {
            try {
                const { id, status } = data;
                const updatedTask = await taskService.moveTask(id, status);
                // Broadcast move specific event for smooth UI
                io.emit('task:moved', updatedTask);
                if (callback) callback({ status: 'ok', data: updatedTask });
            } catch (err) {
                if (callback) callback({ status: 'error', message: err.message });
            }
        });

        // Delete Task
        socket.on('task:delete', async (id, callback) => {
            try {
                await taskService.deleteTask(id);
                io.emit('task:deleted', id);
                if (callback) callback({ status: 'ok', id });
            } catch (err) {
                if (callback) callback({ status: 'error', message: err.message });
            }
        });

        // Typing Indicator
        socket.on('user:typing', (data) => {
            // Broadcast to others, not sender
            socket.broadcast.emit('user:typing', data);
        });

        socket.on('disconnect', () => {
            console.log('User Disconnected');
        });
    });
};

module.exports = socketManager;
