import React from 'react';
import { Outlet, Link } from 'react-router-dom';

interface AuthLayoutProps {
  children?: React.ReactNode;
}

const AuthLayout: React.FC<AuthLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen relative overflow-hidden" style={{ background: 'var(--auth-bg-gradient)' }}>
      {/* Modern Background Pattern */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Animated floating elements */}
        <div className="absolute -top-20 -right-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl animate-float"></div>
        <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-purple-400/20 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/3 left-1/4 w-96 h-96 bg-gradient-to-r from-blue-400/10 to-purple-400/10 rounded-full blur-3xl animate-breathe"></div>
        <div className="absolute bottom-1/3 right-1/4 w-64 h-64 bg-indigo-400/15 rounded-full blur-2xl animate-float" style={{ animationDelay: '4s' }}></div>
        
        {/* Subtle grid pattern */}
        <div className="absolute inset-0 opacity-5" style={{
          backgroundImage: `
            linear-gradient(rgba(255, 255, 255, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255, 255, 255, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: '50px 50px'
        }}></div>
      </div>

      {/* Header */}
      <header className="relative z-10 p-6">
        <div className="container mx-auto">
          <Link 
            to="/" 
            className="inline-flex items-center space-x-3 text-white hover:text-blue-200 transition-all duration-300 hover-scale"
          >
            <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center border border-white/30 shadow-lg">
              <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
              </svg>
            </div>
            <span className="font-display font-bold text-2xl text-white">
              AI Assistant
            </span>
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main className="relative z-10 flex items-center justify-center min-h-[calc(100vh-140px)] p-6">
        <div className="w-full max-w-md mx-auto">
          {children || <Outlet />}
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 p-6 text-center">
        <p className="text-sm text-white/70">
          © 2024 AI Assistant Platform. Powered by modern AI technology.
        </p>
      </footer>
    </div>
  );
};

export default AuthLayout; 