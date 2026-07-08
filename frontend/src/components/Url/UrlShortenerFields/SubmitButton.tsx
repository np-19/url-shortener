interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton = ({ loading }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="flex items-center justify-center whitespace-nowrap rounded-xl bg-forest-500 px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base border border-forest-600/10 shadow-xs active:scale-98"
  >
    {loading ? 'Shortening...' : 'Shorten'}
  </button>
);

export default SubmitButton;
