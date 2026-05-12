import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  ResponsiveContainer, CartesianGrid, Legend
} from 'recharts';
import type { DayStats } from '../types';
import { formatShortDate } from '../utils';

interface Props {
  data: DayStats[];
}

const CustomTooltip = ({ active, payload, label }: {
  active?: boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?: string;
}) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-xl px-3 py-2.5 text-xs">
      <div className="text-zinc-400 mb-2">{label}</div>
      {payload.map(p => (
        <div key={p.name} className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full" style={{ background: p.color }} />
          <span className="text-zinc-300">{p.name}: <span className="text-zinc-100 font-semibold">{p.value}</span></span>
        </div>
      ))}
    </div>
  );
};

export default function Chart({ data }: Props) {
  const displayData = data.slice(-14).map(d => ({
    ...d,
    label: formatShortDate(d.date),
  }));

  const hasData = displayData.some(d => d.drank > 0 || d.resisted > 0);

  if (!hasData) {
    return (
      <div className="h-48 flex items-center justify-center text-zinc-600 text-sm">
        No data yet — start logging
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={displayData} barSize={10} barGap={2}>
        <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#71717a', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          allowDecimals={false}
          tick={{ fill: '#71717a', fontSize: 10 }}
          axisLine={false}
          tickLine={false}
          width={20}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
        <Legend
          wrapperStyle={{ fontSize: 11, color: '#71717a', paddingTop: 8 }}
          formatter={(v: string) => v.charAt(0).toUpperCase() + v.slice(1)}
        />
        <Bar dataKey="drank" name="drank" fill="#e8001d" radius={[3, 3, 0, 0]} />
        <Bar dataKey="resisted" name="resisted" fill="#10b981" radius={[3, 3, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}
