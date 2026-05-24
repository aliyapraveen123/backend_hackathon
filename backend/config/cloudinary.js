const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

const allowedMimeTypes = new Set([
    'image/jpeg',
    'image/png',
    'application/pdf'
]);

const requiredCloudinaryKeys = [
    'CLOUDINARY_CLOUD_NAME',
    'CLOUDINARY_API_KEY',
    'CLOUDINARY_API_SECRET'
];

const missingCloudinaryKeys = requiredCloudinaryKeys.filter((key) => !process.env[key]);

if (missingCloudinaryKeys.length > 0) {
    throw new Error(`Missing Cloudinary config: ${missingCloudinaryKeys.join(', ')}`);
}

// Cloudinary ko credentials dena
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Storage engine set karna (Ki file kis folder mein aur kis format mein save hogi)
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'hackathon_uploads', // Cloudinary par is naam ka folder ban jayega
        allowed_formats: ['jpg', 'jpeg', 'png', 'pdf'], // Jo formats allow karne hain
    },
});

const fileFilter = (req, file, cb) => {
    if (allowedMimeTypes.has(file.mimetype)) {
        return cb(null, true);
    }

    const error = new Error('Invalid file type. Please upload only JPG, PNG, or PDF files.');
    error.status = 400;
    cb(error);
};

const upload = multer({
    storage: storage,
    fileFilter,
    limits: {
        fileSize: 10 * 1024 * 1024
    }
});

module.exports = upload;
