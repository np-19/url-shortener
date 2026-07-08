interface CustomAliasFieldProps {
  value: string;
  onChange: (value: string) => void;
  onBlur: () => void;
  error: string;
  checking: boolean;
  available: boolean | null;
}

const CustomAliasField = ({ value, onChange, onBlur, error, checking, available }: CustomAliasFieldProps) => (
  <div className="animate-fadeIn">
    <input
      type="text"
      id="customAlias"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      onBlur={onBlur}
      placeholder="my-project, awesome-link, etc."
      className="w-full rounded-2xl border-none bg-beige-50 px-5 py-3 text-sm font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-forest-500/20 sm:text-base"
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

export default CustomAliasField;
