import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Link, useNavigate } from 'react-router-dom';
import { registerSchema, type RegisterFormData } from '../../utils/validation-schemas';
import { AuthLayout } from '../../components/auth';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import Checkbox from '../../components/ui/Checkbox';
import PasswordInput from '../../components/auth/password-input';

const RegisterPage: React.FC = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    trigger,
    watch,
    setError: setFormError,
    clearErrors
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
      agreeToTerms: false,
      subscribeNewsletter: false
    }
  });

  const watchedPassword = watch('password', '');

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await trigger(['firstName', 'lastName']);
      if (isValid) setStep(2);
    } else if (step === 2) {
      const isValid = await trigger(['email']);
      if (isValid) setStep(3);
    }
  };

  const handlePrevStep = () => {
    if (step > 1) setStep(step - 1);
  };

  const handleFormSubmit = async (data: RegisterFormData) => {
    setLoading(true);
    setError('');
    
    try {
      clearErrors();
      
      // Simulate API call
      console.log('Register data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success
      alert(`✅ Registration successful!\n\nWelcome ${data.firstName} ${data.lastName}!\nEmail: ${data.email}\n\n🚀 Redirecting to dashboard...`);
      
      // Redirect to login or dashboard
      navigate('/auth/login');
      
    } catch (err: any) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = (password: string) => {
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[@$!%*?&]/.test(password)) score += 1;
    
    const colors = ['red', 'red', 'orange', 'yellow', 'green'];
    const labels = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
    
    return {
      score,
      color: colors[score] || 'red',
      label: labels[score] || 'Very Weak',
      percentage: (score / 5) * 100
    };
  };

  const passwordStrength = getPasswordStrength(watchedPassword);
  const isLoading = loading || isSubmitting;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center mb-8">
      {[1, 2, 3].map((stepNumber) => (
        <React.Fragment key={stepNumber}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
            stepNumber === step 
              ? 'bg-blue-500 text-white shadow-lg' 
              : stepNumber < step 
                ? 'bg-green-500 text-white'
                : 'bg-white/20 text-white/60'
          }`}>
            {stepNumber < step ? '✓' : stepNumber}
          </div>
          {stepNumber < 3 && (
            <div className={`w-12 h-1 mx-2 transition-all ${
              stepNumber < step ? 'bg-green-500' : 'bg-white/20'
            }`} />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <AuthLayout>
      <div className="auth-glass-card hover-lift">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="mb-4">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-600 rounded-2xl mx-auto flex items-center justify-center shadow-lg">
              <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
              </svg>
            </div>
          </div>
          <h2 className="text-3xl font-display font-bold text-white mb-2">
            Create Account
          </h2>
          <p className="text-white/80">
            Join thousands of users on your AI journey
          </p>
        </div>

        {/* Step Indicator */}
        {renderStepIndicator()}

        {/* Global Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/20 backdrop-blur-sm border border-red-400/30 rounded-xl">
            <div className="flex items-center">
              <svg className="w-5 h-5 text-red-400 mr-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <p className="text-sm text-red-200">{error}</p>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Personal Information</h3>
                <p className="text-white/70 text-sm">Let's start with your basic details</p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="floating-input-group">
                  <Input
                    {...register('firstName')}
                    placeholder=" "
                    disabled={isLoading}
                    autoComplete="given-name"
                    className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-purple-400 focus:ring-purple-400/50"
                  />
                  <label className="floating-label text-white/70">First Name</label>
                  {errors.firstName && (
                    <p className="mt-1 text-sm text-red-300">{errors.firstName.message}</p>
                  )}
                </div>

                <div className="floating-input-group">
                  <Input
                    {...register('lastName')}
                    placeholder=" "
                    disabled={isLoading}
                    autoComplete="family-name"
                    className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-purple-400 focus:ring-purple-400/50"
                  />
                  <label className="floating-label text-white/70">Last Name</label>
                  {errors.lastName && (
                    <p className="mt-1 text-sm text-red-300">{errors.lastName.message}</p>
                  )}
                </div>
              </div>

              <Button
                type="button"
                onClick={handleNextStep}
                className="w-full btn-modern bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Continue
              </Button>
            </div>
          )}

          {/* Step 2: Email */}
          {step === 2 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Email Address</h3>
                <p className="text-white/70 text-sm">We'll use this to keep your account secure</p>
              </div>

              <div className="floating-input-group">
                <Input
                  {...register('email')}
                  type="email"
                  placeholder=" "
                  disabled={isLoading}
                  autoComplete="email"
                  className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-purple-400 focus:ring-purple-400/50"
                />
                <label className="floating-label text-white/70">Email Address</label>
                {errors.email && (
                  <p className="mt-1 text-sm text-red-300">{errors.email.message}</p>
                )}
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl py-4 transition-all duration-300"
                >
                  Back
                </Button>
                <Button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 btn-modern bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  Continue
                </Button>
              </div>
            </div>
          )}

          {/* Step 3: Password & Terms */}
          {step === 3 && (
            <div className="space-y-6 animate-fade-in">
              <div className="text-center mb-6">
                <h3 className="text-xl font-semibold text-white mb-2">Secure Your Account</h3>
                <p className="text-white/70 text-sm">Create a strong password to protect your account</p>
              </div>

              <div className="floating-input-group">
                <PasswordInput
                  {...register('password')}
                  placeholder=" "
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-purple-400 focus:ring-purple-400/50"
                />
                <label className="floating-label text-white/70">Password</label>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-300">{errors.password.message}</p>
                )}
                
                {/* Password Strength Indicator */}
                {watchedPassword && (
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-white/70 mb-1">
                      <span>Password Strength</span>
                      <span className={`font-medium text-${passwordStrength.color}-400`}>
                        {passwordStrength.label}
                      </span>
                    </div>
                    <div className="w-full bg-white/20 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full transition-all duration-300 bg-${passwordStrength.color}-500`}
                        style={{ width: `${passwordStrength.percentage}%` }}
                      />
                    </div>
                  </div>
                )}
              </div>

              <div className="floating-input-group">
                <PasswordInput
                  {...register('confirmPassword')}
                  placeholder=" "
                  disabled={isLoading}
                  autoComplete="new-password"
                  className="floating-input bg-white/10 border-white/20 text-white placeholder-transparent focus:border-purple-400 focus:ring-purple-400/50"
                />
                <label className="floating-label text-white/70">Confirm Password</label>
                {errors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-300">{errors.confirmPassword.message}</p>
                )}
              </div>

              <div className="space-y-4">
                <Checkbox
                  {...register('agreeToTerms')}
                  label={
                    <span className="text-white/80 text-sm">
                      I agree to the{' '}
                      <a href="/terms" className="text-blue-300 hover:text-blue-200 transition-colors">
                        Terms of Service
                      </a>
                      {' '}and{' '}
                      <a href="/privacy" className="text-blue-300 hover:text-blue-200 transition-colors">
                        Privacy Policy
                      </a>
                    </span>
                  }
                  disabled={isLoading}
                />
                {errors.agreeToTerms && (
                  <p className="text-sm text-red-300">{errors.agreeToTerms.message}</p>
                )}

                <Checkbox
                  {...register('subscribeNewsletter')}
                  label="Subscribe to our newsletter for updates and tips"
                  disabled={isLoading}
                  className="text-white/80 text-sm"
                />
              </div>

              <div className="flex gap-3">
                <Button
                  type="button"
                  onClick={handlePrevStep}
                  className="flex-1 bg-white/10 hover:bg-white/20 text-white border border-white/20 rounded-xl py-4 transition-all duration-300"
                >
                  Back
                </Button>
                <Button
                  type="submit"
                  disabled={isLoading}
                  loading={isLoading}
                  className="flex-1 btn-modern bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 text-white font-semibold py-4 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  {isLoading ? 'Creating Account...' : 'Create Account'}
                </Button>
              </div>
            </div>
          )}
        </form>

        {/* Sign In Link */}
        <div className="mt-8 text-center">
          <p className="text-white/70">
            Already have an account?{' '}
            <Link
              to="/auth/login"
              className="text-blue-300 hover:text-blue-200 font-medium transition-colors hover-scale"
            >
              Sign in here
            </Link>
          </p>
        </div>

        {/* Security Notice */}
        <div className="mt-6 text-center">
          <p className="text-xs text-white/50">
            Your data is protected with advanced encryption.{' '}
            <a 
              href="/security" 
              className="text-blue-300 hover:text-blue-200 transition-colors"
            >
              Learn more
            </a>
          </p>
        </div>
      </div>
    </AuthLayout>
  );
};

export default RegisterPage; 