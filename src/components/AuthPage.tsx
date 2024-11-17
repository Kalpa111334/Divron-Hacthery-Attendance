import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, UserPlus, Users } from 'lucide-react';
import { useAuthStore } from '../store/authStore';
import { db } from '../lib/db';

type AuthMode = 'employeeLogin' | 'adminLogin' | 'register';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('employeeLogin');
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    name: '',
    email: '',
    position: '',
    department: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const login = useAuthStore((state) => state.login);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      if (mode === 'register') {
        const employee = await db.registerEmployee({
          username: formData.username,
          password: formData.password,
          name: formData.name,
          email: formData.email,
          position: formData.position,
          department: formData.department
        });
        setSuccess('Registration successful! Please login to continue.');
        setMode('employeeLogin');
        setFormData({ ...formData, username: '', password: '' });
      } else {
        const success = await login(formData.username, formData.password, mode === 'adminLogin');
        if (success) {
          navigate('/');
        } else {
          setError('Invalid credentials');
        }
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <div className="mx-auto h-12 w-12 text-indigo-600">
            {mode === 'register' ? (
              <UserPlus className="h-12 w-12" />
            ) : (
              <Lock className="h-12 w-12" />
            )}
          </div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {mode === 'register'
              ? 'Register as Employee'
              : mode === 'adminLogin'
              ? 'Admin Login'
              : 'Employee Login'}
          </h2>
        </div>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            {error}
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            {success}
          </div>
        )}

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="rounded-md shadow-sm space-y-3">
            <div>
              <input
                type="text"
                required
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Username"
              />
            </div>
            <div>
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                placeholder="Password"
              />
            </div>

            {mode === 'register' && (
              <>
                <div>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Full Name"
                  />
                </div>
                <div>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Email"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={formData.position}
                    onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Position"
                  />
                </div>
                <div>
                  <input
                    type="text"
                    required
                    value={formData.department}
                    onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
                    placeholder="Department"
                  />
                </div>
              </>
            )}
          </div>

          <div>
            <button
              type="submit"
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {mode === 'register' ? 'Register' : 'Sign in'}
            </button>
          </div>
        </form>

        <div className="flex justify-center space-x-4">
          <button
            onClick={() => setMode('employeeLogin')}
            className={`text-sm ${
              mode === 'employeeLogin' ? 'text-indigo-600 font-semibold' : 'text-gray-500'
            }`}
          >
            Employee Login
          </button>
          <button
            onClick={() => setMode('adminLogin')}
            className={`text-sm ${
              mode === 'adminLogin' ? 'text-indigo-600 font-semibold' : 'text-gray-500'
            }`}
          >
            Admin Login
          </button>
          <button
            onClick={() => setMode('register')}
            className={`text-sm ${
              mode === 'register' ? 'text-indigo-600 font-semibold' : 'text-gray-500'
            }`}
          >
            Register
          </button>
        </div>
      </div>
    </div>
  );
}