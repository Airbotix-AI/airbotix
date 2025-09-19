import { useTranslation } from 'react-i18next';

interface ErrorBannerProps {
  error: string | null;
  onClose: () => void;
}

const ErrorBanner: React.FC<ErrorBannerProps> = ({ error, onClose }) => {
  const { t } = useTranslation();

  if (!error) return null;

  const getErrorMessage = (errorCode: string): string => {
    // Check if it's a known error code
    if (errorCode.startsWith('auth.errors.')) {
      return t(errorCode);
    }

    // Map error codes to translation keys
    const errorKey = `auth.errors.${errorCode}`;
    const translated = t(errorKey);

    // If translation exists, use it; otherwise, use the original error
    return translated !== errorKey ? translated : t('auth.errors.UNKNOWN_ERROR');
  };

  return (
    <div
      className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg"
      role="alert"
      aria-live="polite"
    >
      <div className="flex items-start">
        <div className="flex-shrink-0">
          <svg
            className="w-5 h-5 text-red-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-hidden="true"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z"
              clipRule="evenodd"
            />
          </svg>
        </div>
        <div className="ml-3 flex-1">
          <p className="text-sm text-red-800">{getErrorMessage(error)}</p>
        </div>
        <div className="ml-auto pl-3">
          <button
            onClick={onClose}
            className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
            aria-label={t('accessibility.closeError')}
          >
            <svg
              className="w-4 h-4"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ErrorBanner;