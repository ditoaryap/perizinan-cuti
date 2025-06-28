const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const mountRoutes = require('./routes'); // Mengarah ke src/routes/index.js

const app = express();

// Middleware
app.use(cors({
    origin: [
        'http://localhost:5003',
        'http://156.67.218.83:5003'
    ], // Ganti/extend sesuai domain frontend kamu
    credentials: true
}));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
if (process.env.NODE_ENV === 'development') {
    app.use(morgan('dev'));
}

// Root endpoint
app.get('/', (req, res) => {
    res.json({ message: 'Welcome to Cuti API' });
});

// Mount all API routes
mountRoutes(app);

// 404 Handler
app.use((req, res, next) => {
    const error = new Error('Not Found');
    error.status = 404;
    next(error);
});

// Global Error Handler
app.use((err, req, res, next) => {
    res.status(err.status || 500);
    res.json({
        success: false,
        message: err.message || 'Internal Server Error',
    });
});

module.exports = app; 