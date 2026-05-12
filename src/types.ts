export type EventType = 'drank' | 'resisted';

export interface DCEvent {
  id: string;
  type: EventType;
  reason: string;
  notes?: string;
  timestamp: string; // ISO string
}

export interface DayStats {
  date: string; // YYYY-MM-DD
  drank: number;
  resisted: number;
}
