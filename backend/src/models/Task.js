const mongoose = require('mongoose');

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, 'Please add a task title'],
        trim: true,
        maxlength: [100, 'Title cannot be more than 100 characters']
    },
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    },
    status: {
        type: String,
        enum: ['todo', 'inprogress', 'done'],
        default: 'todo'
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium'
    },
    category: {
        type: String,
        enum: ['bug', 'feature', 'enhancement'],
        default: 'feature'
    },
    attachments: [
        {
            name: String,
            url: String,
            uploadedAt: {
                type: Date,
                default: Date.now
            }
        }
    ],
    // Embedding activity logs for simplicity in this use case, 
    // though for massive scale referencing might be better. 
    // Given requirements, let's reference or embed. 
    // The requirement says "Create Activity Log model", implying a separate collection typically,
    // but embedding recent activity is fast. Let's start with a separate model as requested.
}, {
    timestamps: true
});

module.exports = mongoose.model('Task', taskSchema);
