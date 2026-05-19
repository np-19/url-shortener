interface SubmitButtonProps {
  loading: boolean;
}

const SubmitButton = ({ loading }: SubmitButtonProps) => (
  <button
    type="submit"
    disabled={loading}
    className="mt-4 flex w-full items-center justify-center rounded-2xl bg-forest-500 px-6 py-3.5 text-sm font-semibold text-white shadow-soft transition-all duration-300 hover:-translate-y-0.5 hover:bg-forest-600 disabled:cursor-not-allowed disabled:opacity-50 sm:text-base"
  >
    {loading ? 'Shortening...' : 'Shorten URL'}
  </button>
);

export default SubmitButton;
