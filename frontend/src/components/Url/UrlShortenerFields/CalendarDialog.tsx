import CustomCalendar from '../CustomCalendar';

interface CalendarDialogProps {
  panelRef: React.RefObject<HTMLDivElement | null>;
  value: string;
  onChange: (value: string) => void;
  onClose: () => void;
}

const CalendarDialog = ({ panelRef, value, onChange, onClose }: CalendarDialogProps) => (
  <div className="fixed inset-0 z-50 flex items-start justify-center bg-silver-950/15 px-3 py-5 backdrop-blur-[2px] sm:py-8">
    <button type="button" className="absolute inset-0 cursor-default" aria-label="Close calendar overlay" onClick={onClose} />
    <div ref={panelRef} className="mt-12 w-full max-w-[19rem] sm:mt-14 sm:max-w-[21rem]">
      <div className="overflow-hidden rounded-[1.6rem] border border-white bg-white shadow-[0_24px_70px_-20px_rgba(15,23,42,0.3)] animate-scaleIn">
        <div className="flex items-center justify-between border-b border-silver-100 px-4 py-3">
          <div>
            <p className="text-xs font-bold text-silver-900 sm:text-sm">Pick expiration date</p>
            <p className="text-[11px] text-silver-500 sm:text-xs">Choose a future day for this URL</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-full border border-silver-200 bg-beige-50 p-1.5 text-silver-500 transition-colors hover:bg-silver-50 hover:text-silver-700" aria-label="Close calendar">
            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="p-3 sm:p-4">
          <CustomCalendar value={value} onChange={onChange} />
        </div>
      </div>
    </div>
  </div>
);

export default CalendarDialog;
