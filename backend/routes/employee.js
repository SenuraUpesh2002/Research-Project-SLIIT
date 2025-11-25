const express = require('express');
const router = express.Router();
const { getAllEmployees, getEmployeeById, updateEmployee, deleteEmployee } = require('../controllers/employeeController');
const auth = require('../middleware/authMiddleware');

router.get('/', auth, getAllEmployees);
router.get('/:id', auth, getEmployeeById);
router.put('/:id', auth, updateEmployee);
router.delete('/:id', auth, deleteEmployee);

module.exports = router;
