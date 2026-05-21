interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton = ({ loading }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="flex items-center justify-center whitespace-nowrap rounded-2xl bg-forest-500 px-8 py-4 text-sm font-bold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-600 hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
  >
    {loading ? 'Shortening...' : 'Shorten'}
  </button>
);

export default SubmitButton;
