import React, { forwardRef } from 'react';
import { ButtonProps } from '../../types/ui';
import { cn, createVariants } from '../../utils/cn';

// Button Variants Configuration
const buttonVariants = createVariants(
  // Base styles - using design system classes
  'btn',
  {
    variant: {
      primary: 'btn-primary',
      secondary: 'btn-secondary',
      ghost: 'btn-ghost',
      destructive: 'bg-error-500 hover:bg-error-600 active:bg-error-700 text-white shadow-md hover:shadow-error focus:ring-error-500'
    },
    size: {
      xs: 'btn-sm text-xs min-h-[32px] px-3 py-2',
      sm: 'btn-sm',
      md: 'text-base min-h-[44px] px-4 py-3',
      lg: 'btn-lg',
      xl: 'btn-xl'
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
          loading && 'cursor-wait opacity-75',
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
          <span className="flex-shrink-0 mr-2">
            {icon}
          </span>
        )}
        
        {/* Button Text */}
        {!loading && (
          <span className={cn(
            'flex items-center',
            fullWidth && 'justify-center'
          )}>
            {children}
          </span>
        )}
        
        {/* Right Icon */}
        {!loading && icon && iconPosition === 'right' && (
          <span className="flex-shrink-0 ml-2">
            {icon}
          </span>
        )}
      </button>
    );
  }
);

Button.displayName = 'Button';

export default Button;