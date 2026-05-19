interface UrlInputFieldProps {
  value: string;
  onChange: (value: string) => void;
}

const UrlInputField = ({ value, onChange }: UrlInputFieldProps) => (
  <div>
    <label htmlFor="url" className="mb-2 block text-sm font-semibold text-silver-700">
      Enter your long URL
    </label>
    <input
      id="url"
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder="https://example.com/very-long-url"
      className="w-full rounded-2xl border border-silver-200 bg-beige-50 px-5 py-4 text-sm font-medium text-silver-900 shadow-inner outline-none transition-all placeholder-silver-400 focus:border-silver-400 focus:ring-4 focus:ring-silver-200 sm:text-base"
    />
  </div>
);

export default UrlInputField;
