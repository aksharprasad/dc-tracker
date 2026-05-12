import { motion } from 'framer-motion';
import { Flame, Shield } from 'lucide-react';

interface Props {
  resistStreak: number;
  soberDays: number;
}

export default function StreakBadge({ resistStreak, soberDays }: Props) {
  return (
    <div className="flex gap-3">
      <motion.div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
          soberDays > 0
            ? 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            : 'bg-zinc-800/50 border border-zinc-800 text-zinc-600'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <Shield size={14} />
        <span>{soberDays > 0 ? `${soberDays}d sober streak` : 'No sober streak'}</span>
      </motion.div>

      <motion.div
        className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium ${
          resistStreak > 0
            ? 'bg-amber-500/10 border border-amber-500/20 text-amber-400'
            : 'bg-zinc-800/50 border border-zinc-800 text-zinc-600'
        }`}
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.6 }}
      >
        <Flame size={14} />
        <span>{resistStreak > 0 ? `${resistStreak}d resist streak` : 'No resist streak'}</span>
      </motion.div>
    </div>
  );
}
