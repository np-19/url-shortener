import { useState } from 'react';
import { useCalendarDialog } from '../../../hooks/useCalendarDialog';
import CustomAliasField from './CustomAliasField';
import CustomAliasToggle from './CustomAliasToggle';
import CustomExpirationField from './CustomExpirationField';
import ExpirationSelect from './ExpirationSelect';
import SubmitButton from './SubmitButton';
import UrlInputField from './UrlInputField';
import type { UrlShortenerFieldsProps } from './types';

const UrlShortenerFields = ({
  url,
  setUrl,
  customAlias,
  setCustomAlias,
  showCustomAlias,
  setShowCustomAlias,
  expiresIn,
  setExpiresIn,
  customExpiresDate,
  setCustomExpiresDate,
  error,
  loading,
  onSubmit,
}: UrlShortenerFieldsProps) => {
  const [showAdvanced, setShowAdvanced] = useState(false);
  const { calendarPanelRef, isCalendarOpen, setIsCalendarOpen } = useCalendarDialog();

  const handleAliasToggle = (enabled: boolean) => {
    setShowCustomAlias(enabled);
    if (!enabled) {
      setCustomAlias('');
    }
  };

  const handleDateChange = (value: string) => {
    setCustomExpiresDate(value);
    if (value) {
      setIsCalendarOpen(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-stretch">
        <UrlInputField value={url} onChange={setUrl} />
        <SubmitButton loading={loading} />
      </div>

      <div className="flex justify-start">
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className="text-sm font-semibold text-silver-500 hover:text-forest-500 transition-colors flex items-center gap-2"
        >
          <svg className={`w-4 h-4 transition-transform duration-300 ${showAdvanced ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
          </svg>
          {showAdvanced ? 'Hide Advanced Options' : 'Advanced Options'}
        </button>
      </div>

      {showAdvanced && (
        <div className="space-y-4 sm:space-y-5 animate-fadeIn p-5 bg-silver-50/50 rounded-2xl border border-silver-100">
          <CustomAliasToggle checked={showCustomAlias} onChange={handleAliasToggle} />
      {showCustomAlias && <CustomAliasField value={customAlias} onChange={setCustomAlias} />}

      <ExpirationSelect value={expiresIn} onChange={setExpiresIn} onNonCustomSelected={() => setIsCalendarOpen(false)} />

      {expiresIn === 'custom' && (
        <CustomExpirationField
          calendarPanelRef={calendarPanelRef}
          isOpen={isCalendarOpen}
          value={customExpiresDate}
          onChange={handleDateChange}
          onClose={() => setIsCalendarOpen(false)}
          onToggle={() => setIsCalendarOpen((open) => !open)}
        />
      )}
      </div>
      )}

      {error && <div className="animate-fadeIn rounded-2xl border border-apple-200 bg-apple-50 px-5 py-4 text-sm font-medium text-apple-600">{error}</div>}
    </form>
  );
};

export default UrlShortenerFields;
