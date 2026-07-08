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
    <div className="rounded-xl border border-silver-200 bg-white/95 px-3.5 py-2.5 shadow-sm backdrop-blur-xs">
      <p className="mb-1 text-[11px] font-bold text-silver-900">{formatDate(label)}</p>
      {payload.map((entry) => (
        <p key={entry.dataKey} className="text-xs text-silver-500">
          {entry.dataKey === 'clicks' ? 'Clicks' : 'Links'}: <span className="font-bold text-forest-500">{entry.value}</span>
        </p>
      ))}
    </div>
  );
};

const ClicksTimelineChart = ({ data }: ClicksTimelineChartProps) => (
  <div className="rounded-2xl border border-silver-200 bg-white/80 p-5 backdrop-blur-sm shadow-xs">
    <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-silver-450">Activity Timeline</h3>
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="clicksGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#1e40af" stopOpacity={0.1} />
              <stop offset="95%" stopColor="#1e40af" stopOpacity={0} />
            </linearGradient>
          </defs>
          <CartesianGrid stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="date"
            tickFormatter={formatDate}
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            interval="preserveStartEnd"
            minTickGap={40}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="clicks"
            stroke="#1e40af"
            strokeWidth={2}
            fill="url(#clicksGradient)"
            dot={false}
            activeDot={{ r: 4, fill: '#1e40af', stroke: '#fff', strokeWidth: 1.5 }}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ClicksTimelineChart;
