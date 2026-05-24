const User = require('../models/User');
const jwt = require('jsonwebtoken');


const generateAccessToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || "HACKATHON_SECRET_KEY", { expiresIn: '15m' });
};

const generateRefreshToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_REFRESH_SECRET || "HACKATHON_REFRESH_SECRET_KEY", { expiresIn: '7d' });
};

const protect = async (req, res, next) => {
    try {
        let token = req.headers.authorization;
        
        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).json({ message: "No token provided" });
        }
        
        token = token.slice(7); 
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "HACKATHON_SECRET_KEY");
        
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ message: "User not found" });
        }
        
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: "Unauthorized", error: error.message });
    }
};

// Authorize roles middleware
const authorizeRoles = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({ message: "Not authenticated" });
        }
        
        if (!roles.includes(req.user.role)) {
            return res.status(403).json({ message: `Access denied. Required role: ${roles.join(' or ')}` });
        }
        
        next();
    };
};

module.exports = { 
    protect,
    authorizeRoles,
    generateAccessToken,
    generateRefreshToken
};