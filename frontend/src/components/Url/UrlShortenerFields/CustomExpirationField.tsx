import CalendarDialog from './CalendarDialog';

interface CustomExpirationFieldProps {
  calendarPanelRef: React.RefObject<HTMLDivElement | null>;
  isOpen: boolean;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
  onToggle: () => void;
}

const CustomExpirationField = ({ calendarPanelRef, isOpen, value, onChange, onClose, onToggle }: CustomExpirationFieldProps) => (
  <div className="relative">
    <label htmlFor="customExpiresDate" className="mb-2 block text-sm font-semibold text-silver-700">
      Custom expiration date
    </label>
    <button
      id="customExpiresDate"
      type="button"
      onClick={onToggle}
      className="flex w-full items-center justify-between rounded-2xl border-none bg-beige-50 px-5 py-3 text-left text-sm font-medium text-silver-900 shadow-inner outline-none transition-all hover:bg-silver-100 focus:bg-white focus:shadow-md focus:ring-2 focus:ring-forest-500/20 sm:text-base"
    >
      <span>{value ? new Date(`${value}T00:00:00`).toLocaleDateString() : 'Choose a date'}</span>
      <svg className="h-5 w-5 text-silver-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
      </svg>
    </button>

    {isOpen && <CalendarDialog panelRef={calendarPanelRef} value={value} onChange={onChange} onClose={onClose} />}
  </div>
);

export default CustomExpirationField;
