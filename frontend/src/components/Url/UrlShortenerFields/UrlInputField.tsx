interface UrlInputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const UrlInputField = ({ value, onChange }: UrlInputFieldProps) => (
  <div className="flex-1">
    <input
      id="url"
      type="url"
      required
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="Paste your long URL here..."
      className="w-full rounded-xl border border-silver-200 bg-white px-4 py-3 text-sm font-semibold text-silver-800 transition-all placeholder-silver-400 shadow-2xs focus:border-forest-400 focus:ring-1 focus:ring-forest-500/10 focus:outline-none sm:text-base"
    />
  </div>
);

export default UrlInputField;
