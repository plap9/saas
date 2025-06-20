import React from 'react';
import { Link } from 'react-router-dom';
import { Card } from '../../components/ui';

const ForgotPasswordPage: React.FC = () => {
  return (
    <div className="max-w-md mx-auto">
      <Card className="glass bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl border border-white/20 dark:border-slate-700/50 shadow-xl">
        <div className="text-center space-y-6">
          <div>
            <h1 className="font-display font-bold text-3xl text-slate-900 dark:text-slate-100">
              Reset Password
            </h1>
            <p className="text-slate-600 dark:text-slate-400 mt-2">
              Enter your email address and we'll send you a reset link
            </p>
          </div>
          
          {/* Password Reset Form will be implemented here */}
          <div className="p-8 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <p className="text-orange-700 dark:text-orange-300 font-medium">
              🚧 Password Reset Form Coming Soon
            </p>
            <p className="text-orange-600 dark:text-orange-400 text-sm mt-2">
              Email validation and reset link functionality...
            </p>
          </div>
          
          <div className="text-center">
            <p className="text-slate-600 dark:text-slate-400">
              Remember your password?{' '}
              <Link 
                to="/auth/login" 
                className="text-blue-600 hover:text-blue-700 dark:text-blue-400 dark:hover:text-blue-300 font-medium transition-colors"
              >
                Back to sign in
              </Link>
            </p>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default ForgotPasswordPage; 