import React from 'react';
import { ContainerProps } from '../../types/ui';
import { cn, createVariants } from '../../utils/cn';

// Container Variants Configuration
const containerVariants = createVariants(
  // Base styles
  'mx-auto',
  {
    size: {
      sm: 'max-w-2xl',
      md: 'max-w-4xl', 
      lg: 'max-w-6xl',
      xl: 'max-w-7xl',
      '2xl': 'max-w-screen-2xl',
      full: 'max-w-full'
    }
  }
);

const Container: React.FC<ContainerProps> = ({
  children,
  size = 'xl',
  padding = true,
  className,
  ...props
}) => {
  return (
    <div
      className={cn(
        containerVariants({ size }),
        padding && 'px-6 sm:px-8',
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
};

Container.displayName = 'Container';

export default Container; 