import React from 'react';
import { createBrowserRouter, RouteObject } from 'react-router-dom';

// Pages
import HomePage from '../pages/home';
import DashboardPage from '../pages/dashboard';
import LoginPage from '../pages/auth/login';
import RegisterPage from '../pages/auth/register';
import ForgotPasswordPage from '../pages/auth/forgot-password';
import VerifyEmailPage from '../pages/auth/verify-email';

// Layouts
import AuthLayout from '../components/auth/auth-layout';

// Route configuration
const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
  },
  {
    path: '/dashboard',
    element: <DashboardPage />,
  },
  {
    path: '/auth',
    element: <AuthLayout />,
    children: [
      {
        path: 'login',
        element: <LoginPage />,
      },
      {
        path: 'register',
        element: <RegisterPage />,
      },
      {
        path: 'forgot-password',
        element: <ForgotPasswordPage />,
      },
      {
        path: 'verify-email',
        element: <VerifyEmailPage />,
      },
    ],
  },
  {
    path: '*',
    element: (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-neutral-900 dark:text-neutral-100 mb-4">
            404 - Page Not Found
          </h1>
          <p className="text-neutral-600 dark:text-neutral-400 mb-8">
            The page you're looking for doesn't exist.
          </p>
          <a
            href="/"
            className="bg-primary-500 hover:bg-primary-600 text-white px-6 py-3 rounded-lg font-medium transition-colors"
          >
            Go Home
          </a>
        </div>
      </div>
    ),
  },
];

export const router = createBrowserRouter(routes);

export default router;