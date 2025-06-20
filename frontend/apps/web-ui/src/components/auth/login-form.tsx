import React, { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link } from 'react-router-dom';
import { cn } from '../../utils/cn';
import { loginSchema, type LoginFormData } from '../../utils/validation-schemas';
import Input from '../ui/Input';
import Button from '../ui/Button';
import Checkbox from '../ui/Checkbox';
import PasswordInput from './password-input';
import OAuthProviders, { type OAuthProvider } from './oauth-providers';

export interface LoginFormProps {
  onSubmit: (data: LoginFormData) => Promise<void>;
  onOAuthClick: (provider: OAuthProvider) => void;
  loading?: boolean;
  oauthLoading?: string | null;
  error?: string;
  className?: string;
}

type FormData = {
  email: string;
  password: string;
  rememberMe: boolean;
};

const LoginForm: React.FC<LoginFormProps> = ({
  onSubmit,
  onOAuthClick,
  loading = false,
  oauthLoading = null,
  error,
  className
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false
    }
  });

  const handleFormSubmit: SubmitHandler<FormData> = async (data) => {
    try {
      clearErrors();
      await onSubmit(data as LoginFormData);
    } catch (err: any) {
      // Handle specific API errors
      if (err.field) {
        setError(err.field as keyof FormData, {
          type: 'manual',
          message: err.message
        });
      } else {
        setError('root', {
          type: 'manual',
          message: err.message || 'An unexpected error occurred'
        });
      }
    }
  };

  const isLoading = loading || isSubmitting;

  return (
    <div className={cn('w-full', className)}>
      {/* Modern Glass Card */}
      <div className="auth-glass-card hover-lift">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Welcome back
          </h2>
          <p className="text-white/80">
            Sign in to continue your AI journey
          </p>
        </div>

        {/* Global Error Message */}
        {(error || errors.root?.message) && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-200">
                {error || errors.root?.message}
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Email Field */}
          <div className="floating-input-group">
            <Input
              {...register('email')}
              type="email"
              placeholder=" "
              disabled={isLoading}
              autoComplete="email"
              className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-blue-400 focus:ring-blue-400/50"
            />
            <label className="floating-label text-white/70">Email address</label>
            {errors.email && (
              <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="floating-input-group">
            <PasswordInput
              {...register('password')}
              placeholder=" "
              disabled={isLoading}
              autoComplete="current-password"
              className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-blue-400 focus:ring-blue-400/50"
            />
            <label className="floating-label text-white/70">Password</label>
            {errors.password && (
              <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
            )}
          </div>

          {/* Remember Me & Forgot Password */}
          <div className="flex items-center justify-between">
            <Checkbox
              {...register('rememberMe')}
              label="Remember me"
              size="sm"
              disabled={isLoading}
              className="text-white/80"
            />
            
            <Link
              to="/auth/forgot-password"
              className="text-sm text-blue-300 hover:text-blue-200 font-medium transition-colors hover-scale"
            >
              Forgot password?
            </Link>
          </div>

          {/* Sign In Button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            disabled={isLoading}
            loading={isLoading}
            className="w-full btn-modern bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {isLoading ? 'Signing in...' : 'Sign in'}
          </Button>
        </form>

        {/* OAuth Providers */}
        <div className="mt-8">
          <OAuthProviders
            onProviderClick={onOAuthClick}
            loading={oauthLoading}
            disabled={isLoading}
            showEnterpriseOnly={false}
          />
        </div>

        {/* Sign Up Link */}
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Don't have an account?{' '}
            <Link
              to="/auth/register"
              className="text-blue-300 hover:text-blue-200 font-medium transition-colors hover-scale"
            >
              Create one now
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            Protected by advanced security measures.{' '}
            <a 
              href="/security" 
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm; 