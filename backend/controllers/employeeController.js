const Employee = require('../models/Employee');
const db = require('../config/db');

exports.getAllEmployees = async (req, res) => {
    try {
        const sql = 'SELECT id, employee_id, full_name, email, role, is_active FROM employees ORDER BY full_name';
        const [rows] = await db.execute(sql);
        res.json(rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.getEmployeeById = async (req, res) => {
    try {
        const employee = await Employee.findById(req.params.id);
        if (!employee) return res.status(404).json({ message: 'Employee not found' });
        const { password, ...empData } = employee;
        res.json(empData);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.updateEmployee = async (req, res) => {
    try {
        const { id } = req.params;
        const { full_name, email, role, is_active } = req.body;

        // Check if user is admin
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const sql = 'UPDATE employees SET full_name = ?, email = ?, role = ?, is_active = ? WHERE id = ?';
        const [result] = await db.execute(sql, [full_name, email, role, is_active, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee updated successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.deleteEmployee = async (req, res) => {
    try {
        const { id } = req.params;

        // Check if user is admin
        if (req.user.role !== 'manager') {
            return res.status(403).json({ message: 'Access denied. Admin only.' });
        }

        const sql = 'DELETE FROM employees WHERE id = ?';
        const [result] = await db.execute(sql, [id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ message: 'Employee not found' });
        }

        res.json({ message: 'Employee deleted successfully' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
};
