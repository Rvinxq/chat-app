import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { auth, db } from '../../utils/firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // Reload user to get latest emailVerified status
        await user.reload();
        
        if (user.emailVerified) {
          // Update user document
          await updateDoc(doc(db, 'users', user.uid), {
            emailVerified: true
          });
          
          setVerificationStatus('verified');
          setTimeout(() => navigate('/'), 2000);
        } else {
          setVerificationStatus('pending');
        }
      } else {
        setVerificationStatus('error');
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8 text-center">
          {verificationStatus === 'checking' && (
            <p className="text-white">Checking verification status...</p>
          )}
          
          {verificationStatus === 'verified' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">Email Verified!</h2>
              <p className="text-blue-100">
                Your email has been verified successfully. Redirecting to chat...
              </p>
            </>
          )}
          
          {verificationStatus === 'pending' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">Verification Pending</h2>
              <p className="text-blue-100">
                Please check your email and click the verification link.
              </p>
            </>
          )}
          
          {verificationStatus === 'error' && (
            <>
              <h2 className="text-2xl font-bold text-white mb-4">Verification Failed</h2>
              <p className="text-blue-100">
                There was an error verifying your email. Please try signing up again.
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 