const express = require('express');
const router = express.Router();
const {registerUser, loginUser, verifyOtp, resendOTP} = require('../controllers/authController');
const User = require('../models/User');
const { protect, authorizeRoles, generateAccessToken } = require('../middleware/authMiddleware');
const jwt = require('jsonwebtoken');

router.post('/register', registerUser);
router.post('/verify', verifyOtp);
router.post('/login', loginUser);
router.post('/resendOtp', resendOTP);

// POST: Refresh Access Token
router.post('/refresh-token', async (req, res) => {
    try {
        const { refreshToken } = req.body;

        if (!refreshToken) {
            return res.status(401).json({ message: "Refresh Token is required" });
        }

        const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET || "HACKATHON_REFRESH_SECRET_KEY");
        
        const newAccessToken = generateAccessToken(decoded.id);

        res.status(200).json({
            success: true,
            message: "Access token refreshed successfully",
            accessToken: newAccessToken
        });
    } catch (error) {
        res.status(401).json({ message: "Invalid or expired refresh token", error: error.message });
    }
});

// GET: Get Current User Profile
router.get('/profile', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }
        res.status(200).json({
            success: true,
            data: user
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// GET: View All Users (Admin only)
router.get('/admin/users', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const users = await User.find()
            .select('-password')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalUsers = await User.countDocuments();

        res.status(200).json({
            success: true,
            count: users.length,
            metadata: {
                totalDocuments: totalUsers,
                totalPages: Math.ceil(totalUsers / limit),
                currentPage: page,
                limit
            },
            data: users
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// DELETE: Delete User (Admin only)
router.delete('/admin/users/:userId', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const userId = req.params.userId;
        
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: "User not found!" });
        }

        await User.findByIdAndDelete(userId);
        res.status(200).json({
            success: true,
            message: "User deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;