const mongoose = require('mongoose');

const activityLogSchema = new mongoose.Schema({
    taskId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Task',
        required: true
    },
    action: {
        type: String,
        required: true,
        enum: ['create', 'update', 'move', 'delete', 'upload']
    },
    field: {
        type: String, // e.g., 'status', 'priority'
    },
    previousValue: {
        type: mongoose.Schema.Types.Mixed
    },
    newValue: {
        type: mongoose.Schema.Types.Mixed
    },
    performedBy: {
        type: String, // User ID or Name (Anonymous for now if no auth)
        default: 'User'
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ActivityLog', activityLogSchema);
