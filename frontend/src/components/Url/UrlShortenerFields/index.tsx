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
    <form onSubmit={onSubmit} className="space-y-4 sm:space-y-5">
      <UrlInputField value={url} onChange={setUrl} />
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

      {error && <div className="animate-fadeIn rounded-2xl border border-apple-200 bg-apple-50 px-5 py-4 text-sm font-medium text-apple-600">{error}</div>}
      <SubmitButton loading={loading} />
    </form>
  );
};

export default UrlShortenerFields;
