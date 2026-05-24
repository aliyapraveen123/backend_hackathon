const dotenv = require('dotenv').config();
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const pdfRoutes = require('./routes/pdfRoutes');
const studentRoutes = require('./routes/studentRoutes');
const connectDB = require('./config/db');
const express = require('express');
const cors = require('cors');
const morganMiddleware = require('./middleware/loggerMiddleware');
const errorHandler = require('./middleware/errorHandler');

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());
app.use(morganMiddleware); // Logging middleware

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/pdf', pdfRoutes);

// Error handling middleware (MUST be last)
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
     await connectDB();

     app.listen(PORT, () =>
          console.log(`Server running at http://localhost:${PORT}`)
     );
};

startServer();
