import React, { useState, useEffect } from 'react';
import { Users, UserPlus, Download } from 'lucide-react';
import { db } from '../../lib/db';
import { EmployeeList } from './EmployeeList';
import { AttendanceReport } from './AttendanceReport';
import { AddEmployeeModal } from './AddEmployeeModal';

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'employees' | 'attendance'>('employees');
  const [showAddModal, setShowAddModal] = useState(false);
  const [employees, setEmployees] = useState<any[]>([]);

  useEffect(() => {
    loadEmployees();
  }, []);

  const loadEmployees = async () => {
    const data = await db.getEmployees();
    setEmployees(data);
  };

  const handleRemoveEmployee = async (id: number) => {
    await db.removeEmployee(id);
    await loadEmployees();
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          <UserPlus className="h-5 w-5" />
          <span>Add Employee</span>
        </button>
      </div>

      <div className="bg-white shadow rounded-lg">
        <div className="border-b border-gray-200">
          <nav className="flex -mb-px">
            <button
              onClick={() => setActiveTab('employees')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'employees'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Users className="h-5 w-5" />
                <span>Employees</span>
              </div>
            </button>
            <button
              onClick={() => setActiveTab('attendance')}
              className={`py-4 px-6 text-sm font-medium ${
                activeTab === 'attendance'
                  ? 'border-b-2 border-indigo-500 text-indigo-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <div className="flex items-center space-x-2">
                <Download className="h-5 w-5" />
                <span>Attendance Reports</span>
              </div>
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'employees' ? (
            <EmployeeList employees={employees} onRemove={handleRemoveEmployee} />
          ) : (
            <AttendanceReport employees={employees} />
          )}
        </div>
      </div>

      {showAddModal && (
        <AddEmployeeModal
          onClose={() => setShowAddModal(false)}
          onEmployeeAdded={loadEmployees}
        />
      )}
    </div>
  );
}