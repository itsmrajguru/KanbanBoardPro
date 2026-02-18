const mongoose = require('mongoose');
const Task = require('../models/Task');
const ActivityLog = require('../models/ActivityLog');

// In-Memory Fallback Storage
let mockTasks = [];
let mockLogs = [];

// Helper to check DB status
const isConnected = () => mongoose.connection.readyState === 1;

// Auto-detect priority based on keywords
const detectPriority = (description) => {
    if (!description) return null;
    const lowerDesc = description.toLowerCase();
    if (lowerDesc.match(/\b(urgent|critical|asap|high priority)\b/)) {
        return 'high';
    }
    return null;
};

// Create a new task
exports.createTask = async (data) => {
    const { title, description, priority, category } = data;

    let finalPriority = priority || 'low';
    const autoPriority = detectPriority(description);
    if (autoPriority) {
        finalPriority = autoPriority;
    }

    // --- MONGODB ---
    if (isConnected()) {
        const task = await Task.create({
            title,
            description,
            priority: finalPriority,
            category
        });

        await ActivityLog.create({
            taskId: task._id,
            action: 'create',
            newValue: task.toObject()
        });
        return task;
    }

    // --- FALLBACK ---
    else {
        const task = {
            _id: Date.now().toString(), // Simulate ObjectID
            title,
            description,
            priority: finalPriority,
            category,
            status: 'todo',
            attachments: [],
            createdAt: new Date(),
            updatedAt: new Date()
        };
        mockTasks.push(task);
        console.warn('⚠️ using in-memory fallback for create');
        return task;
    }
};

// Update task fields
exports.updateTask = async (id, updates) => {

    // --- MONGODB ---
    if (isConnected()) {
        const task = await Task.findById(id);
        if (!task) throw new Error('Task not found');

        const originalTask = task.toObject();
        const changes = [];
        Object.keys(updates).forEach(key => {
            if (updates[key] !== undefined && updates[key] !== originalTask[key]) {
                changes.push({ field: key, old: originalTask[key], new: updates[key] });
                task[key] = updates[key];
            }
        });

        if (changes.length > 0) {
            await task.save();
            for (const change of changes) {
                await ActivityLog.create({
                    taskId: task._id,
                    action: 'update',
                    field: change.field,
                    previousValue: change.old,
                    newValue: change.new
                });
            }
        }
        return task;

    }

    // --- FALLBACK ---
    else {
        const taskIndex = mockTasks.findIndex(t => t._id === id || t.id === id);
        if (taskIndex === -1) throw new Error('Task not found');

        mockTasks[taskIndex] = { ...mockTasks[taskIndex], ...updates, updatedAt: new Date() };
        console.warn('⚠️ using in-memory fallback for update');
        return mockTasks[taskIndex];
    }
};

// Move task (Update status)
exports.moveTask = async (id, newStatus) => {

    // --- MONGODB ---
    if (isConnected()) {
        const task = await Task.findById(id);
        if (!task) throw new Error('Task not found');

        const oldStatus = task.status;
        if (oldStatus === newStatus) return task;

        task.status = newStatus;
        await task.save();

        await ActivityLog.create({
            taskId: task._id,
            action: 'move',
            field: 'status',
            previousValue: oldStatus,
            newValue: newStatus
        });
        return task;
    }

    // --- FALLBACK ---
    else {
        const taskIndex = mockTasks.findIndex(t => t._id === id || t.id === id);
        if (taskIndex === -1) throw new Error('Task not found');

        mockTasks[taskIndex].status = newStatus;
        console.warn('⚠️ using in-memory fallback for move');
        return mockTasks[taskIndex];
    }
};

// Delete task
exports.deleteTask = async (id) => {

    // --- MONGODB ---
    if (isConnected()) {
        const task = await Task.findById(id);
        if (!task) throw new Error('Task not found');
        await task.deleteOne();

        await ActivityLog.create({
            taskId: id,
            action: 'delete',
            previousValue: task.toObject()
        });
        return id;
    }

    // --- FALLBACK ---
    else {
        mockTasks = mockTasks.filter(t => t._id !== id && t.id !== id);
        console.warn('⚠️ using in-memory fallback for delete');
        return id;
    }
};

// Get all tasks
exports.getAllTasks = async () => {
    if (isConnected()) {
        return await Task.find().sort({ createdAt: -1 });
    } else {
        console.warn('⚠️ using in-memory fallback for getAll');
        return mockTasks;
    }
};
