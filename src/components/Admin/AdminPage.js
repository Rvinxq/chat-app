import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { auth } from '../../utils/firebase';
import { toast } from 'react-hot-toast';

const ADMIN_EMAIL = 'SwarnabhaX@gmail.com';
const ADMIN_PASSWORD = 'Swarnabhasima123';

const AdminPage = () => {
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (auth.currentUser?.email !== ADMIN_EMAIL) {
    return <Navigate to="/" replace />;
  }

  const handleAdminAuth = (e) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setIsAuthenticated(true);
      toast.success('Admin access granted');
    } else {
      toast.error('Invalid admin password');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Authentication</h2>
            <form onSubmit={handleAdminAuth} className="space-y-4">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
              />
              <button
                type="submit"
                className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200"
              >
                Access Admin Panel
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Admin Dashboard</h1>
        {/* Add your admin features here */}
      </div>
    </div>
  );
};

export default AdminPage; 