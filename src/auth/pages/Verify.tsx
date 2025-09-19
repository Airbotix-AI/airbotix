import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuthStore } from '@/store/authStore';
import { ROUTES, VALIDATION_PATTERNS } from '@/constants/auth';
import OtpInput from '../components/OtpInput';
import CountdownResend from '../components/CountdownResend';
import ErrorBanner from '../components/ErrorBanner';
import LanguageToggle from '../components/LanguageToggle';

const Verify: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [otpCode, setOtpCode] = useState('');
  const [email, setEmail] = useState('');

  const {
    authState,
    error,
    isAuthenticated,
    resendCooldown,
    login,
    requestOtp,
    clearError,
  } = useAuthStore();

  // Get email from session storage on mount
  useEffect(() => {
    const pendingEmail = sessionStorage.getItem('pendingEmail');
    if (pendingEmail) {
      setEmail(pendingEmail);
    } else {
      // Redirect to login if no pending email
      navigate(ROUTES.LOGIN, { replace: true });
    }
  }, [navigate]);

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate(ROUTES.DASHBOARD, { replace: true });
    }
  }, [isAuthenticated, navigate]);

  // Clear session storage on unmount
  useEffect(() => {
    return () => {
      if (authState === 'success') {
        sessionStorage.removeItem('pendingEmail');
      }
    };
  }, [authState]);

  const handleOtpComplete = async (code: string) => {
    if (!email || !VALIDATION_PATTERNS.OTP_CODE.test(code)) {
      return;
    }

    clearError();
    await login(email, code);
  };

  const handleResendOtp = async () => {
    if (!email) return;

    clearError();
    await requestOtp(email);
  };

  const handleChangeEmail = () => {
    sessionStorage.removeItem('pendingEmail');
    navigate(ROUTES.LOGIN, { replace: true });
  };

  const isLoading = authState === 'verifying';
  const hasError = error !== null;

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
            {t('auth.verify.title')}
          </h2>
        </div>

        {/* Verification Form */}
        <div className="bg-white py-8 px-4 shadow-xl rounded-xl sm:px-10">
          <div className="mb-6 text-center">
            <p className="text-sm text-gray-600 mb-4">
              {t('auth.verify.subtitle', { email })}
            </p>
            <button
              onClick={handleChangeEmail}
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {t('auth.verify.changeEmail')}
            </button>
          </div>

          <ErrorBanner error={error} onClose={clearError} />

          <div className="space-y-6">
            {/* OTP Input */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                {t('auth.verify.codeLabel')}
              </label>
              <OtpInput
                value={otpCode}
                onChange={setOtpCode}
                onComplete={handleOtpComplete}
                disabled={isLoading}
                error={hasError}
              />
            </div>

            {/* Resend Code */}
            <CountdownResend
              cooldown={resendCooldown}
              onResend={handleResendOtp}
              disabled={authState === 'sending'}
            />

            {/* Verify Button */}
            <button
              onClick={() => handleOtpComplete(otpCode)}
              disabled={isLoading || otpCode.length !== 6}
              className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
                isLoading || otpCode.length !== 6
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    aria-hidden="true"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  <span>{t('auth.verify.verifying')}</span>
                </>
              ) : (
                t('auth.verify.verifyButton')
              )}
            </button>
          </div>

          {/* Help Text */}
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t("Didn't receive the code? Check your spam folder or try resending.")}
            </p>
          </div>
        </div>

        {/* Back to Login */}
        <div className="mt-6 text-center">
          <button
            onClick={handleChangeEmail}
            className="text-sm text-blue-600 hover:text-blue-700 font-medium"
          >
            ← {t('Back to')} {t('nav.login')}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Verify;