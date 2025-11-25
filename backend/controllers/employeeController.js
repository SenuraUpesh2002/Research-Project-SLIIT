const Employee = require('../models/Employee');
const jwt = require('jsonwebtoken');

// Get all employees
exports.getAllEmployees = async (req, res) => {
  try {
    const stationId = req.query.stationId;
    
    let employees;
    if (stationId) {
      employees = await Employee.getByStation(stationId);
    } else {
      employees = await Employee.getAll();
    }
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error fetching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employees'
    });
  }
};

// Get employee by ID
exports.getEmployeeById = async (req, res) => {
  try {
    const { id } = req.params;
    
    const employee = await Employee.getById(id);
    
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // Remove password from response
    delete employee.password;
    
    res.json({
      success: true,
      data: employee
    });
  } catch (error) {
    console.error('Error fetching employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch employee'
    });
  }
};

// Create new employee
exports.createEmployee = async (req, res) => {
  try {
    const { name, email, phone, role, password, station_id, date_of_joining } = req.body;
    
    // Validation
    if (!name || !email || !role || !password) {
      return res.status(400).json({
        success: false,
        error: 'Name, email, role, and password are required'
      });
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid email format'
      });
    }

    // Validate password strength (minimum 6 characters)
    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long'
      });
    }
    
    // Check if employee already exists
    const existingByEmail = await Employee.getByEmail(email);
    if (existingByEmail) {
      return res.status(409).json({
        success: false,
        error: 'Employee with this email already exists'
      });
    }
    
    const result = await Employee.create({ 
      name, 
      email, 
      phone, 
      role, 
      password, 
      station_id,
      date_of_joining 
    });
    
    res.status(201).json({
      success: true,
      message: 'Employee created successfully',
      data: result
    });
  } catch (error) {
    console.error('Error creating employee:', error);
    
    // Handle duplicate entry error
    if (error.code === 'ER_DUP_ENTRY') {
      return res.status(409).json({
        success: false,
        error: 'Employee with this email already exists'
      });
    }
    
    res.status(500).json({
      success: false,
      error: 'Failed to create employee'
    });
  }
};

// Update employee
exports.updateEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    
    const employee = await Employee.getById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    // If updating email, check if it's already taken by another employee
    if (updateData.email && updateData.email !== employee.email) {
      const existingEmail = await Employee.getByEmail(updateData.email);
      if (existingEmail) {
        return res.status(409).json({
          success: false,
          error: 'Email already in use by another employee'
        });
      }
    }
    
    await Employee.update(id, updateData);
    
    // Get updated employee data
    const updatedEmployee = await Employee.getById(id);
    delete updatedEmployee.password;
    
    res.json({
      success: true,
      message: 'Employee updated successfully',
      data: updatedEmployee
    });
  } catch (error) {
    console.error('Error updating employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to update employee'
    });
  }
};

// Delete employee
exports.deleteEmployee = async (req, res) => {
  try {
    const { id } = req.params;
    const { permanent } = req.query;
    
    const employee = await Employee.getById(id);
    if (!employee) {
      return res.status(404).json({
        success: false,
        error: 'Employee not found'
      });
    }
    
    if (permanent === 'true') {
      await Employee.hardDelete(id);
    } else {
      await Employee.delete(id);
    }
    
    res.json({
      success: true,
      message: permanent === 'true' ? 'Employee permanently deleted' : 'Employee deactivated successfully'
    });
  } catch (error) {
    console.error('Error deleting employee:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to delete employee'
    });
  }
};

// Search employees
exports.searchEmployees = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(400).json({
        success: false,
        error: 'Search term is required'
      });
    }
    
    const employees = await Employee.search(q.trim());
    
    res.json({
      success: true,
      count: employees.length,
      data: employees
    });
  } catch (error) {
    console.error('Error searching employees:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to search employees'
    });
  }
};

// Get employee statistics
exports.getStatistics = async (req, res) => {
  try {
    const { stationId } = req.query;
    
    const stats = await Employee.getStatistics(stationId);
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch statistics'
    });
  }
};

// Login employee
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: 'Email and password are required'
      });
    }
    
    const employee = await Employee.getByEmail(email);
    
    if (!employee) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }

    // Check if employee is active
    if (employee.status !== 'active') {
      return res.status(403).json({
        success: false,
        error: 'Account is inactive. Please contact administrator.'
      });
    }
    
    const isValidPassword = await Employee.verifyPassword(password, employee.password);
    
    if (!isValidPassword) {
      return res.status(401).json({
        success: false,
        error: 'Invalid email or password'
      });
    }
    
    // Generate JWT token
    const token = jwt.sign(
      { 
        id: employee.id,
        employee_id: employee.employee_id,
        email: employee.email, 
        role: employee.role,
        station_id: employee.station_id
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    );
    
    res.json({
      success: true,
      message: 'Login successful',
      data: {
        token,
        employee: {
          id: employee.id,
          employee_id: employee.employee_id,
          name: employee.name,
          email: employee.email,
          role: employee.role,
          station_id: employee.station_id
        }
      }
    });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({
      success: false,
      error: 'Login failed'
    });
  }
};