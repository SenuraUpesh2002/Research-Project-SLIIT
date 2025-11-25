const db = require('../config/database');
const bcrypt = require('bcryptjs');

class Employee {
  // Generate unique employee ID
  static generateEmployeeId() {
    const prefix = 'EMP';
    const timestamp = Date.now().toString().slice(-6);
    const random = Math.floor(Math.random() * 1000).toString().padStart(3, '0');
    return `${prefix}${timestamp}${random}`;
  }

  // Get all employees
  static async getAll() {
    const [rows] = await db.query(
      `SELECT 
        id,
        employee_id,
        name,
        email,
        phone,
        role,
        station_id,
        date_of_joining,
        status,
        created_at
      FROM employees
      ORDER BY created_at DESC`
    );
    return rows;
  }

  // Get employee by ID
  static async getById(id) {
    const [rows] = await db.query(
      `SELECT 
        id,
        employee_id,
        name,
        email,
        phone,
        role,
        station_id,
        date_of_joining,
        status,
        qr_code,
        device_id,
        created_at,
        updated_at
      FROM employees 
      WHERE id = ?`,
      [id]
    );
    return rows[0];
  }

  // Get employee by email
  static async getByEmail(email) {
    const [rows] = await db.query(
      'SELECT * FROM employees WHERE email = ?',
      [email]
    );
    return rows[0];
  }

  // Get employee by employee_id
  static async getByEmployeeId(employeeId) {
    const [rows] = await db.query(
      'SELECT * FROM employees WHERE employee_id = ?',
      [employeeId]
    );
    return rows[0];
  }

  // Create new employee
  static async create(employeeData) {
    const { 
      name, 
      email, 
      phone, 
      role, 
      password, 
      station_id,
      date_of_joining 
    } = employeeData;
    
    // Generate employee ID
    const employee_id = this.generateEmployeeId();
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Generate QR code data (JSON string)
    const qrCodeData = JSON.stringify({
      employee_id,
      name,
      email,
      station_id: station_id || process.env.DEFAULT_STATION_ID,
      issued_at: new Date().toISOString()
    });
    
    try {
      const [result] = await db.query(
        `INSERT INTO employees 
         (employee_id, name, email, phone, role, password, station_id, date_of_joining, qr_code, status)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 'active')`,
        [
          employee_id,
          name,
          email,
          phone || null,
          role,
          hashedPassword,
          station_id || process.env.DEFAULT_STATION_ID,
          date_of_joining || new Date().toISOString().split('T')[0],
          qrCodeData
        ]
      );
      
      return {
        id: result.insertId,
        employee_id,
        name,
        email,
        phone,
        role,
        station_id: station_id || process.env.DEFAULT_STATION_ID,
        qr_code: qrCodeData
      };
    } catch (error) {
      throw error;
    }
  }

  // Update employee
  static async update(id, updateData) {
    const fields = [];
    const values = [];
    
    if (updateData.name) {
      fields.push('name = ?');
      values.push(updateData.name);
    }
    
    if (updateData.email) {
      fields.push('email = ?');
      values.push(updateData.email);
    }
    
    if (updateData.phone) {
      fields.push('phone = ?');
      values.push(updateData.phone);
    }
    
    if (updateData.role) {
      fields.push('role = ?');
      values.push(updateData.role);
    }
    
    if (updateData.status) {
      fields.push('status = ?');
      values.push(updateData.status);
    }
    
    if (updateData.station_id) {
      fields.push('station_id = ?');
      values.push(updateData.station_id);
    }
    
    if (updateData.password) {
      const hashedPassword = await bcrypt.hash(updateData.password, 10);
      fields.push('password = ?');
      values.push(hashedPassword);
    }
    
    if (updateData.device_id) {
      fields.push('device_id = ?');
      values.push(updateData.device_id);
    }
    
    if (fields.length === 0) {
      throw new Error('No fields to update');
    }
    
    values.push(id);
    
    const [result] = await db.query(
      `UPDATE employees SET ${fields.join(', ')} WHERE id = ?`,
      values
    );
    
    return result;
  }

  // Delete employee (soft delete - set status to inactive)
  static async delete(id) {
    const [result] = await db.query(
      'UPDATE employees SET status = ? WHERE id = ?',
      ['inactive', id]
    );
    return result;
  }

  // Hard delete (permanently remove)
  static async hardDelete(id) {
    const [result] = await db.query(
      'DELETE FROM employees WHERE id = ?',
      [id]
    );
    return result;
  }

  // Verify password
  static async verifyPassword(plainPassword, hashedPassword) {
    return await bcrypt.compare(plainPassword, hashedPassword);
  }

  // Get employees by station
  static async getByStation(stationId) {
    const [rows] = await db.query(
      `SELECT 
        id,
        employee_id,
        name,
        email,
        phone,
        role,
        status,
        created_at
      FROM employees
      WHERE station_id = ? AND status = 'active'
      ORDER BY name ASC`,
      [stationId]
    );
    return rows;
  }

  // Search employees
  static async search(searchTerm) {
    const searchPattern = `%${searchTerm}%`;
    const [rows] = await db.query(
      `SELECT 
        id,
        employee_id,
        name,
        email,
        phone,
        role,
        status,
        created_at
      FROM employees
      WHERE (name LIKE ? OR email LIKE ? OR employee_id LIKE ?)
      AND status = 'active'
      ORDER BY name ASC`,
      [searchPattern, searchPattern, searchPattern]
    );
    return rows;
  }

  // Get employee statistics
  static async getStatistics(stationId = null) {
    let query = `
      SELECT 
        COUNT(*) as total_employees,
        SUM(CASE WHEN status = 'active' THEN 1 ELSE 0 END) as active_employees,
        SUM(CASE WHEN status = 'inactive' THEN 1 ELSE 0 END) as inactive_employees,
        COUNT(DISTINCT role) as total_roles
      FROM employees
    `;
    
    const params = [];
    
    if (stationId) {
      query += ' WHERE station_id = ?';
      params.push(stationId);
    }
    
    const [rows] = await db.query(query, params);
    return rows[0];
  }
}

module.exports = Employee;