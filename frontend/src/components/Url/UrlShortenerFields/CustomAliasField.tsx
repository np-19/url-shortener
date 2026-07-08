interface CustomAliasFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: string;
  checking: boolean;
  available: boolean | null;
}

const CustomAliasField = ({ value, onChange, onBlur, error, checking, available }: CustomAliasFieldProps) => {
  const getInputClassName = () => {
    const base = "w-full rounded-2xl border px-5 py-3 text-sm font-medium outline-none transition-all placeholder-silver-400 sm:text-base";
    if (checking) {
      return `${base} border-transparent bg-beige-50 text-silver-900 shadow-inner focus:bg-white focus:shadow-md focus:ring-2 focus:ring-forest-500/20`;
    }
    if (error) {
      return `${base} border-apple-500 bg-apple-50/20 text-apple-700 focus:bg-white focus:ring-2 focus:ring-apple-500/20`;
    }
    if (available && value.trim().length > 0) {
      return `${base} border-green-500 bg-green-50/20 text-green-700 focus:bg-white focus:ring-2 focus:ring-green-500/20`;
    }
    return `${base} border-transparent bg-beige-50 text-silver-900 shadow-inner focus:bg-white focus:shadow-md focus:ring-2 focus:ring-forest-500/20`;
  };

  return (
    <div className="animate-fadeIn">
      <input
        type="text"
        id="customAlias"
        value={value}
        onChange={(event) => onChange(event.target.value)}
        onBlur={onBlur}
        placeholder="my-project, awesome-link, etc."
        className={getInputClassName()}
      />
      <p className="mt-2 ml-2 text-xs font-medium text-silver-500">
        Use alphanumeric characters and hyphens only (2-50 characters)
      </p>
      {checking && <p className="mt-2 ml-2 text-xs font-medium text-silver-500">Checking alias availability...</p>}
      {error && <p className="mt-2 ml-2 text-xs font-medium text-apple-600">{error}</p>}
      {!checking && available && value.trim().length > 0 && (
        <p className="mt-2 ml-2 text-xs font-medium text-green-600">✓ Custom alias is available!</p>
      )}
    </div>
  );
};

export default CustomAliasField;
