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
      className="w-full rounded-2xl border-none bg-beige-50 px-5 py-4 text-sm font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-forest-500/20 sm:text-base"
    />
  </div>
);

export default UrlInputField;
