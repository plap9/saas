import { z } from 'zod';

// Login Form Validation Schema
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long'),
  rememberMe: z.boolean().optional().default(false),
});

// Register Form Validation Schema
export const registerSchema = z.object({
  firstName: z
    .string()
    .min(1, 'First name is required')
    .min(2, 'First name must be at least 2 characters')
    .max(50, 'First name is too long')
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'First name can only contain letters'),
  lastName: z
    .string()
    .min(1, 'Last name is required')
    .min(2, 'Last name must be at least 2 characters')
    .max(50, 'Last name is too long')
    .regex(/^[a-zA-ZÀ-ÿ\s]*$/, 'Last name can only contain letters'),
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  agreeToTerms: z
    .boolean()
    .refine(val => val === true, 'You must agree to the terms and conditions'),
  subscribeNewsletter: z.boolean().optional().default(false),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Forgot Password Form Validation Schema
export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address')
    .max(255, 'Email is too long'),
});

// Reset Password Form Validation Schema
export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters')
    .max(128, 'Password is too long')
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character'
    ),
  confirmPassword: z
    .string()
    .min(1, 'Please confirm your password'),
  token: z
    .string()
    .min(1, 'Reset token is required'),
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ['confirmPassword'],
});

// Email Validation for Quick Checks
export const emailSchema = z
  .string()
  .email('Please enter a valid email address');

// Password Strength Validation (for enterprise)
export const passwordStrengthSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .max(128, 'Password is too long')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/\d/, 'Password must contain at least one number')
  .regex(/[@$!%*?&]/, 'Password must contain at least one special character');

// Enterprise Password Policy (configurable)
export const createPasswordSchema = (policy?: {
  minLength?: number;
  requireUppercase?: boolean;
  requireLowercase?: boolean;
  requireNumbers?: boolean;
  requireSymbols?: boolean;
}) => {
  let schema = z.string().min(1, 'Password is required');
  
  const minLength = policy?.minLength || 8;
  schema = schema.min(minLength, `Password must be at least ${minLength} characters`);
  
  if (policy?.requireLowercase !== false) {
    schema = schema.regex(/[a-z]/, 'Password must contain at least one lowercase letter');
  }
  
  if (policy?.requireUppercase !== false) {
    schema = schema.regex(/[A-Z]/, 'Password must contain at least one uppercase letter');
  }
  
  if (policy?.requireNumbers !== false) {
    schema = schema.regex(/\d/, 'Password must contain at least one number');
  }
  
  if (policy?.requireSymbols !== false) {
    schema = schema.regex(/[@$!%*?&]/, 'Password must contain at least one special character');
  }
  
  return schema;
};

// Organization/Team Validation
export const organizationSchema = z.object({
  name: z
    .string()
    .min(1, 'Organization name is required')
    .min(2, 'Organization name must be at least 2 characters')
    .max(100, 'Organization name is too long'),
  domain: z
    .string()
    .optional()
    .refine(
      val => !val || /^[a-zA-Z0-9][a-zA-Z0-9-]{0,61}[a-zA-Z0-9]\.?$/.test(val),
      'Please enter a valid domain name'
    ),
  size: z.enum(['1-10', '11-50', '51-200', '201-1000', '1000+'], {
    required_error: 'Please select organization size',
  }),
  industry: z
    .string()
    .min(1, 'Please select an industry'),
});

// Type exports for form validation
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type OrganizationFormData = z.infer<typeof organizationSchema>;

// Validation Helper Functions
export const validateEmail = (email: string): boolean => {
  try {
    emailSchema.parse(email);
    return true;
  } catch {
    return false;
  }
};

export const getPasswordStrength = (password: string): {
  score: number;
  feedback: string[];
  isStrong: boolean;
} => {
  let score = 0;
  const feedback: string[] = [];

  if (password.length >= 8) score += 1;
  else feedback.push('Use at least 8 characters');

  if (/[a-z]/.test(password)) score += 1;
  else feedback.push('Add lowercase letters');

  if (/[A-Z]/.test(password)) score += 1;
  else feedback.push('Add uppercase letters');

  if (/\d/.test(password)) score += 1;
  else feedback.push('Add numbers');

  if (/[@$!%*?&]/.test(password)) score += 1;
  else feedback.push('Add special characters');

  return {
    score,
    feedback,
    isStrong: score >= 4,
  };
}; 