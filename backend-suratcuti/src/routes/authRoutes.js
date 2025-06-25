const express = require('express');
const { register, login, getProfile } = require('../controllers/authController');
// const { registerSchema, loginSchema } = require('../validators/authValidator');
// const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');

const router = express.Router();

// Tidak perlu rate limiter untuk sekarang, fokus pada fungsionalitas utama
// const loginLimiter = ...

// POST /api/auth/register
router.post('/register', register);

// POST /api/auth/login
router.post('/login', login);

// GET /api/auth/profile
router.get('/profile', authMiddleware, getProfile);

module.exports = router; 