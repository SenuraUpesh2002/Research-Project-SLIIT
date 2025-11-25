import { useState } from 'react';
import { StationQRCode } from './StationQRCode';
import { EmployeeTable } from './EmployeeTable';
import { CheckInModal } from './CheckInModal';
import { AddEmployeeModal } from './AddEmployeeModal';
import { EditEmployeeModal } from './EditEmployeeModal';
import { AttendanceLog } from './AttendanceLog';
import { EmployeeAnalytics } from './EmployeeAnalytics';
import { useEmployees } from '../../hooks/useEmployees';

export const EmployeePanel = () => {
  const {
    employees,
    attendance,
    addEmployee,
    updateEmployeeLocally,
    checkIn,
    checkOut,
    deleteEmployee,
    fetchEmployees
  } = useEmployees();

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState(null);

  const handleEditClick = (employee) => {
    setSelectedEmployee(employee);
    setShowEditModal(true);
  };

  const handleEmployeeUpdated = (updatedEmployee) => {
    updateEmployeeLocally(updatedEmployee);
    setShowEditModal(false);
    setSelectedEmployee(null);
  };

  const handleEmployeeAdded = (newEmployee) => {
    // Since AddEmployeeModal calls API directly, we just need to refresh or add locally
    // fetchEmployees(); // Safest option
    // OR if we want to use the data returned:
    // But useEmployees doesn't have addEmployeeLocally exposed yet, so let's just fetch
    fetchEmployees();
  };

  return (
    <div className="space-y-6">
      {/* Analytics Overview */}
      <EmployeeAnalytics employees={employees} />

      {/* QR + Table Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: QR Code + Check-In */}
        <div className="lg:col-span-1 space-y-4">
          <StationQRCode />
          <button
            onClick={() => setShowCheckInModal(true)}
            className="w-full bg-green-600 hover:bg-green-700 text-white px-4 py-3 rounded-lg transition-colors font-medium flex items-center justify-center gap-2"
          >
            Simulate Employee Check-In
          </button>
        </div>

        {/* Right: Employee Table */}
        <div className="lg:col-span-2">
          <EmployeeTable
            employees={employees}
            onDelete={deleteEmployee}
            onCheckOut={checkOut}
            onAddClick={() => setShowAddModal(true)}
            onEditClick={handleEditClick}
          />
        </div>
      </div>

      {/* Attendance Log */}
      <AttendanceLog records={attendance} />

      {/* Modals */}
      <CheckInModal
        isOpen={showCheckInModal}
        onClose={() => setShowCheckInModal(false)}
        onCheckIn={checkIn}
      />

      <AddEmployeeModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdded={handleEmployeeAdded}
      />

      <EditEmployeeModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false);
          setSelectedEmployee(null);
        }}
        onUpdated={handleEmployeeUpdated}
        employee={selectedEmployee}
      />
    </div>
  );
};