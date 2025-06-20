import React, { forwardRef, useState } from 'react';
import { cn } from '../../utils/cn';

export interface PasswordInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  error?: string;
  showStrength?: boolean;
  strengthScore?: number;
  strengthFeedback?: string[];
}

const PasswordInput = forwardRef<HTMLInputElement, PasswordInputProps>(({
  error,
  showStrength = false,
  strengthScore = 0,
  strengthFeedback = [],
  className,
  ...inputProps
}, ref) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const getStrengthColor = (score: number) => {
    if (score <= 1) return 'bg-red-500';
    if (score <= 2) return 'bg-orange-500';
    if (score <= 3) return 'bg-yellow-500';
    if (score <= 4) return 'bg-green-500';
    return 'bg-green-600';
  };

  const getStrengthLabel = (score: number) => {
    if (score <= 1) return 'Weak';
    if (score <= 2) return 'Fair';
    if (score <= 3) return 'Good';
    if (score <= 4) return 'Strong';
    return 'Very Strong';
  };

  return (
    <div className="relative">
      <input
        ref={ref}
        type={showPassword ? 'text' : 'password'}
        className={cn(
          className,
          error && 'border-red-400 focus:ring-red-400/50 focus:border-red-400'
        )}
        {...inputProps}
      />
      
      {/* Show/Hide Password Button */}
      <button
        type="button"
        onClick={togglePasswordVisibility}
        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-white/70 hover:text-white transition-colors focus:outline-none"
        aria-label={showPassword ? 'Hide password' : 'Show password'}
      >
        {showPassword ? (
          // Eye slash icon (hide)
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
          </svg>
        ) : (
          // Eye icon (show)
          <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
          </svg>
        )}
      </button>
      
      {/* Password Strength Indicator */}
      {showStrength && inputProps.value && typeof inputProps.value === 'string' && (
        <div className="mt-2 space-y-2">
          {/* Strength Bar */}
          <div className="flex items-center space-x-2">
            <div className="flex-1 h-1 bg-white/20 rounded-full overflow-hidden">
              <div
                className={cn(
                  'h-full transition-all duration-300 rounded-full',
                  getStrengthColor(strengthScore)
                )}
                style={{ width: `${(strengthScore / 5) * 100}%` }}
              />
            </div>
            <span className={cn(
              'text-xs font-medium',
              strengthScore <= 1 && 'text-red-300',
              strengthScore === 2 && 'text-orange-300',
              strengthScore === 3 && 'text-yellow-300',
              strengthScore >= 4 && 'text-green-300'
            )}>
              {getStrengthLabel(strengthScore)}
            </span>
          </div>
          
          {/* Strength Feedback */}
          {strengthFeedback.length > 0 && (
            <div className="text-xs text-white/70">
              <p className="font-medium mb-1">Password must:</p>
              <ul className="space-y-0.5">
                {strengthFeedback.map((feedback, index) => (
                  <li key={index} className="flex items-center space-x-1">
                    <span className="w-1 h-1 bg-white/40 rounded-full"></span>
                    <span>{feedback}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
});

PasswordInput.displayName = 'PasswordInput';

export default PasswordInput; 