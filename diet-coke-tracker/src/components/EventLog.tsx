import { motion, AnimatePresence } from 'framer-motion';
import { Zap, ShieldCheck, Trash2 } from 'lucide-react';
import type { DCEvent } from '../types';
import { formatTimestamp } from '../utils';
import { useState } from 'react';

interface Props {
  events: DCEvent[];
  onDelete: (id: string) => void;
}

const PAGE_SIZE = 20;

export default function EventLog({ events, onDelete }: Props) {
  const [page, setPage] = useState(1);
  const [hoverId, setHoverId] = useState<string | null>(null);

  const visible = events.slice(0, page * PAGE_SIZE);
  const hasMore = events.length > visible.length;

  if (events.length === 0) {
    return (
      <div className="text-center py-12 text-zinc-600 text-sm">
        No entries yet. Hit a button above to start tracking.
      </div>
    );
  }

  return (
    <div>
      <AnimatePresence initial={false}>
        {visible.map((event, i) => (
          <motion.div
            key={event.id}
            initial={{ opacity: 0, x: -12 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 12, height: 0 }}
            transition={{ delay: i < 3 ? i * 0.05 : 0, duration: 0.25 }}
            className="relative flex items-start gap-3 py-3 group"
            onMouseEnter={() => setHoverId(event.id)}
            onMouseLeave={() => setHoverId(null)}
          >
            {/* Timeline line */}
            {i < visible.length - 1 && (
              <div className="absolute left-4 top-8 bottom-0 w-px bg-zinc-800" />
            )}

            {/* Icon */}
            <div className={`relative z-10 flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
              event.type === 'drank'
                ? 'bg-[#e8001d]/15 text-[#e8001d]'
                : 'bg-emerald-500/15 text-emerald-400'
            }`}>
              {event.type === 'drank'
                ? <Zap size={13} />
                : <ShieldCheck size={13} />
              }
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <div className="flex items-baseline justify-between gap-2">
                <span className={`text-sm font-medium ${
                  event.type === 'drank' ? 'text-zinc-100' : 'text-emerald-400'
                }`}>
                  {event.type === 'drank' ? 'Drank a Diet Coke' : 'Resisted a Diet Coke'}
                </span>
                <span className="text-[11px] text-zinc-600 flex-shrink-0">
                  {formatTimestamp(event.timestamp)}
                </span>
              </div>
              <p className="text-xs text-zinc-500 mt-0.5">{event.reason}</p>
              {event.notes && (
                <p className="text-xs text-zinc-400 mt-1.5 leading-relaxed bg-zinc-800/60 rounded-lg px-3 py-2 border-l-2 border-zinc-700">
                  {event.notes}
                </p>
              )}
            </div>

            {/* Delete button */}
            <AnimatePresence>
              {hoverId === event.id && (
                <motion.button
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  onClick={() => onDelete(event.id)}
                  className="flex-shrink-0 text-zinc-600 hover:text-red-400 transition-colors"
                >
                  <Trash2 size={13} />
                </motion.button>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </AnimatePresence>

      {hasMore && (
        <button
          onClick={() => setPage(p => p + 1)}
          className="mt-2 w-full text-xs text-zinc-600 hover:text-zinc-400 py-2 transition-colors"
        >
          Load {Math.min(PAGE_SIZE, events.length - visible.length)} more
        </button>
      )}
    </div>
  );
}
