/**
 * Simple className utility function
 * Combines multiple class values and filters out falsy values
 */
export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ');
}

/**
 * Conditional className utility
 */
export function cx(condition: boolean, trueClass: string, falseClass = '') {
  return condition ? trueClass : falseClass;
}

/**
 * Utility to create variant-based className function
 * Useful for component variants
 */
export function createVariants<T extends Record<string, Record<string, string>>>(
  base: string,
  variants: T
) {
  return (variantProps: {
    [K in keyof T]?: keyof T[K];
  }) => {
    const variantClasses = Object.entries(variantProps)
      .map(([key, value]) => {
        const variantGroup = variants[key];
        return variantGroup && value ? variantGroup[value as string] : '';
      })
      .filter(Boolean);

    return cn(base, ...variantClasses);
  };
}

/**
 * Focus ring utility with customizable color
 */
export function focusRing(color = 'primary-500') {
  return `focus:outline-none focus:ring-2 focus:ring-${color} focus:ring-offset-2 dark:focus:ring-offset-background`;
}

/**
 * Transition utility for consistent animations
 */
export function transition(
  duration: 'fast' | 'normal' | 'slow' = 'normal',
  easing: 'linear' | 'ease-out' | 'ease-in-out' = 'ease-out'
) {
  const durations = {
    fast: 'duration-150',
    normal: 'duration-200', 
    slow: 'duration-300'
  };

  const easings = {
    linear: 'ease-linear',
    'ease-out': 'ease-out',
    'ease-in-out': 'ease-in-out'
  };

  return `transition-all ${durations[duration]} ${easings[easing]}`;
}

/**
 * Responsive text size utility
 */
export function responsiveText(
  mobile: string,
  tablet?: string,
  desktop?: string
) {
  const classes = [mobile];
  
  if (tablet) classes.push(`md:${tablet}`);
  if (desktop) classes.push(`lg:${desktop}`);
  
  return classes.join(' ');
}

/**
 * Safe area padding for mobile devices
 */
export function safeArea(top = false, bottom = false) {
  const classes = [];
  
  if (top) classes.push('safe-area-top');
  if (bottom) classes.push('safe-area-bottom');
  
  return classes.join(' ');
} 