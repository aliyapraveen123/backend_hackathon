const mongoose = require('mongoose');

const enrollmentSchema = new mongoose.Schema({
    course: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Course', 
        required: true 
    },
    student: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    enrolledAt: { 
        type: Date, 
        default: Date.now 
    }
}, { timestamps: true });

// Ek student ek course mein ek hi baar enroll ho sake
enrollmentSchema.index({ course: 1, student: 1 }, { unique: true });

module.exports = mongoose.model('Enrollment', enrollmentSchema);