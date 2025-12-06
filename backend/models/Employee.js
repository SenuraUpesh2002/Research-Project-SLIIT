const db = require('../config/db');

class Employee {
    static async create(employee) {
        const { employee_id, name, email, phone, role, password, device_id } = employee;
        const sql = `
      INSERT INTO employees 
      (employee_id, full_name, email, phone, role, password_hash, device_fingerprint) 
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;
        const [result] = await db.execute(sql, [employee_id, name, email, phone, role, password, device_id]);
        return result.insertId;
    }

    static async findByEmail(email) {
        const sql = 'SELECT * FROM employees WHERE email = ?';
        const [rows] = await db.execute(sql, [email]);
        return rows[0];
    }

    static async findById(id) {
        const sql = 'SELECT * FROM employees WHERE id = ?';
        const [rows] = await db.execute(sql, [id]);
        return rows[0];
    }
}

module.exports = Employee;
