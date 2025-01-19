import React, { useState, useEffect } from 'react';
import { auth, db } from '../../utils/firebase';
import { signOut } from 'firebase/auth';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import Logo from './Logo';
import ThemeToggle from '../Theme/ThemeToggle';

const Header = ({ currentUser }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState('');
  const [currentUsername, setCurrentUsername] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchUsername = async () => {
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, 'users', currentUser.uid));
          const userData = userDoc.data();
          setCurrentUsername(userData?.username || '');
        } catch (err) {
          console.error('Error fetching username:', err);
          setError('Failed to fetch username');
        }
      }
    };
    fetchUsername();
  }, [currentUser]);

  const handleLogout = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error('Error signing out:', error);
      setError('Failed to logout');
    }
  };

  const handleUpdateUsername = async () => {
    if (!username.trim()) return;
    setError('');
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const userDoc = await getDoc(userRef);
      const userData = userDoc.data() || {};

      await setDoc(userRef, {
        ...userData,
        username: username.trim()
      }, { merge: true });

      setCurrentUsername(username);
      setIsEditing(false);
      setUsername('');
      console.log('Username updated successfully');
    } catch (error) {
      console.error('Error updating username:', error);
      setError('Failed to update username: ' + error.message);
    }
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-14 sm:h-16">
      <header className="h-full bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800">
        <div className="h-full px-2 sm:px-4 flex items-center justify-between max-w-7xl mx-auto">
          <div className="fixed left-2 sm:left-4">
            <Logo size="small" className="transform scale-75 sm:scale-90" />
          </div>

          <div className="fixed right-2 sm:right-4 flex items-center gap-2 sm:gap-4">
            <div className="block">
              <ThemeToggle />
            </div>

            <div className="flex items-center gap-2">
              {isEditing ? (
                <form 
                  onSubmit={handleUpdateUsername}
                  className="flex items-center gap-1"
                >
                  <input
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-16 sm:w-24 px-1 sm:px-1.5 py-0.5 sm:py-1 text-xs border rounded bg-white dark:bg-gray-800 dark:border-gray-700"
                    placeholder="Username"
                    maxLength={20}
                  />
                  <button
                    type="submit"
                    className="text-[10px] sm:text-xs bg-blue-600 text-white px-1.5 sm:px-2 py-0.5 sm:py-1 rounded hover:bg-blue-700"
                  >
                    Save
                  </button>
                </form>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2">
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300 max-w-[80px] sm:max-w-[150px] truncate">
                    {currentUsername || 'Loading...'}
                  </span>
                  <button
                    onClick={() => setIsEditing(true)}
                    className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <svg className="w-3 h-3 sm:w-4 sm:h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                    </svg>
                  </button>
                </div>
              )}

              <button
                onClick={handleLogout}
                className="p-1 sm:p-1.5 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800"
              >
                <svg className="w-3.5 h-3.5 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
              </button>
            </div>
          </div>
        </div>

        {error && (
          <div className="absolute top-full left-1/2 transform -translate-x-1/2 bg-red-500/90 backdrop-blur-sm text-white px-2 py-0.5 rounded-b text-[10px] sm:text-sm">
            {error}
          </div>
        )}
      </header>
    </div>
  );
};

export default Header; 