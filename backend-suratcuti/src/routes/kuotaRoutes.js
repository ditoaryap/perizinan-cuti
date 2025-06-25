const express = require('express');
const router = express.Router();
const {
  getKuotaCuti,
  createKuotaCuti,
  updateKuotaCuti,
} = require('../controllers/kuotaController');
const authMiddleware = require('../middleware/auth');
const authorize = require('../middleware/authorize');

router.use(authMiddleware);

router.get('/', getKuotaCuti);
router.post('/', authorize('admin'), createKuotaCuti);
router.put('/:id', authorize('admin'), updateKuotaCuti);

module.exports = router; 