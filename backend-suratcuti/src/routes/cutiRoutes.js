const express = require('express');
const router = express.Router();
const {
    getAllCutiRequests,
    getCutiRequestById,
    createCutiRequest,
    approveCutiRequest,
    rejectCutiRequest,
    downloadCutiPdf,
} = require('../controllers/cutiController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authMiddleware);

router.get('/', getAllCutiRequests);
router.post('/', createCutiRequest);
router.get('/:id', getCutiRequestById);
router.put('/:id/approve', authorize('admin'), approveCutiRequest);
router.put('/:id/reject', authorize('admin'), rejectCutiRequest);
router.get('/:id/pdf', downloadCutiPdf);

module.exports = router; 