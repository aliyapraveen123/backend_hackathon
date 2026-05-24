const morgan = require('morgan');

// Custom Morgan tokens
morgan.token('user-id', (req) => {
    return req.user?.id || 'anonymous';
});

morgan.token('response-time-ms', (req, res) => {
    if (!res._header) return '';
    return res.getHeader('X-Response-Time') || 'N/A';
});

// Create Morgan middleware for logging
const morganMiddleware = morgan(
    ':remote-addr - :user-id [:date[clf]] ":method :url HTTP/:http-version" :status :res[content-length] ":referrer" ":user-agent" - :response-time ms'
);

module.exports = morganMiddleware;
