import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Users, Calendar, ClipboardList, LogOut } from 'lucide-react';
import { useAuthStore } from '../store/authStore';

export function Layout({ children }: { children: React.ReactNode }) {
  const { logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login'); // Redirect to login page after logout
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Brand */}
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <Users className="h-8 w-8" />
                <span className="font-bold text-xl">AttendanceTracker</span>
              </Link>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center space-x-4">
              <Link to="/employees" className="flex items-center space-x-1 hover:text-indigo-200">
                <Users className="h-5 w-5" />
                <span>Employees</span>
              </Link>
              <Link to="/attendance" className="flex items-center space-x-1 hover:text-indigo-200">
                <Calendar className="h-5 w-5" />
                <span>Attendance</span>
              </Link>
              <Link to="/reports" className="flex items-center space-x-1 hover:text-indigo-200">
                <ClipboardList className="h-5 w-5" />
                <span>Reports</span>
              </Link>
              {/* Logout Button */}
              <button
                onClick={handleLogout}
                className="flex items-center space-x-1 hover:text-indigo-200"
              >
                <LogOut className="h-5 w-5" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
}
