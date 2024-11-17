import React, { useState, useEffect } from 'react';
import { Clock, CheckCircle, XCircle } from 'lucide-react';
import { useAuthStore } from '../../store/authStore';
import { db } from '../../lib/db';
import type { Attendance } from '../../lib/db';

export function EmployeeDashboard() {
  const user = useAuthStore((state) => state.user);
  const [currentTime, setCurrentTime] = useState(new Date());
  const [todayAttendance, setTodayAttendance] = useState<Attendance | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<Attendance[]>([]);

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    if (user?.employeeId) {
      loadAttendance();
    }
  }, [user?.employeeId]);

  const loadAttendance = async () => {
    if (!user?.employeeId) return;

    const history = await db.getEmployeeAttendance(user.employeeId);
    setAttendanceHistory(history);

    const today = history.find(
      (a) => a.date === new Date().toISOString().split('T')[0]
    );
    setTodayAttendance(today || null);
  };

  const handleAttendance = async (type: 'checkIn' | 'checkOut') => {
    if (!user?.employeeId) return;

    try {
      await db.markAttendance(user.employeeId, type);
      await loadAttendance();
    } catch (error) {
      alert(error instanceof Error ? error.message : 'An error occurred');
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString();
  };

  return (
    <div className="space-y-8">
      <div className="bg-white shadow rounded-lg p-6">
        <div className="flex justify-between items-center">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Welcome back!</h2>
            <p className="text-gray-500">Today is {currentTime.toLocaleDateString()}</p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold text-indigo-600">{formatTime(currentTime)}</div>
            <div className="text-gray-500">Current Time</div>
          </div>
        </div>

        <div className="mt-8 flex justify-center space-x-4">
          <button
            onClick={() => handleAttendance('checkIn')}
            disabled={!!todayAttendance}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md ${
              todayAttendance
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            <CheckCircle className="h-5 w-5" />
            <span>Check In</span>
          </button>
          <button
            onClick={() => handleAttendance('checkOut')}
            disabled={!todayAttendance || !!todayAttendance?.checkOut}
            className={`flex items-center space-x-2 px-6 py-3 rounded-md ${
              !todayAttendance || !!todayAttendance?.checkOut
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                : 'bg-red-600 text-white hover:bg-red-700'
            }`}
          >
            <XCircle className="h-5 w-5" />
            <span>Check Out</span>
          </button>
        </div>
      </div>

      <div className="bg-white shadow rounded-lg p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Attendance History</h3>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check In
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Check Out
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Duration
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {attendanceHistory.map((record) => (
                <tr key={record.id}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {record.date}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(record.checkIn).toLocaleTimeString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkOut
                      ? new Date(record.checkOut).toLocaleTimeString()
                      : '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {record.checkOut
                      ? `${Math.round(
                          (new Date(record.checkOut).getTime() -
                            new Date(record.checkIn).getTime()) /
                            (1000 * 60 * 60)
                        )} hours`
                      : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}