import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes, CSSProperties } from 'react';

// Base Types
export type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
export type Variant = 'primary' | 'secondary' | 'ghost' | 'destructive';
export type Color = 'primary' | 'secondary' | 'success' | 'error' | 'warning';

// Button Types
export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
  loading?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  fullWidth?: boolean;
  children: ReactNode;
}

// Input Types
export interface InputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'size'> {
  size?: Size;
  error?: boolean;
  success?: boolean;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
  label?: string;
}

// Card Types
export interface CardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  interactive?: boolean;
  padding?: Size;
  shadow?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  style?: CSSProperties;
}

// Modal Types
export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl';
  closeOnOverlayClick?: boolean;
  className?: string;
}

// Container Types
export interface ContainerProps {
  children: ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';
  padding?: boolean;
  className?: string;
}

// Icon Types
export interface IconProps {
  name: string;
  size?: Size;
  color?: Color | string;
  className?: string;
  strokeWidth?: number;
}

// Form Field Types
export interface FormFieldProps {
  children: ReactNode;
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  className?: string;
}

// Badge Types
export interface BadgeProps {
  children: ReactNode;
  variant?: Color;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

// Loading Types
export interface LoadingProps {
  size?: Size;
  color?: Color;
  text?: string;
  className?: string;
}

export interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  className?: string;
  rounded?: boolean;
}

// Navigation Types
export interface NavigationItem {
  label: string;
  href: string;
  icon?: ReactNode;
  active?: boolean;
  external?: boolean;
}

export interface NavigationProps {
  items: NavigationItem[];
  className?: string;
}

// Theme Types
export type Theme = 'light' | 'dark' | 'system';

export interface ThemeContextType {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  systemTheme: 'light' | 'dark';
}

// Animation Types
export type AnimationType = 
  | 'fade-in'
  | 'fade-in-up'
  | 'slide-up'
  | 'slide-down'
  | 'scale-in'
  | 'bounce-subtle'
  | 'float'
  | 'glow';

export interface AnimationProps {
  type?: AnimationType;
  duration?: number;
  delay?: number;
  className?: string;
}

// Layout Types
export interface HeaderProps {
  className?: string;
  sticky?: boolean;
  transparent?: boolean;
  children?: ReactNode;
}

export interface SectionProps {
  children: ReactNode;
  className?: string;
  padding?: boolean;
  background?: 'transparent' | 'muted' | 'primary';
}

// Form Types
export interface FormProps {
  children: ReactNode;
  onSubmit: (data: any) => void;
  className?: string;
  validation?: any;
}

// Responsive Types
export type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl' | '2xl';

export interface ResponsiveValue<T> {
  base?: T;
  xs?: T;
  sm?: T;
  md?: T;
  lg?: T;
  xl?: T;
  '2xl'?: T;
}

// Status Types
export type Status = 'online' | 'offline' | 'error' | 'loading';

export interface StatusIndicatorProps {
  status: Status;
  size?: Size;
  className?: string;
  label?: string;
}

// Toast/Notification Types
export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose?: () => void;
  action?: {
    label: string;
    onClick: () => void;
  };
}

// Progress Types
export interface ProgressProps {
  value: number;
  max?: number;
  size?: Size;
  color?: Color;
  showPercentage?: boolean;
  className?: string;
}

// Utility Types
export type WithRequired<T, K extends keyof T> = T & { [P in K]-?: T[P] };
export type OptionalExcept<T, K extends keyof T> = Partial<T> & Pick<T, K>;

// Component Ref Types
export type ComponentRef<T> = React.RefObject<T> | ((instance: T | null) => void) | null; 