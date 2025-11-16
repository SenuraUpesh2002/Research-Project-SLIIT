import { useState, useCallback } from 'react';
import { generateMockEmployees, generateMockAttendance } from '../services/mockData';
import { generateId } from '../utils/helpers';

export const useEmployees = () => {
  const [employees, setEmployees] = useState(generateMockEmployees());
  const [attendance, setAttendance] = useState(generateMockAttendance());
  const [loading, setLoading] = useState(false);

  // Add new employee
  const addEmployee = useCallback((employee) => {
    const newEmployee = {
      ...employee,
      id: generateId(),
      status: 'Checked Out',
      lastActivity: new Date(),
    };
    setEmployees(prev => [...prev, newEmployee]);
  }, []);

  // Check-in employee
  const checkIn = useCallback((employeeId, deviceId, locationVerified) => {
    const employee = employees.find(e => e.employeeId === employeeId);
    if (!employee) return;

    setEmployees(prev =>
      prev.map(e =>
        e.employeeId === employeeId
          ? { ...e, status: 'Checked In', lastActivity: new Date() }
          : e
      )
    );

    const newRecord = {
      id: generateId(),
      employeeId: employee.employeeId,
      employeeName: employee.name,
      checkIn: new Date(),
      locationVerified,
      deviceId,
    };

    setAttendance(prev => [...prev, newRecord]);
  }, [employees]);

  // Check-out employee
  const checkOut = useCallback((employeeId) => {
    setEmployees(prev =>
      prev.map(e =>
        e.id === employeeId
          ? { ...e, status: 'Checked Out', lastActivity: new Date() }
          : e
      )
    );

    setAttendance(prev =>
      prev.map(record => {
        if (record.employeeId === employeeId && !record.checkOut) {
          return { ...record, checkOut: new Date() };
        }
        return record;
      })
    );
  }, [employees]);

  // Delete employee
  const deleteEmployee = useCallback((id) => {
    setEmployees(prev => prev.filter(e => e.id !== id));
  }, []);

  return {
    employees,
    attendance,
    loading,
    addEmployee,
    checkIn,
    checkOut,
    deleteEmployee,
  };
};