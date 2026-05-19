interface CustomAliasToggleProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
}

const CustomAliasToggle = ({ checked, onChange }: CustomAliasToggleProps) => (
  <div className="flex items-center gap-3">
    <button
      type="button"
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-7 w-12 items-center rounded-full transition-all duration-300 sm:h-8 sm:w-14 ${
        checked ? 'bg-forest-500 shadow-[0_0_10px_rgba(53,144,77,0.25)]' : 'bg-forest-50'
      }`}
    >
      <span className={`inline-block h-5 w-5 rounded-full ${!checked ? 'bg-forest-500' : 'bg-silver-300' } shadow-md transition-all duration-300 sm:h-6 sm:w-6 ${checked ? 'translate-x-6 sm:translate-x-7' : 'translate-x-1'}`} />
    </button>
    <label className="cursor-pointer select-none text-sm font-semibold text-silver-700">Custom Alias</label>
  </div>
);

export default CustomAliasToggle;
