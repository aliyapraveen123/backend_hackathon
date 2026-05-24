const express = require('express');
const router = express.Router();
const Enrollment = require('../models/Enrollment');
const Assignment = require('../models/Assignment');
const Course = require('../models/Course');
const upload = require('../config/cloudinary'); // Cloudinary storage setup file
const { protect, authorizeRoles } = require('../middleware/authMiddleware');

// 1. API: Enroll in a Course (Sirf Student/User role ke liye)
router.post('/enroll/:courseId', protect, authorizeRoles('user'), async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user.id; // Middleware se aayi id

        // Check karo course sach mein exist karta hai ya nahi
        const courseExists = await Course.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found!" });
        }

        // Check karo user pehle se enrolled toh nahi hai
        const alreadyEnrolled = await Enrollment.findOne({ course: courseId, student: studentId });
        if (alreadyEnrolled) {
            return res.status(400).json({ message: "You are already enrolled in this course." });
        }

        const enrollment = new Enrollment({
            course: courseId,
            student: studentId
        });

        await enrollment.save();
        res.status(201).json({ message: "Successfully enrolled in the course!", data: enrollment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 2. API: Upload Assignment (Cloudinary integration + Student validation)
router.post('/upload-assignment/:courseId', protect, authorizeRoles('user'), upload.single('assignmentFile'), async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user.id;
        const { title } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Assignment title is required." });
        }

        // Check karo ki user pehle course mein enrolled hai ya nahi
        const isEnrolled = await Enrollment.findOne({ course: courseId, student: studentId });
        if (!isEnrolled) {
            return res.status(403).json({ message: "You must enroll in the course before submitting assignments." });
        }

        // Check karo file aayi hai ya nahi
        if (!req.file) {
            return res.status(400).json({ message: "Please upload an assignment file (PDF/Image)." });
        }

        const newAssignment = new Assignment({
            course: courseId,
            student: studentId,
            title: title,
            fileUrl: req.file.path // Cloudinary automatically gives secure URL here
        });

        await newAssignment.save();
        res.status(201).json({ message: "Assignment uploaded successfully!", data: newAssignment });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 3. API: Get Assignments for a Course
router.get('/assignments/:courseId', protect, async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        // Check course exists
        const courseExists = await Course.findById(courseId);
        if (!courseExists) {
            return res.status(404).json({ message: "Course not found!" });
        }

        // Get all assignments for this course with pagination
        const assignments = await Assignment.find({ course: courseId })
            .populate('student', 'name email')
            .populate('course', 'title')
            .skip(skip)
            .limit(limit)
            .sort({ createdAt: -1 });

        const totalAssignments = await Assignment.countDocuments({ course: courseId });

        res.status(200).json({
            success: true,
            count: assignments.length,
            metadata: {
                totalDocuments: totalAssignments,
                totalPages: Math.ceil(totalAssignments / limit),
                currentPage: page,
                limit
            },
            data: assignments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// 4. API: Get My Assignments (Student can see their own assignments)
router.get('/my-assignments/:courseId', protect, authorizeRoles('user'), async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const studentId = req.user.id;

        // Check if user is enrolled in the course
        const isEnrolled = await Enrollment.findOne({ course: courseId, student: studentId });
        if (!isEnrolled) {
            return res.status(403).json({ message: "You are not enrolled in this course!" });
        }

        const myAssignments = await Assignment.find({ course: courseId, student: studentId })
            .populate('course', 'title')
            .sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            count: myAssignments.length,
            data: myAssignments
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;