const express = require('express');
const {
  getAllAlerts,
  createAlert,
  deleteAlert,
  alertStream,
} = require('../controllers/alertController');

const router = express.Router();

router.get('/stream', alertStream);
router.get('/', getAllAlerts);
router.post('/', createAlert);
router.delete('/:id', deleteAlert);

module.exports = router;
