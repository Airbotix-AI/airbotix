import React from 'react';
import { useTranslation } from 'react-i18next';

interface CountdownResendProps {
  cooldown: number;
  onResend: () => void;
  disabled?: boolean;
}

const CountdownResend: React.FC<CountdownResendProps> = ({
  cooldown,
  onResend,
  disabled = false,
}) => {
  const { t } = useTranslation();

  const canResend = cooldown === 0 && !disabled;

  const handleResend = () => {
    if (canResend) {
      onResend();
    }
  };

  return (
    <div className="text-center">
      {cooldown > 0 ? (
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-600">
            {t('auth.verify.resendIn', { seconds: cooldown })}
          </p>
          <div
            className="text-xs text-gray-500"
            aria-live="polite"
            aria-label={t('accessibility.resendTimer', { seconds: cooldown })}
          >
            {/* Visual countdown indicator */}
            <div className="w-32 h-1 bg-gray-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-1000 ease-linear"
                style={{
                  width: `${((60 - cooldown) / 60) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <button
          onClick={handleResend}
          disabled={disabled}
          className={`text-sm font-medium transition-colors duration-200 ${
            canResend
              ? 'text-blue-600 hover:text-blue-700 focus:outline-none focus:underline'
              : 'text-gray-400 cursor-not-allowed'
          }`}
          aria-describedby={disabled ? 'resend-disabled' : undefined}
        >
          {t('auth.verify.resendCode')}
        </button>
      )}

      {disabled && (
        <p id="resend-disabled" className="sr-only">
          {t('Resend is currently disabled')}
        </p>
      )}
    </div>
  );
};

export default CountdownResend;