import React, { forwardRef } from 'react';
import { InputProps } from '../../types/ui';
import { cn, createVariants } from '../../utils/cn';

// Input Variants Configuration
const inputVariants = createVariants(
  // Base styles - using design system classes
  'input',
  {
    size: {
      xs: 'px-3 py-2 text-xs min-h-[32px]',
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-base min-h-[44px]',
      lg: 'px-5 py-4 text-lg min-h-[52px]',
      xl: 'px-6 py-5 text-xl min-h-[60px]'
    },
    state: {
      default: 'border-neutral-200 focus:border-primary-400 dark:border-neutral-600',
      error: 'border-error-500 focus:border-error-500',
      success: 'border-success-500 focus:border-success-500'
    }
  }
);

const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      size = 'md',
      error = false,
      success = false,
      helperText,
      leftIcon,
      rightIcon,
      label,
      className,
      ...props
    },
    ref
  ) => {
    const state = error ? 'error' : success ? 'success' : 'default';

    return (
      <div className="space-y-2">
        {/* Label */}
        {label && (
          <label 
            htmlFor={props.id}
            className="block text-sm font-medium text-neutral-700 dark:text-neutral-300"
          >
            {label}
            {props.required && (
              <span className="text-error-500 ml-1">*</span>
            )}
          </label>
        )}

        {/* Input Container */}
        <div className="input-group">
          {/* Left Icon */}
          {leftIcon && (
            <div className="input-icon">
              {leftIcon}
            </div>
          )}

          {/* Input Field */}
          <input
            ref={ref}
            className={cn(
              inputVariants({ size, state }),
              leftIcon ? 'input-with-icon' : '',
              rightIcon ? 'pr-10' : '',
              className
            )}
            {...props}
          />

          {/* Right Icon */}
          {rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-neutral-500 pointer-events-none">
              {rightIcon}
            </div>
          )}

          {/* State Indicator Icons */}
          {error && !rightIcon && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-error-500 pointer-events-none">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" 
                />
              </svg>
            </div>
          )}

          {success && !rightIcon && !error && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2 text-success-500 pointer-events-none">
              <svg 
                className="w-5 h-5" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M5 13l4 4L19 7" 
                />
              </svg>
            </div>
          )}
        </div>

        {/* Helper Text */}
        {helperText && (
          <p className={cn(
            'text-xs',
            error ? 'text-error-500' : success ? 'text-success-500' : 'text-neutral-500 dark:text-neutral-400'
          )}>
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = 'Input';

export default Input;