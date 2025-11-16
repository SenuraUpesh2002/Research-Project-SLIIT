import { useState } from 'react';
import { StationQRCode } from './StationQRCode';
import { EmployeeTable } from './EmployeeTable';
import { CheckInModal } from './CheckInModal';
import { AddEmployeeModal } from './AddEmployeeModal';
import { AttendanceLog } from './AttendanceLog';
import { EmployeeAnalytics } from './EmployeeAnalytics';
import { useEmployees } from '../../hooks/useEmployees';

export const EmployeePanel = () => {
  const { employees, attendance, addEmployee, checkIn, checkOut, deleteEmployee } = useEmployees();

  const [showCheckInModal, setShowCheckInModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

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
        onAdd={addEmployee}
      />
    </div>
  );
};