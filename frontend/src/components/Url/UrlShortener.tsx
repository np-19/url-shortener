import { useCopyToast } from '../../hooks/useCopyToast';
import { useUrlShortenerForm } from '../../hooks/useUrlShortenerForm';
import UrlShortenerFields from './UrlShortenerFields';
import UrlShortenerResult from './UrlShortenerResult';

interface UrlShortenerProps {
  onUrlCreated: () => void;
}

const UrlShortener = ({ onUrlCreated }: UrlShortenerProps) => {
  const { copyText } = useCopyToast();
  const {
    url,
    setUrl,
    customAlias,
    setCustomAlias,
    onCustomAliasBlur,
    customAliasError,
    customAliasChecking,
    customAliasAvailable,
    showCustomAlias,
    setShowCustomAlias,
    expiresIn,
    setExpiresIn,
    customExpiresDate,
    setCustomExpiresDate,
    shortUrl,
    loading,
    error,
    handleSubmit,
  } = useUrlShortenerForm(onUrlCreated);

  return (
    <div className="relative z-30 mx-auto overflow-visible rounded-2xl border border-silver-200 bg-white/80 p-5 shadow-xs backdrop-blur-md animate-scaleIn sm:p-7">
      <h2 className="text-xl font-bold tracking-tight text-silver-900 mb-5 sm:text-2xl">
        Shorten Your URL
      </h2>
      <UrlShortenerFields
        url={url}
        setUrl={setUrl}
        customAlias={customAlias}
        setCustomAlias={setCustomAlias}
        onCustomAliasBlur={onCustomAliasBlur}
        customAliasError={customAliasError}
        customAliasChecking={customAliasChecking}
        customAliasAvailable={customAliasAvailable}
        showCustomAlias={showCustomAlias}
        setShowCustomAlias={setShowCustomAlias}
        expiresIn={expiresIn}
        setExpiresIn={setExpiresIn}
        customExpiresDate={customExpiresDate}
        setCustomExpiresDate={setCustomExpiresDate}
        error={error}
        loading={loading}
        onSubmit={handleSubmit}
      />

      {shortUrl && <UrlShortenerResult shortUrl={shortUrl} onCopy={() => copyText(shortUrl)} />}

    </div>
  );
};

export default UrlShortener;