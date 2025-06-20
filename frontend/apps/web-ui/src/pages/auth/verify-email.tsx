import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';

const VerifyEmailPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      <Card className="glass bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="text-center space-y-6">
          <div>
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600 dark:text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.95a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
            </div>
            
            <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-slate-100">
              Verify Your Email
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              We've sent a verification link to your email address
            </p>
          </div>
          
          {/* Email Verification Status will be implemented here */}
          <div className="p-8 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <p className="text-purple-700 dark:text-purple-300 font-medium">
              🚧 Email Verification Coming Soon
            </p>
            <p className="text-purple-600 dark:text-purple-400 text-sm mt-2">
              Countdown timer and resend functionality...
            </p>
          </div>
          
          <div className="space-y-4">
            <div className="text-center">
              <p className="text-slate-600 dark:text-slate-400 text-sm">
                Didn't receive the email? Check your spam folder or{' '}
                <button className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors">
                  resend verification
                </button>
              </p>
            </div>
            
            <div className="text-center">
              <Link 
                to="/auth/login" 
                className="text-slate-600 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-300 font-medium transition-colors"
              >
                Back to sign in
              </Link>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default VerifyEmailPage; 