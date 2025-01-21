import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { auth, db } from '../../utils/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { toast } from 'react-hot-toast';
import DOMPurify from 'dompurify';
import { hash, compare } from 'bcryptjs';

// Obfuscate sensitive data
const _0x1a2b = {
  e: atob(process.env.REACT_APP_ADMIN_EMAIL),
  h: process.env.REACT_APP_ADMIN_PASSWORD_HASH,
  k: process.env.REACT_APP_SECURITY_KEY
};

// Prevent console access
const disableDevTools = () => {
  document.addEventListener('contextmenu', (e) => e.preventDefault());
  document.addEventListener('keydown', (e) => {
    if (
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J' || e.key === 'C')) ||
      (e.key === 'F12')
    ) {
      e.preventDefault();
    }
  });
  
  // Disable right-click
  window.addEventListener('contextmenu', (e) => e.preventDefault());
  
  // Clear console
  console.clear();
  
  // Override console methods
  const noop = () => undefined;
  if (!process.env.NODE_ENV || process.env.NODE_ENV === 'production') {
    console.log = noop;
    console.info = noop;
    console.warn = noop;
    console.error = noop;
  }
};

const AdminPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);
  const [isBlocked, setIsBlocked] = useState(false);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    disableDevTools();
    
    // Additional security measures
    if (window.outerHeight - window.innerHeight > 200 || window.outerWidth - window.innerWidth > 200) {
      navigate('/');
    }

    const detectDevTools = () => {
      const widthThreshold = window.outerWidth - window.innerWidth > 160;
      const heightThreshold = window.outerHeight - window.innerHeight > 160;
      if (widthThreshold || heightThreshold) {
        navigate('/');
      }
    };

    window.addEventListener('resize', detectDevTools);
    return () => window.removeEventListener('resize', detectDevTools);
  }, [navigate]);

  useEffect(() => {
    // Check if user is blocked
    const blockedUntil = localStorage.getItem('adminBlockedUntil');
    if (blockedUntil && new Date(blockedUntil) > new Date()) {
      setIsBlocked(true);
    }

    // Security headers
    document.getElementsByTagName('meta')[0].content = 
      "default-src 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline';";
  }, []);

  const sanitizeInput = (input) => {
    // Sanitize input to prevent XSS
    return DOMPurify.sanitize(input.trim());
  };

  const validateEmail = (email) => {
    // Strict email validation
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return emailRegex.test(email);
  };

  const handleLoginAttempt = () => {
    const now = new Date();
    setLoginAttempts(prev => prev + 1);
    setLastAttemptTime(now);

    if (loginAttempts >= 4) { // Block after 5 attempts
      const blockedUntil = new Date(now.getTime() + 30 * 60000); // 30 minutes
      localStorage.setItem('adminBlockedUntil', blockedUntil.toISOString());
      setIsBlocked(true);
      toast.error('Too many attempts. Please try again in 30 minutes.');
    }
  };

  const handleAdminAuth = async (e) => {
    e.preventDefault();

    if (isBlocked) {
      toast.error('Account is temporarily blocked. Please try again later.');
      return;
    }

    // Input validation
    const sanitizedEmail = sanitizeInput(email);
    const sanitizedPassword = sanitizeInput(password);

    if (!validateEmail(sanitizedEmail)) {
      toast.error('Invalid email format');
      handleLoginAttempt();
      return;
    }

    try {
      // Rate limiting
      if (lastAttemptTime && new Date() - lastAttemptTime < 2000) {
        toast.error('Please wait before trying again');
        return;
      }

      const verifyCredentials = async () => {
        const key = _0x1a2b.k;
        const email = _0x1a2b.e;
        return sanitizedEmail === email && await compare(sanitizedPassword, _0x1a2b.h);
      };

      if (await verifyCredentials()) {
        // Log successful login attempt
        console.log('Admin login successful:', new Date().toISOString());
        
        setIsAuthenticated(true);
        setLoginAttempts(0);
        localStorage.removeItem('adminBlockedUntil');
        
        // Set secure session
        sessionStorage.setItem('adminAuth', Date.now());
        
        toast.success('Admin access granted');
      } else {
        handleLoginAttempt();
        toast.error('Invalid credentials');
      }
    } catch (error) {
      console.error('Auth error:', error);
      toast.error('Authentication failed');
      handleLoginAttempt();
    }
  };

  // Auto logout after inactivity
  useEffect(() => {
    if (isAuthenticated) {
      const inactivityTimeout = setTimeout(() => {
        setIsAuthenticated(false);
        sessionStorage.removeItem('adminAuth');
        navigate('/');
        toast.info('Logged out due to inactivity');
      }, 30 * 60 * 1000); // 30 minutes

      return () => clearTimeout(inactivityTimeout);
    }
  }, [isAuthenticated, navigate]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
        <div className="max-w-md w-full mx-4">
          <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
            <h2 className="text-2xl font-bold text-white mb-6">Admin Authentication</h2>
            <form onSubmit={handleAdminAuth} className="space-y-4" autoComplete="off">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter admin email"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                autoComplete="off"
                spellCheck="false"
                required
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter admin password"
                className="w-full px-4 py-2 rounded-lg bg-white/20 border border-white/30 text-white placeholder-white/70"
                autoComplete="new-password"
                required
              />
              <button
                type="submit"
                disabled={isBlocked}
                className="w-full py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isBlocked ? 'Temporarily Blocked' : 'Access Admin Panel'}
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

// Prevent component from being modified
Object.freeze(AdminPage);
export default AdminPage; 