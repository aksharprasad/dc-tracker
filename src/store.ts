import { useState, useCallback } from 'react';
import type { DCEvent, EventType } from './types';

const STORAGE_KEY = 'dc-tracker-events';

function loadEvents(): DCEvent[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function saveEvents(events: DCEvent[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
}

export function useStore() {
  const [events, setEvents] = useState<DCEvent[]>(loadEvents);

  const addEvent = useCallback((type: EventType, reason: string, notes?: string) => {
    const event: DCEvent = {
      id: crypto.randomUUID(),
      type,
      reason: reason.trim() || (type === 'drank' ? 'No reason given' : 'Pure willpower'),
      notes: notes?.trim() || undefined,
      timestamp: new Date().toISOString(),
    };
    setEvents(prev => {
      const next = [event, ...prev];
      saveEvents(next);
      return next;
    });
    return event;
  }, []);

  const deleteEvent = useCallback((id: string) => {
    setEvents(prev => {
      const next = prev.filter(e => e.id !== id);
      saveEvents(next);
      return next;
    });
  }, []);

  return { events, addEvent, deleteEvent };
}
