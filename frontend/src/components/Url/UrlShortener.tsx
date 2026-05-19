import Toast from '../Toast';
import { useCopyToast } from '../../hooks/useCopyToast';
import { useUrlShortenerForm } from '../../hooks/useUrlShortenerForm';
import UrlShortenerFields from './UrlShortenerFields';
import UrlShortenerResult from './UrlShortenerResult';

interface UrlShortenerProps {
  onUrlCreated: () => void;
}

const UrlShortener = ({ onUrlCreated }: UrlShortenerProps) => {
  const { toast, setToast, copyText } = useCopyToast();
  const {
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
    shortUrl,
    loading,
    error,
    handleSubmit,
  } = useUrlShortenerForm(onUrlCreated);

  return (
    <div className="relative z-30 mx-auto overflow-visible rounded-[2.5rem] border border-white bg-white/80 px-6 pb-6 pt-4 shadow-[0_20px_60px_-15px_rgba(107,114,128,0.15)] backdrop-blur-xl animate-scaleIn sm:px-8 sm:pb-8 sm:pt-5 lg:px-10 lg:pb-10 lg:pt-6">
      <div className="overflow-hidden rounded-t-[2.5rem] -mx-6 -mt-4 sm:-mx-8 sm:-mt-5 lg:-mx-10 lg:-mt-6">
        <div className="h-1.5 w-full bg-linear-to-r from-forest-200 via-forest-500 to-forest-200" />
        <div className="px-6 pb-1 pt-3 sm:px-8 sm:pt-4 lg:px-10 lg:pt-4">
          <h2 className="font-extrabold tracking-tight text-silver-900" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)' }}>
            Shorten Your URL
          </h2>
        </div>
      </div>

      <UrlShortenerFields
        url={url}
        setUrl={setUrl}
        customAlias={customAlias}
        setCustomAlias={setCustomAlias}
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

      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  );
};

export default UrlShortener;