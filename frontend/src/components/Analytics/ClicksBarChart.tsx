import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import type { DistributionItem } from '../../hooks/useAnalytics';

interface ClicksBarChartProps {
  data: DistributionItem[];
}

const COLORS = ['#1e40af', '#2563eb', '#3b82f6', '#60a5fa', '#93bbfd', '#bfdbfe', '#dbeafe', '#eff6ff', '#f0f4ff', '#f5f7ff'];

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { value: number; payload: DistributionItem }[] }) => {
  if (!active || !payload?.length) return null;
  const item = payload[0];
  return (
    <div className="rounded-xl border border-silver-200 bg-white/95 px-3.5 py-2.5 shadow-sm backdrop-blur-xs">
      <p className="mb-0.5 text-xs font-bold text-silver-900">/{item.payload.shortId}</p>
      <p className="text-xs text-silver-500">
        Clicks: <span className="font-bold text-forest-500">{item.value}</span>
      </p>
    </div>
  );
};

const ClicksBarChart = ({ data }: ClicksBarChartProps) => (
  <div className="rounded-2xl border border-silver-200 bg-white/80 p-5 backdrop-blur-sm shadow-xs">
    <h3 className="mb-4 text-[10px] font-bold uppercase tracking-wider text-silver-450">Top Links by Clicks</h3>
    <div className="h-52">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
          <CartesianGrid stroke="#f3f4f6" vertical={false} />
          <XAxis
            dataKey="shortId"
            tickFormatter={(v: string) => `/${v.length > 6 ? v.slice(0, 6) + '…' : v}`}
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            interval={0}
            minTickGap={20}
          />
          <YAxis
            tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 500 }}
            tickLine={false}
            axisLine={false}
            allowDecimals={false}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(30, 64, 175, 0.03)' }} />
          <Bar dataKey="clicks" radius={[4, 4, 0, 0]} maxBarSize={40}>
            {data.map((_, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  </div>
);

export default ClicksBarChart;
