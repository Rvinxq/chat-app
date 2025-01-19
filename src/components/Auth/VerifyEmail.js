import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { auth, db } from '../../utils/firebase';
import { onAuthStateChanged, sendEmailVerification } from 'firebase/auth';
import { doc, updateDoc } from 'firebase/firestore';

const VerifyEmail = () => {
  const [verificationStatus, setVerificationStatus] = useState('checking');
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        await user.reload();
        if (user.emailVerified) {
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

  const renderContent = () => {
    const statusConfig = {
      checking: {
        icon: (
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-200" />
        ),
        title: "Checking verification status...",
        message: "Please wait while we verify your email status."
      },
      verified: {
        icon: (
          <svg className="w-16 h-16 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: "Email Verified Successfully!",
        message: "Your email has been verified. Redirecting to chat..."
      },
      pending: {
        icon: (
          <svg className="w-16 h-16 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: "Verification Pending",
        message: "Please check your email and click the verification link to continue."
      },
      error: {
        icon: (
          <svg className="w-16 h-16 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        ),
        title: "Verification Failed",
        message: "There was an error verifying your email. Please try again."
      }
    };

    const status = statusConfig[verificationStatus];

    return (
      <div className="space-y-6 text-center">
        <div className="flex justify-center">
          {status.icon}
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">{status.title}</h2>
          <p className="text-blue-100">{status.message}</p>
        </div>
        {verificationStatus === 'pending' && (
          <div className="space-y-4 pt-4">
            <button 
              onClick={() => auth.currentUser && sendEmailVerification(auth.currentUser)}
              className="px-6 py-2.5 bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 rounded-xl transition-all duration-200 border border-blue-400/30"
            >
              Resend Verification Email
            </button>
            <div className="pt-2">
              <Link 
                to="/login" 
                className="text-sm text-blue-200/80 hover:text-blue-200 underline"
              >
                Back to Login
              </Link>
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-600 via-blue-700 to-purple-800">
      <div className="max-w-md w-full mx-4">
        <div className="bg-white/10 backdrop-blur-lg rounded-3xl shadow-2xl p-8">
          {renderContent()}
        </div>
      </div>
    </div>
  );
};

export default VerifyEmail; 