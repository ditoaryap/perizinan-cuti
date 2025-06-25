const express = require('express');
const router = express.Router();
const { getLaporan, getDashboardStats, downloadLaporanPdf } = require('../controllers/laporanController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authMiddleware, authorize('admin'));

router.get('/', getLaporan);
router.get('/pdf', downloadLaporanPdf);
router.get('/stats', getDashboardStats);

module.exports = router; 