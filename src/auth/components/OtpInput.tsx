import React, { useState, useRef, useEffect, KeyboardEvent, ClipboardEvent } from 'react';
import { useTranslation } from 'react-i18next';
import { OTP_CONFIG } from '@/constants/auth';

interface OtpInputProps {
  value: string;
  onChange: (value: string) => void;
  onComplete: (code: string) => void;
  disabled?: boolean;
  error?: boolean;
}

const OtpInput: React.FC<OtpInputProps> = ({
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
}) => {
  const { t } = useTranslation();
  const [digits, setDigits] = useState<string[]>(
    new Array(OTP_CONFIG.LENGTH).fill('').map((_, index) => value[index] || '')
  );
  const inputRefs = useRef<(HTMLInputElement | null)[]>(new Array(OTP_CONFIG.LENGTH).fill(null));

  // Update digits when value prop changes
  useEffect(() => {
    const newDigits = new Array(OTP_CONFIG.LENGTH).fill('').map((_, index) => value[index] || '');
    setDigits(newDigits);
  }, [value]);

  // Focus first empty input on mount
  useEffect(() => {
    const firstEmptyIndex = digits.findIndex(digit => digit === '');
    const focusIndex = firstEmptyIndex === -1 ? OTP_CONFIG.LENGTH - 1 : firstEmptyIndex;
    inputRefs.current[focusIndex]?.focus();
  }, [digits]);

  const updateDigits = (newDigits: string[]) => {
    setDigits(newDigits);
    const newValue = newDigits.join('');
    onChange(newValue);

    // Auto-submit when complete
    if (newValue.length === OTP_CONFIG.LENGTH && newValue.match(/^\d{6}$/)) {
      onComplete(newValue);
    }
  };

  const handleInputChange = (index: number, inputValue: string) => {
    // Only allow digits
    const sanitizedValue = inputValue.replace(/[^0-9]/g, '');

    if (sanitizedValue.length <= 1) {
      const newDigits = [...digits];
      newDigits[index] = sanitizedValue;
      updateDigits(newDigits);

      // Auto-focus next input
      if (sanitizedValue && index < OTP_CONFIG.LENGTH - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (index: number, event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Backspace' && !digits[index] && index > 0) {
      // Move to previous input on backspace when current is empty
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < OTP_CONFIG.LENGTH - 1) {
      inputRefs.current[index + 1]?.focus();
    } else if (/^[0-9]$/.test(event.key)) {
      // Prevent default to handle input ourselves
      event.preventDefault();
      handleInputChange(index, event.key);
    }
  };

  const handlePaste = (event: ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData('text').trim();

    // Only process if it's a valid OTP code
    if (pastedData.match(/^\d{6}$/)) {
      const newDigits = pastedData.split('').slice(0, OTP_CONFIG.LENGTH);
      updateDigits([...newDigits, ...new Array(Math.max(0, OTP_CONFIG.LENGTH - newDigits.length)).fill('')]);

      // Focus the last filled input
      const lastIndex = Math.min(newDigits.length - 1, OTP_CONFIG.LENGTH - 1);
      inputRefs.current[lastIndex]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    // Select all text on focus for easy replacement
    inputRefs.current[index]?.select();
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-center space-x-2">
        {digits.map((digit, index) => (
          <input
            key={index}
            ref={(el) => (inputRefs.current[index] = el)}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleInputChange(index, e.target.value)}
            onKeyDown={(e) => handleKeyDown(index, e)}
            onPaste={handlePaste}
            onFocus={() => handleFocus(index)}
            disabled={disabled}
            className={`w-12 h-12 text-center text-xl font-semibold border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors ${
              error
                ? 'border-red-300 focus:ring-red-500 focus:border-red-500'
                : 'border-gray-300'
            } ${
              disabled
                ? 'bg-gray-50 text-gray-500 cursor-not-allowed'
                : 'bg-white text-gray-900'
            }`}
            aria-label={t('accessibility.otpInput', { position: index + 1 })}
            aria-invalid={error}
            autoComplete="one-time-code"
          />
        ))}
      </div>

      {/* Screen reader helper */}
      <div className="sr-only" aria-live="polite">
        {value.length > 0 && (
          <span>
            {t('Entered')} {value.length} {t('of')} {OTP_CONFIG.LENGTH} {t('digits')}
          </span>
        )}
      </div>
    </div>
  );
};

export default OtpInput;