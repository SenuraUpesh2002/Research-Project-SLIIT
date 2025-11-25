// import { useState, useCallback } from 'react';
// import { generateMockEmployees, generateMockAttendance } from '../services/mockData';
// import { generateId } from '../utils/helpers';

// export const useEmployees = () => {
//   const [employees, setEmployees] = useState(generateMockEmployees());
//   const [attendance, setAttendance] = useState(generateMockAttendance());
//   const [loading, setLoading] = useState(false);

//   // Add new employee
//   const addEmployee = useCallback((employee) => {
//     const newEmployee = {
//       ...employee,
//       id: generateId(),
//       status: 'Checked Out',
//       lastActivity: new Date(),
//     };
//     setEmployees(prev => [...prev, newEmployee]);
//   }, []);

//   // Check-in employee
//   const checkIn = useCallback((employeeId, deviceId, locationVerified) => {
//     const employee = employees.find(e => e.employeeId === employeeId);
//     if (!employee) return;

//     setEmployees(prev =>
//       prev.map(e =>
//         e.employeeId === employeeId
//           ? { ...e, status: 'Checked In', lastActivity: new Date() }
//           : e
//       )
//     );

//     const newRecord = {
//       id: generateId(),
//       employeeId: employee.employeeId,
//       employeeName: employee.name,
//       checkIn: new Date(),
//       locationVerified,
//       deviceId,
//     };

//     setAttendance(prev => [...prev, newRecord]);
//   }, [employees]);

//   // Check-out employee
//   const checkOut = useCallback((employeeId) => {
//     setEmployees(prev =>
//       prev.map(e =>
//         e.id === employeeId
//           ? { ...e, status: 'Checked Out', lastActivity: new Date() }
//           : e
//       )
//     );

//     setAttendance(prev =>
//       prev.map(record => {
//         if (record.employeeId === employeeId && !record.checkOut) {
//           return { ...record, checkOut: new Date() };
//         }
//         return record;
//       })
//     );
//   }, [employees]);

//   // Delete employee
//   const deleteEmployee = useCallback((id) => {
//     setEmployees(prev => prev.filter(e => e.id !== id));
//   }, []);

//   return {
//     employees,
//     attendance,
//     loading,
//     addEmployee,
//     checkIn,
//     checkOut,
//     deleteEmployee,
//   };
// };
// hooks/useEmployees.js
import { useState, useEffect, useCallback } from 'react';
import employeesAPI from '../services/api/employeesAPI';
import attendanceAPI from '../services/api/attendanceAPI';
// import { toast } from 'react-toastify'; // Optional: for user feedback

export const useEmployees = () => {
  const [employees, setEmployees] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, SennError] = useState(null);

  // Helper to set error and auto-clear after 5s
  const setError = useCallback((msg) => {
    SennError(msg);
    setTimeout(() => SennError(null), 5000);
  }, []);

  // Fetch all employees
  const fetchEmployees = useCallback(async () => {
    try {
      setLoading(true);
      const response = await employeesAPI.getAll();
      if (response.success) {
        setEmployees(response.data || []);
      } else {
        throw new Error(response.error || 'Failed to fetch employees');
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Network error';
      setError(msg);
      console.error('Error fetching employees:', err);
    } finally {
      setLoading(false);
    }
  }, [setError]);

  // Fetch attendance records (current + recent)
  const fetchAttendance = useCallback(async () => {
    try {
      const [activeRes, recentRes] = await Promise.all([
        attendanceAPI.getCurrentlyCheckedIn(),
        attendanceAPI.getTodayAttendance() // You'll implement this in API
      ]);

      let allRecords = [];

      if (activeRes.success) {
        allRecords = activeRes.data.map(record => ({
          ...record,
          status: 'Checked In',
          checkOut: null
        }));
      }

      if (recentRes?.success) {
        const checkedOutToday = recentRes.data
          .filter(r => r.check_out_time)
          .map(r => ({
            ...r,
            status: 'Checked Out',
            checkIn: r.check_in_time,
            checkOut: r.check_out_time
          }));
        allRecords = [...allRecords, ...checkedOutToday];
      }

      setAttendance(allRecords);
    } catch (err) {
      console.error('Error fetching attendance:', err);
      // Don't break UI if attendance fails
    }
  }, []);

  // Load data on mount
  useEffect(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fetchEmployees, fetchAttendance]);

  // Add new employee
  const addEmployee = useCallback(async (employeeData) => {
    try {
      setLoading(true);
      const response = await employeesAPI.create(employeeData);
      if (response.success) {
        setEmployees(prev => [...prev, response.data]);
        toast.success('Employee added successfully');
        return { success: true, data: response.data };
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const msg = err.response?.data?.error || err.message || 'Failed to add employee';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [setError]);

  // Check-in employee
  const checkIn = useCallback(async (employeeId, location_lat, location_lng, device_id) => {
    try {
      setLoading(true);
      const payload = {
        employee_email: employeeId, // assuming employeeId is email
        location_lat,
        location_lng,
        device_id
      };

      const response = await attendanceAPI.checkIn(payload);

      if (response.success) {
        // Update local state optimistically
        setEmployees(prev =>
          prev.map(emp =>
            emp.email === employeeId
              ? { ...emp, status: 'Checked In', lastActivity: new Date() }
              : emp
          )
        );
        await fetchAttendance(); // Refresh attendance list
        toast.success('Checked in successfully');
        return { success: true };
      } else {
        throw new Error(response.error);
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Check-in failed';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [fetchAttendance, setError]);

  // Check-out employee
  const checkOut = useCallback(async (employeeEmail) => {
    try {
      setLoading(true);
      const response = await attendanceAPI.checkOut({ employee_email: employeeEmail });

      if (response.success || response.affectedRows > 0) {
        setEmployees(prev =>
          prev.map(emp =>
            emp.email === employeeEmail
              ? { ...emp, status: 'Checked Out', lastActivity: new Date() }
              : emp
          )
        );
        await fetchAttendance();
        toast.success('Checked out successfully');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Check-out failed';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [fetchAttendance, setError]);

  // Delete employee
  const deleteEmployee = useCallback(async (id) => {
    try {
      setLoading(true);
      const response = await employeesAPI.delete(id);
      if (response.success) {
        setEmployees(prev => prev.filter(emp => emp.id !== id));
        toast.success('Employee deleted');
        return { success: true };
      }
    } catch (err) {
      const msg = err.response?.data?.error || 'Failed to delete employee';
      setError(msg);
      toast.error(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, [setError]);

  // Refresh both lists
  const refresh = useCallback(() => {
    fetchEmployees();
    fetchAttendance();
  }, [fetchEmployees, fetchAttendance]);

  // Update employee locally (after successful API call in modal)
  const updateEmployeeLocally = useCallback((updatedEmployee) => {
    setEmployees(prev =>
      prev.map(emp => (emp.id === updatedEmployee.id ? updatedEmployee : emp))
    );
  }, []);

  return {
    employees,
    attendance,
    loading,
    error,
    addEmployee,
    updateEmployeeLocally,
    checkIn,
    checkOut,
    deleteEmployee,
    refresh,
    fetchEmployees,
    fetchAttendance
  };
};