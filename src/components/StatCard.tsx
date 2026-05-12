import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface Props {
  label: string;
  drank: number;
  resisted: number;
  icon: LucideIcon;
  delay?: number;
}

export default function StatCard({ label, drank, resisted, icon: Icon, delay = 0 }: Props) {
  const total = drank + resisted;
  const resistPct = total > 0 ? Math.round((resisted / total) * 100) : 0;

  return (
    <motion.div
      className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-zinc-500 uppercase tracking-widest font-medium">{label}</span>
        <Icon size={14} className="text-zinc-600" />
      </div>

      <div className="flex items-end justify-between gap-4 mb-4">
        <div>
          <div className="text-3xl font-bold text-zinc-100 tabular-nums leading-none">{drank}</div>
          <div className="text-xs text-zinc-500 mt-1">drank</div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-emerald-400 tabular-nums leading-none">{resisted}</div>
          <div className="text-xs text-zinc-500 mt-1">resisted</div>
        </div>
      </div>

      {/* Progress bar */}
      <div className="h-1.5 bg-zinc-800 rounded-full overflow-hidden">
        {total > 0 && (
          <motion.div
            className="h-full bg-emerald-500 rounded-full"
            initial={{ width: 0 }}
            animate={{ width: `${resistPct}%` }}
            transition={{ delay: delay + 0.2, duration: 0.6, ease: 'easeOut' }}
          />
        )}
      </div>
      <div className="flex justify-between mt-1.5">
        <span className="text-[10px] text-zinc-600">{total === 0 ? 'No data' : `${100 - resistPct}% drank`}</span>
        <span className="text-[10px] text-zinc-600">{total > 0 ? `${resistPct}% resisted` : ''}</span>
      </div>
    </motion.div>
  );
}
