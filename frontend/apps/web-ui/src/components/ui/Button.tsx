import React, { forwardRef } from 'react';
import { ButtonProps } from '../../types/ui';
import { cn, createVariants } from '../../utils/cn';

// Button Variants Configuration
const buttonVariants = createVariants(
  // Base styles - using standard Tailwind classes
  'inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed min-h-[44px]',
  {
    variant: {
      primary: 'bg-blue-400 hover:bg-blue-500 active:bg-blue-600 text-white shadow-sm hover:shadow-md active:shadow-sm focus:ring-blue-400 dark:bg-blue-500 dark:hover:bg-blue-600 dark:active:bg-blue-700',
      secondary: 'bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-700 border border-slate-200 shadow-sm hover:shadow-md dark:bg-slate-700 dark:hover:bg-slate-600 dark:active:bg-slate-500 dark:text-slate-200 dark:border-slate-600',
      ghost: 'hover:bg-slate-100 active:bg-slate-200 text-slate-700 dark:hover:bg-slate-700 dark:active:bg-slate-600 dark:text-slate-200',
      destructive: 'bg-red-500 hover:bg-red-600 active:bg-red-700 text-white shadow-sm hover:shadow-md focus:ring-red-500'
    },
    size: {
      xs: 'px-3 py-2 text-xs min-h-[32px]',
      sm: 'px-3 py-2 text-sm min-h-[36px]',
      md: 'px-4 py-3 text-base min-h-[44px]',
      lg: 'px-6 py-4 text-lg min-h-[52px]',
      xl: 'px-8 py-5 text-xl min-h-[60px]'
    }
  }
);

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      loading = false,
      icon,
      iconPosition = 'left',
      fullWidth = false,
      children,
      className,
      disabled,
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || loading;

    return (
      <button
        ref={ref}
        className={cn(
          buttonVariants({ variant, size }),
          fullWidth && 'w-full',
          loading && 'cursor-wait',
          className
        )}
        disabled={isDisabled}
        {...props}
      >
        {/* Loading Spinner */}
        {loading && (
          <div className="flex items-center space-x-2">
            <svg
              className="w-4 h-4 animate-spin"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <span>Loading...</span>
          </div>
        )}
        
        {/* Left Icon */}
        {!loading && icon && iconPosition === 'left' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
        
        {/* Button Text */}
        <span className={cn(
          'flex-1',
          !fullWidth && 'flex-initial'
        )}>
          {children}
        </span>
        
        {/* Right Icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button; 