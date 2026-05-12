import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap, ShieldCheck } from 'lucide-react';
import type { EventType } from '../types';

interface Props {
  open: boolean;
  defaultType: EventType;
  onClose: () => void;
  onSubmit: (type: EventType, reason: string, notes: string) => void;
}

const DRANK_REASONS = [
  'Needed a caffeine hit',
  'Long meeting',
  'It was right there',
  'Celebrating something',
  'Just wanted one',
  'Stressful day',
  'Post-workout',
  'Social situation',
];

const RESISTED_REASONS = [
  'Drinking more water instead',
  'Trying to cut back',
  'Health goals',
  'Already had enough today',
  'Feeling strong today',
  'Replaced with tea/coffee',
  "Just didn't feel like it",
  'Friend bet',
];

export default function LogModal({ open, defaultType, onClose, onSubmit }: Props) {
  const [type, setType] = useState<EventType>(defaultType);
  const [reason, setReason] = useState('');
  const [notes, setNotes] = useState('');
  const notesRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (open) {
      setType(defaultType);
      setReason('');
      setNotes('');
    }
  }, [open, defaultType]);

  const quickReasons = type === 'drank' ? DRANK_REASONS : RESISTED_REASONS;

  const handleSubmit = () => {
    onSubmit(type, reason, notes);
    onClose();
  };

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            className="fixed inset-0 bg-black/70 z-40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.div
            className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 px-4"
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{ type: 'spring', stiffness: 380, damping: 30 }}
          >
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 max-h-[90vh] overflow-y-auto">
              <div className="flex items-center justify-between mb-5">
                <h2 className="text-lg font-semibold text-zinc-100">Log an entry</h2>
                <button
                  onClick={onClose}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Type toggle */}
              <div className="grid grid-cols-2 gap-2 mb-5">
                <button
                  onClick={() => setType('drank')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                    type === 'drank'
                      ? 'bg-[#e8001d] text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  <Zap size={15} />
                  I drank one
                </button>
                <button
                  onClick={() => setType('resisted')}
                  className={`flex items-center justify-center gap-2 py-3 rounded-xl font-medium text-sm transition-all ${
                    type === 'resisted'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
                >
                  <ShieldCheck size={15} />
                  I resisted
                </button>
              </div>

              {/* Quick reason chips */}
              <div className="mb-4">
                <label className="text-xs text-zinc-500 mb-2 block uppercase tracking-widest">
                  Quick reason
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {quickReasons.map(r => (
                    <button
                      key={r}
                      onClick={() => setReason(prev => prev === r ? '' : r)}
                      className={`text-xs px-3 py-1.5 rounded-full transition-all ${
                        reason === r
                          ? type === 'drank'
                            ? 'bg-[#e8001d]/20 text-[#e8001d] border border-[#e8001d]/40'
                            : 'bg-emerald-600/20 text-emerald-400 border border-emerald-600/40'
                          : 'bg-zinc-800 text-zinc-500 hover:text-zinc-300 border border-zinc-700'
                      }`}
                    >
                      {r}
                    </button>
                  ))}
                </div>
              </div>

              {/* Custom reason input */}
              <div className="mb-4">
                <input
                  type="text"
                  value={reason}
                  onChange={e => setReason(e.target.value)}
                  placeholder={type === 'drank' ? 'Or type your own reason…' : 'Or describe what helped…'}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors"
                  autoFocus
                />
              </div>

              {/* Notes / thoughts */}
              <div className="mb-5">
                <label className="text-xs text-zinc-500 mb-2 block uppercase tracking-widest">
                  Thoughts <span className="normal-case text-zinc-700">(optional)</span>
                </label>
                <textarea
                  ref={notesRef}
                  value={notes}
                  onChange={e => setNotes(e.target.value)}
                  placeholder={
                    type === 'drank'
                      ? 'How are you feeling about it? Any context…'
                      : 'What helped you stay strong? How do you feel?'
                  }
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-sm text-zinc-100 placeholder:text-zinc-600 outline-none focus:border-zinc-600 transition-colors resize-none leading-relaxed"
                />
              </div>

              <button
                onClick={handleSubmit}
                className={`w-full py-3 rounded-xl font-semibold text-sm transition-all active:scale-95 ${
                  type === 'drank'
                    ? 'bg-[#e8001d] hover:bg-[#c5001a] text-white'
                    : 'bg-emerald-600 hover:bg-emerald-500 text-white'
                }`}
              >
                {type === 'drank' ? 'Log the Diet Coke' : 'Log the Resistance'}
              </button>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
