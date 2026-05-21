import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import type { TimelinePoint } from '../../hooks/useAnalytics';

interface ClicksTimelineChartProps {
  data: TimelinePoint[];
}

const formatDate = (dateStr: string) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

const CustomTooltip = ({ active, payload, label }: { active?: boolean; payload?: { value: number; dataKey: string }[]; label?: string }) => {
  if (!active || !payload?.length || !label) return null;
  return (
    <div className="rounded-xl border border-silver-200 bg-white px-4 py-3 shadow-lg">
      <p className="mb-1 text-xs font-bold text-silver-900">{formatDate(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs text-silver-600">
          {entry.dataKey === 'clicks' ? 'Clicks' : 'Links'}: <span className="font-bold">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const ClicksTimelineChart = ({ data }: ClicksTimelineChartProps) => (
  <div className="rounded-2xl border border-silver-100 bg-white p-5">
    <h3 className="mb-4 text-sm font-bold uppercase tracking-widest text-silver-500">Activity Timeline</h3>
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.15} />
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 11, fill: '#9ca3af', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#1e40af"
            strokeWidth={2.5}
            fill="url(#clicksGradient)"
            dot={false}
            activeDot={{ r: 5, fill: '#1e40af', stroke: '#fff', strokeWidth: 2 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ClicksTimelineChart;
