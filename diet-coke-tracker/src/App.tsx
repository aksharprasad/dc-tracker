import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, ShieldCheck, Calendar, BarChart2, List, TrendingUp } from 'lucide-react';
import { useStore } from './store';
import { getStats, getLast30DaysChart, getStreaks } from './utils';
import type { EventType } from './types';
import LogModal from './components/LogModal';
import StatCard from './components/StatCard';
import Chart from './components/Chart';
import EventLog from './components/EventLog';
import BubbleField from './components/BubbleField';
import FizzEffect from './components/FizzEffect';
import StreakBadge from './components/StreakBadge';

type Tab = 'dashboard' | 'log';

export default function App() {
  const { events, addEvent, deleteEvent } = useStore();
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState<EventType>('drank');
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [fizzTrigger, setFizzTrigger] = useState(0);
  const [fizzType, setFizzType] = useState<EventType | null>(null);
  const headerRef = useRef<HTMLDivElement>(null);

  const stats = getStats(events);
  const chartData = getLast30DaysChart(events);
  const { resistStreak, soberDays } = getStreaks(events);

  const openModal = (type: EventType) => {
    setModalType(type);
    setModalOpen(true);
  };

  const handleSubmit = (type: EventType, reason: string, notes: string) => {
    addEvent(type, reason, notes);
    setFizzType(type);
    setFizzTrigger(t => t + 1);
    if (activeTab !== 'dashboard') setActiveTab('dashboard');
  };

  const totalDrank = events.filter(e => e.type === 'drank').length;
  const totalResisted = events.filter(e => e.type === 'resisted').length;

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      <FizzEffect trigger={fizzTrigger} type={fizzType} />
      <LogModal
        open={modalOpen}
        defaultType={modalType}
        onClose={() => setModalOpen(false)}
        onSubmit={handleSubmit}
      />

      {/* Header */}
      <header ref={headerRef} className="relative border-b border-zinc-800/60 overflow-hidden">
        <BubbleField active={true} />
        <div className="relative z-10 max-w-2xl mx-auto px-4 pt-10 pb-8">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center gap-2 mb-1">
              <div className="w-6 h-6 rounded-full bg-[#e8001d] flex items-center justify-center">
                <span className="text-white text-xs font-black">DC</span>
              </div>
              <span className="text-xs text-zinc-600 uppercase tracking-widest font-medium">Diet Coke Tracker</span>
            </div>
            <h1 className="text-3xl font-bold text-zinc-100 mb-4">
              Your Diet Coke<br />
              <span className="text-[#e8001d]">habit</span>, tracked.
            </h1>

            <StreakBadge resistStreak={resistStreak} soberDays={soberDays} />
          </motion.div>
        </div>
      </header>

      {/* CTA Buttons */}
      <div className="max-w-2xl mx-auto px-4">
        <motion.div
          className="flex gap-3 -mt-0 py-5"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15, duration: 0.4 }}
        >
          <button
            onClick={() => openModal('drank')}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-[#e8001d] hover:bg-[#c5001a] active:scale-95 text-white font-semibold rounded-2xl transition-all text-sm"
          >
            <Zap size={16} />
            I Drank One
          </button>
          <button
            onClick={() => openModal('resisted')}
            className="flex-1 flex items-center justify-center gap-2.5 py-4 bg-emerald-600 hover:bg-emerald-500 active:scale-95 text-white font-semibold rounded-2xl transition-all text-sm"
          >
            <ShieldCheck size={16} />
            I Resisted
          </button>
        </motion.div>
      </div>

      {/* Tab nav */}
      <div className="max-w-2xl mx-auto px-4">
        <div className="flex gap-1 bg-zinc-900 border border-zinc-800 rounded-xl p-1 mb-5">
          {(['dashboard', 'log'] as Tab[]).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 rounded-lg text-sm font-medium transition-all ${
                activeTab === tab
                  ? 'bg-zinc-800 text-zinc-100'
                  : 'text-zinc-500 hover:text-zinc-300'
              }`}
            >
              {tab === 'dashboard' ? <BarChart2 size={13} /> : <List size={13} />}
              {tab === 'dashboard' ? 'Dashboard' : 'Event Log'}
            </button>
          ))}
        </div>
      </div>

      {/* Content */}
      <div className="max-w-2xl mx-auto px-4 pb-16">
        {activeTab === 'dashboard' && (
          <motion.div
            key="dashboard"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          >
            {/* Total lifetime */}
            <motion.div
              className="flex items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-2xl mb-4"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
            >
              <div className="flex items-center gap-2 text-xs text-zinc-500 uppercase tracking-widest">
                <TrendingUp size={12} />
                All time
              </div>
              <div className="flex gap-5 text-sm">
                <span>
                  <span className="text-[#e8001d] font-bold tabular-nums">{totalDrank}</span>
                  <span className="text-zinc-600 ml-1.5">drank</span>
                </span>
                <span>
                  <span className="text-emerald-400 font-bold tabular-nums">{totalResisted}</span>
                  <span className="text-zinc-600 ml-1.5">resisted</span>
                </span>
              </div>
            </motion.div>

            {/* Stat cards */}
            <div className="grid grid-cols-3 gap-3 mb-5">
              <StatCard
                label="Today"
                drank={stats.today.drank}
                resisted={stats.today.resisted}
                icon={Calendar}
                delay={0.1}
              />
              <StatCard
                label="This Week"
                drank={stats.week.drank}
                resisted={stats.week.resisted}
                icon={Calendar}
                delay={0.15}
              />
              <StatCard
                label="This Month"
                drank={stats.month.drank}
                resisted={stats.month.resisted}
                icon={Calendar}
                delay={0.2}
              />
            </div>

            {/* Chart */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 mb-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-sm font-semibold text-zinc-300">Last 14 days</h2>
                <span className="text-xs text-zinc-600">Daily breakdown</span>
              </div>
              <Chart data={chartData} />
            </motion.div>

            {/* Recent events preview */}
            <motion.div
              className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-3">
                <h2 className="text-sm font-semibold text-zinc-300">Recent entries</h2>
                <button
                  onClick={() => setActiveTab('log')}
                  className="text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  View all →
                </button>
              </div>
              <EventLog events={events.slice(0, 5)} onDelete={deleteEvent} />
            </motion.div>
          </motion.div>
        )}

        {activeTab === 'log' && (
          <motion.div
            key="log"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
            className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5"
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-semibold text-zinc-300">All entries</h2>
              <span className="text-xs text-zinc-600">{events.length} total</span>
            </div>
            <EventLog events={events} onDelete={deleteEvent} />
          </motion.div>
        )}
      </div>
    </div>
  );
}
