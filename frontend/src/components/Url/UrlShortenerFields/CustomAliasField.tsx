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
    const base = "w-full rounded-xl border px-4 py-2.5 text-sm font-semibold transition-all placeholder-silver-400 outline-none focus:outline-none sm:text-base";
    if (checking) {
      return `${base} border-silver-200 bg-silver-50 text-silver-500 focus:border-forest-400 focus:ring-1 focus:ring-forest-500/10`;
    }
    if (error) {
      return `${base} border-apple-300 bg-apple-50/10 text-apple-600 focus:border-apple-500 focus:ring-1 focus:ring-apple-500/10`;
    }
    if (available && value.trim().length > 0) {
      return `${base} border-green-300 bg-green-50/10 text-green-600 focus:border-green-500 focus:ring-1 focus:ring-green-500/10`;
    }
    return `${base} border-silver-200 bg-white text-silver-800 shadow-2xs focus:border-forest-400 focus:ring-1 focus:ring-forest-500/10`;
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
