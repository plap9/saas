import React from 'react';
import { CardProps } from '../../types/ui';
import { cn, createVariants } from '../../utils/cn';

// Card Variants Configuration
const cardVariants = createVariants(
  // Base styles - using standard Tailwind classes
  'bg-white border border-slate-200 rounded-xl transition-all duration-200 dark:bg-slate-800 dark:border-slate-700',
  {
    padding: {
      xs: 'p-3',
      sm: 'p-4',
      md: 'p-6',
      lg: 'p-8',
      xl: 'p-10'
    },
    shadow: {
      none: 'shadow-none',
      sm: 'shadow-sm',
      md: 'shadow-md',
      lg: 'shadow-lg',
      xl: 'shadow-xl'
    }
  }
);

const Card: React.FC<CardProps> = ({
  children,
  className,
  hover = false,
  interactive = false,
  padding = 'md',
  shadow = 'sm',
  style,
  ...props
}) => {
  const cardClasses = cn(
    cardVariants({ padding, shadow }),
    hover && 'hover:-translate-y-1 hover:shadow-lg',
    interactive && 'cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:border-blue-200 dark:hover:border-blue-800',
    className
  );

  return (
    <div className={cardClasses} style={style} {...props}>
      {children}
    </div>
  );
};

Card.displayName = 'Card';

export default Card; 