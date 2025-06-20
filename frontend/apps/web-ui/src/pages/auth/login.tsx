import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthLayout, LoginForm } from '../../components/auth';
import { type OAuthProvider } from '../../components/auth/oauth-providers';
import { type LoginFormData } from '../../utils/validation-schemas';

const LoginPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState<string | null>(null);
  const [error, setError] = useState<string>('');

  const handleSubmit = async (data: LoginFormData) => {
    setLoading(true);
    setError('');
    
    try {
      // Simulate API call
      console.log('Login data:', data);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock success - in real app, handle API response
      alert(`✅ Login successful!\n\nEmail: ${data.email}\nRemember Me: ${data.rememberMe ? 'Yes' : 'No'}\n\n🚀 Redirecting to dashboard...`);
      
      // Redirect to dashboard (or home for now)
      navigate('/');
      
    } catch (err: any) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleOAuthClick = async (provider: OAuthProvider) => {
    setOauthLoading(provider.id);
    setError('');
    
    try {
      // Simulate OAuth flow
      console.log('OAuth provider clicked:', provider);
      
      // Simulate OAuth delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Mock OAuth success
      alert(`✅ OAuth login with ${provider.displayName} successful!\n\n🔗 Enterprise SSO features:\n• Single sign-on\n• Team management\n• Advanced security\n\n🚀 Redirecting to dashboard...`);
      
      // Redirect to dashboard (or home for now)
      navigate('/');
      
    } catch (err: any) {
      setError(`Failed to login with ${provider.displayName}. Please try again.`);
    } finally {
      setOauthLoading(null);
    }
  };

  return (
    <AuthLayout>
      <LoginForm
        onSubmit={handleSubmit}
        onOAuthClick={handleOAuthClick}
        loading={loading}
        oauthLoading={oauthLoading}
        error={error}
      />
    </AuthLayout>
  );
};

export default LoginPage; 