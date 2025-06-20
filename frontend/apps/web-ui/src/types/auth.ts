// Authentication Type Definitions
export interface LoginFormData {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  agreeToTerms: boolean;
  subscribeNewsletter?: boolean;
}

export interface ForgotPasswordFormData {
  email: string;
}

export interface ResetPasswordFormData {
  password: string;
  confirmPassword: string;
  token: string;
}

// OAuth Provider Configuration
export interface OAuthProvider {
  id: string;
  name: string;
  displayName: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  color: string;
  bgColor: string;
  hoverColor: string;
  endpoint: string;
  enterprise: boolean;
  description?: string;
}

// Authentication State
export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  avatar?: string;
  role: UserRole;
  organization?: Organization;
  preferences: UserPreferences;
  emailVerified: boolean;
  createdAt: string;
  lastLoginAt?: string;
}

export interface Organization {
  id: string;
  name: string;
  domain: string;
  plan: 'starter' | 'professional' | 'enterprise';
  features: string[];
}

export interface UserPreferences {
  language: string;
  timezone: string;
  theme: 'light' | 'dark' | 'auto';
  notifications: {
    email: boolean;
    push: boolean;
    sms: boolean;
  };
}

export type UserRole = 'user' | 'manager' | 'admin' | 'super_admin';

// API Response Types
export interface AuthResponse {
  success: boolean;
  data?: {
    user: AuthUser;
    token: string;
    refreshToken: string;
    expiresIn: number;
  };
  error?: {
    code: string;
    message: string;
    field?: string;
  };
}

export interface OAuthResponse {
  success: boolean;
  data?: {
    redirectUrl: string;
    state: string;
  };
  error?: {
    code: string;
    message: string;
  };
}

// Form State Types
export interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  icon?: React.ReactNode;
  className?: string;
}

export interface FormState {
  isLoading: boolean;
  isSubmitted: boolean;
  errors: Record<string, string>;
  touched: Record<string, boolean>;
}

// Enterprise Features Types
export interface EnterpriseConfig {
  ssoEnabled: boolean;
  mfaRequired: boolean;
  passwordPolicy: {
    minLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSymbols: boolean;
    requireSpecialChars: boolean;
  };
  sessionTimeout: number;
  auditLogging: boolean;
}

// Analytics & Tracking
export interface AuthAnalytics {
  loginAttempts: number;
  successfulLogins: number;
  failedLogins: number;
  oauthUsage: Record<string, number>;
  lastActivity: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    browser: string;
  };
} 