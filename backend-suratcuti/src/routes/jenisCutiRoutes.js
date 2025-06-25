const express = require('express');
const router = express.Router();
const {
    getAllJenisCuti,
    createJenisCuti,
    updateJenisCuti,
    deleteJenisCuti,
} = require('../controllers/jenisCutiController');
const validate = require('../middleware/validate');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');
// Anda mungkin perlu membuat validator untuk ini
// const { createJenisCutiSchema, updateJenisCutiSchema } = require('../validators/cutiValidator');

router.use(authMiddleware);

router.get('/', getAllJenisCuti);
router.post('/', authorize('admin'), createJenisCuti); // Tambahkan validasi jika perlu
router.put('/:id', authorize('admin'), updateJenisCuti); // Tambahkan validasi jika perlu
router.delete('/:id', authorize('admin'), deleteJenisCuti);

module.exports = router; 