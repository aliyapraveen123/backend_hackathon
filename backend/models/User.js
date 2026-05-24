const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        unique: true,
        lowercase: true,
        required: true,
        trim: true 
    }, 

    password: {
        type: String,
        required: true,
        minlength: 6
    },

    role: {
        type:String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    
    isVerified: {
        type: Boolean,
        default: false
    }, 

    otp: {
        type: String
    },
    otpExpires: {
        type: Date
    }

}, {
    timestamps: true
})


const User = mongoose.model('User', userSchema);
module.exports = User;
