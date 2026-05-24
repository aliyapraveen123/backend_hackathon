const express = require('express');
const router = express.Router();
const Course = require('../models/Course');
const upload = require('../config/cloudinary'); 
const { protect, authorizeRoles } = require('../middleware/authMiddleware'); 

const courseImageUpload = upload.fields([
    { name: 'courseImage', maxCount: 1 },
    { name: 'image', maxCount: 1 },
    { name: 'file', maxCount: 1 },
    { name: 'thumbnail', maxCount: 1 }
]);

const getCourseImage = (files = {}) => {
    const imageFields = ['courseImage', 'image', 'file', 'thumbnail'];
    const fieldName = imageFields.find((field) => files[field]?.[0]);
    return fieldName ? files[fieldName][0] : null;
};

router.post('/create', protect, authorizeRoles('admin'), courseImageUpload, async (req, res, next) => {
    try {
        const { title, description } = req.body;
        const courseImage = getCourseImage(req.files);
        
        console.log('Request body:', req.body);
        console.log('File:', courseImage);
        console.log('User:', req.user);
        
        // Validation
        if (!title || !description) {
            return res.status(400).json({ 
                message: "Title and description are required!",
                received: { title, description }
            });
        }
        
        // req.file.path mein Cloudinary ka link automatic aa jata hai
        const imageUrl = courseImage ? courseImage.path : ''; 

        const newCourse = new Course({
            title,
            description,
            image: imageUrl,
            createdBy: req.user._id
        });

        await newCourse.save();
        res.status(201).json({ 
            success: true,
            message: "Course Created Successfully!", 
            course: newCourse 
        });
    } catch (error) {
        console.error('Course creation error:', error);
        next(error); // Pass to error handler
    }
});


router.get('/', async (req, res) => {
    try {
       
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;
        
        const search = req.query.search || '';
        const sortBy = req.query.sortBy || 'createdAt';
        const sortOrder = req.query.sortOrder === 'desc' ? -1 : 1;

        
        let queryObject = {};
        if (search) {
            queryObject.title = { $regex: search, $options: 'i' }; 
        }

        const courses = await Course.find(queryObject)
            .populate('createdBy', 'name email') 
            .sort({ [sortBy]: sortOrder })
            .skip(skip)
            .limit(limit);

        
        const totalCourses = await Course.countDocuments(queryObject);

        res.status(200).json({
            success: true,
            count: courses.length,
            metadata: {
                totalDocuments: totalCourses,
                totalPages: Math.ceil(totalCourses / limit),
                currentPage: page,
                limit
            },
            data: courses
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// GET: Get Course By ID
router.get('/:id', async (req, res) => {
    try {
        const courseId = req.params.id;
        
        const course = await Course.findById(courseId)
            .populate('createdBy', 'name email');
        
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }
        
        res.status(200).json({
            success: true,
            data: course
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// PATCH: Update Course (Only Admin can update their own courses)
router.patch('/:id', protect, authorizeRoles('admin'), courseImageUpload, async (req, res) => {
    try {
        const courseId = req.params.id;
        const { title, description } = req.body;
        const courseImage = getCourseImage(req.files);
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }
        
        // Check if the admin is the one who created this course
        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You don't have permission to update this course!" });
        }
        
        // Update fields
        if (title) course.title = title;
        if (description) course.description = description;
        if (courseImage) course.image = courseImage.path;
        
        await course.save();
        res.status(200).json({
            success: true,
            message: "Course updated successfully!",
            data: course
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

// DELETE: Delete Course (Only Admin can delete their own courses)
router.delete('/:id', protect, authorizeRoles('admin'), async (req, res) => {
    try {
        const courseId = req.params.id;
        
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found!" });
        }
        
        // Check if the admin is the one who created this course
        if (course.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: "You don't have permission to delete this course!" });
        }
        
        await Course.findByIdAndDelete(courseId);
        res.status(200).json({
            success: true,
            message: "Course deleted successfully!"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

module.exports = router;
