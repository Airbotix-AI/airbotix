import React from 'react';
import { useForm } from 'react-hook-form';
import { useTranslation } from 'react-i18next';
import { VALIDATION_PATTERNS } from '@/constants/auth';

interface EmailFormProps {
  onSubmit: (email: string) => void;
  isLoading: boolean;
}

interface FormData {
  email: string;
}

const EmailForm: React.FC<EmailFormProps> = ({ onSubmit, isLoading }) => {
  const { t } = useTranslation();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const handleFormSubmit = (data: FormData) => {
    onSubmit(data.email.toLowerCase().trim());
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
      <div>
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700 mb-2"
        >
          {t('auth.login.emailLabel')}
        </label>
        <input
          {...register('email', {
            required: t('auth.login.emailRequired'),
            pattern: {
              value: VALIDATION_PATTERNS.EMAIL,
              message: t('auth.login.emailInvalid'),
            },
          })}
          id="email"
          type="email"
          autoComplete="email"
          autoFocus
          placeholder={t('auth.login.emailPlaceholder')}
          className={`block w-full px-3 py-2 border rounded-lg shadow-sm placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${
            errors.email
              ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
              : 'border-gray-300'
          }`}
          aria-invalid={errors.email ? 'true' : 'false'}
          aria-describedby={errors.email ? 'email-error' : undefined}
          disabled={isLoading}
        />
        {errors.email && (
          <p
            id="email-error"
            className="mt-2 text-sm text-red-600"
            role="alert"
          >
            {errors.email.message}
          </p>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading}
        className={`w-full flex justify-center items-center px-4 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white transition-colors duration-200 ${
          isLoading
            ? 'bg-blue-400 cursor-not-allowed'
            : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
        }`}
        aria-describedby={isLoading ? 'loading-description' : undefined}
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
            <span>{t('auth.login.sendingCode')}</span>
            <span id="loading-description" className="sr-only">
              {t('accessibility.loading')}
            </span>
          </>
        ) : (
          t('auth.login.sendCodeButton')
        )}
      </button>
    </form>
  );
};

export default EmailForm;