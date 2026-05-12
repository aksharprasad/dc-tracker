import {
  startOfDay, startOfWeek, startOfMonth,
  format, parseISO, isAfter, eachDayOfInterval,
  subDays, endOfDay
} from 'date-fns';
import type { DCEvent, DayStats } from './types';

export function filterByRange(events: DCEvent[], start: Date, end: Date): DCEvent[] {
  return events.filter(e => {
    const d = parseISO(e.timestamp);
    return isAfter(d, start) && !isAfter(d, end);
  });
}

export function getStats(events: DCEvent[]) {
  const now = new Date();
  const todayStart = startOfDay(now);
  const weekStart = startOfWeek(now, { weekStartsOn: 1 });
  const monthStart = startOfMonth(now);

  const count = (evts: DCEvent[], type: 'drank' | 'resisted') =>
    evts.filter(e => e.type === type).length;

  const toEnd = endOfDay(now);

  const todayEvts = filterByRange(events, todayStart, toEnd);
  const weekEvts = filterByRange(events, weekStart, toEnd);
  const monthEvts = filterByRange(events, monthStart, toEnd);

  return {
    today: { drank: count(todayEvts, 'drank'), resisted: count(todayEvts, 'resisted') },
    week: { drank: count(weekEvts, 'drank'), resisted: count(weekEvts, 'resisted') },
    month: { drank: count(monthEvts, 'drank'), resisted: count(monthEvts, 'resisted') },
  };
}

export function getLast30DaysChart(events: DCEvent[]): DayStats[] {
  const now = new Date();
  const days = eachDayOfInterval({ start: subDays(now, 29), end: now });

  return days.map(day => {
    const dayStr = format(day, 'yyyy-MM-dd');
    const dayEvts = filterByRange(events, startOfDay(day), endOfDay(day));
    return {
      date: dayStr,
      drank: dayEvts.filter(e => e.type === 'drank').length,
      resisted: dayEvts.filter(e => e.type === 'resisted').length,
    };
  });
}

export function getStreaks(events: DCEvent[]) {
  const now = new Date();
  let resistStreak = 0;
  let soberDays = 0;

  for (let i = 0; i <= 365; i++) {
    const day = subDays(now, i);
    const dayEvts = filterByRange(events, startOfDay(day), endOfDay(day));
    const hasAny = dayEvts.length > 0;
    const drank = dayEvts.some(e => e.type === 'drank');
    const resisted = dayEvts.some(e => e.type === 'resisted');

    // A day only counts toward a streak if something was actually logged that day
    if (!hasAny) break;

    if (resisted && !drank) resistStreak++;
    if (!drank) soberDays++;
    else break;
  }

  return { resistStreak, soberDays };
}

export function formatTimestamp(iso: string): string {
  const d = parseISO(iso);
  return format(d, 'MMM d, h:mm a');
}

export function formatShortDate(dateStr: string): string {
  return format(parseISO(dateStr + 'T00:00:00'), 'MMM d');
}
