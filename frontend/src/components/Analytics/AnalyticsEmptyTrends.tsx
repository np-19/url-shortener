const AnalyticsEmptyTrends = () => (
  <div className="flex flex-1 flex-col items-center justify-center rounded-3xl border border-dashed border-silver-200 bg-beige-50/50 p-6 text-center">
    <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full border border-silver-100 bg-white shadow-sm">
      <svg className="h-6 w-6 text-silver-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
      </svg>
    </div>
    <h3 className="mb-1 text-sm font-bold text-silver-900">No trends yet</h3>
    <p className="text-xs font-medium text-silver-500">URLs will appear as they get clicks</p>
  </div>
);

export default AnalyticsEmptyTrends;
