// Global Error Handler Middleware
const errorHandler = (err, req, res, next) => {
    // Set default values
    const isUnexpectedFile = err.code === 'LIMIT_UNEXPECTED_FILE';
    const isFileTooLarge = err.code === 'LIMIT_FILE_SIZE';
    const status = isUnexpectedFile || isFileTooLarge ? 400 : err.status || err.statusCode || 500;
    let message = err.message || 'Internal Server Error';

    if (isUnexpectedFile) {
        message = `Unexpected file field "${err.field}". Use one of: courseImage, image, file, thumbnail.`;
    }

    if (isFileTooLarge) {
        message = 'File is too large. Maximum upload size is 10MB.';
    }

    // Log error FULLY
    console.error(`[ERROR] ${status} - ${message}`);
    console.error('Full Error:', err);
    if (err.stack) {
        console.error(err.stack);
    }

    // Send response
    res.status(status).json({
        success: false,
        error: {
            status,
            message,
            // Include stack trace in development
            ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
        }
    });
};

module.exports = errorHandler;
