import React, { forwardRef } from 'react';
import { cn } from '../../utils/cn';

export interface CheckboxProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'size'> {
  label?: string;
  description?: string;
  error?: string;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'success' | 'error';
}

const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(({
  label,
  description,
  error,
  size = 'md',
  variant = 'default',
  className,
  disabled,
  ...props
}, ref) => {
  const checkboxId = props.id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  };

  const variantClasses = {
    default: 'border-slate-300 text-blue-500 focus:ring-blue-400',
    success: 'border-green-300 text-green-500 focus:ring-green-400',
    error: 'border-red-300 text-red-500 focus:ring-red-400',
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
  };

  return (
    <div className={cn('flex items-start space-x-3', className)}>
      <div className="flex items-center h-5">
        <input
          ref={ref}
          id={checkboxId}
          type="checkbox"
          disabled={disabled}
          className={cn(
            // Base styles
            'rounded border-2 bg-white transition-colors duration-200',
            'focus:ring-2 focus:ring-offset-2 focus:outline-none',
            'disabled:opacity-50 disabled:cursor-not-allowed',
            // Size
            sizeClasses[size],
            // Variant colors
            error ? variantClasses.error : variantClasses[variant],
            // Dark mode
            'dark:bg-slate-800 dark:border-slate-600',
            // Hover state
            'hover:border-slate-400 dark:hover:border-slate-500',
          )}
          {...props}
        />
      </div>
      
      {(label || description) && (
        <div className="flex flex-col">
          {label && (
            <label
              htmlFor={checkboxId}
              className={cn(
                'font-medium text-slate-900 dark:text-slate-100 cursor-pointer transition-colors',
                textSizeClasses[size],
                disabled && 'opacity-50 cursor-not-allowed',
                error && 'text-red-700 dark:text-red-400'
              )}
            >
              {label}
            </label>
          )}
          
          {description && (
            <p className={cn(
              'text-slate-600 dark:text-slate-400 mt-1',
              size === 'sm' ? 'text-xs' : 'text-sm',
              disabled && 'opacity-50'
            )}>
              {description}
            </p>
          )}
          
          {error && (
            <p className="text-red-600 dark:text-red-400 text-sm mt-1 flex items-center">
              <svg className="w-4 h-4 mr-1 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </p>
          )}
        </div>
      )}
    </div>
  );
});

Checkbox.displayName = 'Checkbox';

export default Checkbox; 