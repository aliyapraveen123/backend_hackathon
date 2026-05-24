const mongoose = require('mongoose');

const assignmentSchema = new mongoose.Schema({
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
    title: { 
        type: String, 
        required: true 
    },
    fileUrl: { 
        type: String, 
        required: true // Cloudinary ka secure url yahan save hoga
    }
}, { timestamps: true });

module.exports = mongoose.model('Assignment', assignmentSchema);