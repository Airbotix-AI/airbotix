import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { ROUTES } from '@/constants/auth';
import EmailForm from '../components/EmailForm';
import ErrorBanner from '../components/ErrorBanner';
import LanguageToggle from '../components/LanguageToggle';
import { trackEvent, extractEmailDomain } from '@/utils/analytics';

const Login: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    authState,
    error,
    isAuthenticated,
    requestOtp,
    clearError,
  } = useAuthStore();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Redirect to verify page after OTP is sent
  useEffect(() => {
    if (authState === 'sent') {
      navigate(ROUTES.VERIFY, { replace: true });
    }
  }, [authState, navigate]);

  // Page view event for login view
  useEffect(() => {
    trackEvent('teacher_auth_login_view', {
      language: (navigator.language || '').toLowerCase(),
    })
  }, [])

  const handleEmailSubmit = async (email: string) => {
    clearError();

    try {
      // Store email in session storage for verify page
      sessionStorage.setItem('pendingEmail', email);
      await requestOtp(email);
      trackEvent('teacher_auth_otp_request_success', {
        cooldown_seconds: 60,
        email_domain: extractEmailDomain(email),
      })
    } catch (error) {
      console.error('Failed to request OTP:', error);
      trackEvent('teacher_auth_otp_request_fail', {
        error_code: 'REQUEST_FAILED',
        email_domain: extractEmailDomain(email),
      })
    }
  };

  const isLoading = authState === 'sending';

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-blue-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Language Toggle */}
        <div className="flex justify-end mb-4">
          <LanguageToggle />
        </div>

        {/* Logo and Title */}
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            {t('app.title')}
          </h1>
          <h2 className="text-xl font-semibold text-blue-600 mb-8">
            {t('auth.login.title')}
          </h2>
        </div>

        {/* Login Form */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <div className="mb-6">
            <p className="text-center text-sm text-gray-600">
              {t('auth.login.subtitle')}
            </p>
          </div>

          <ErrorBanner error={error} onClose={clearError} />

          <EmailForm onSubmit={handleEmailSubmit} isLoading={isLoading} />

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t('By continuing, you agree to our terms of service and privacy policy')}
            </p>
          </div>
        </div>

        {/* Back to Home */}
        <div className="mt-6 text-center">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← {t('Back to')} {t('nav.home')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;