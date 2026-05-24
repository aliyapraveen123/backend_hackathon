// Input Validation Middleware
const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

const validatePassword = (password) => {
    // At least 6 characters
    return password && password.length >= 6;
};

const validateName = (name) => {
    return name && name.trim().length >= 2;
};

// Middleware for registration validation
const validateRegister = (req, res, next) => {
    const { name, email, password } = req.body;

    if (!name || !validateName(name)) {
        return res.status(400).json({ message: "Name must be at least 2 characters" });
    }

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!password || !validatePassword(password)) {
        return res.status(400).json({ message: "Password must be at least 6 characters" });
    }

    next();
};

// Middleware for login validation
const validateLogin = (req, res, next) => {
    const { email, password } = req.body;

    if (!email || !validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format" });
    }

    if (!password) {
        return res.status(400).json({ message: "Password is required" });
    }

    next();
};

// Middleware for course validation
const validateCourse = (req, res, next) => {
    const { title, description } = req.body;

    if (!title || title.trim().length === 0) {
        return res.status(400).json({ message: "Course title is required" });
    }

    if (!description || description.trim().length === 0) {
        return res.status(400).json({ message: "Course description is required" });
    }

    next();
};

module.exports = {
    validateRegister,
    validateLogin,
    validateCourse,
    validateEmail,
    validatePassword,
    validateName
};
