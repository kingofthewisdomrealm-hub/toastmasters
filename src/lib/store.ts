import { useSyncExternalStore } from 'react';
import type { LogEntry, OutreachRecord, ReqStatus, Speech } from '../data/types';

// Everything Josias changes lives here. Saved to this browser; Export/Import moves it between devices.
export type AppState = {
  version: 1;
  reqStatus: Record<string, ReqStatus>;
  reqNotes: Record<string, string>;
  outreach: Record<string, OutreachRecord>;
  log: LogEntry[];
  speechEdits: Record<string, Partial<Speech>>;
  favorites: string[]; // club ids
  activeSpeechId: string;
};

const KEY = 'accredited-speaker-dashboard-v1';

const initial: AppState = {
  version: 1,
  reqStatus: {},
  reqNotes: {},
  outreach: {},
  log: [],
  speechEdits: {},
  favorites: [],
  activeSpeechId: 'missing-piece',
};

function load(): AppState {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) return { ...initial, ...JSON.parse(raw) };
  } catch {
    /* storage unavailable: run in memory */
  }
  return initial;
}

let state: AppState = load();
const listeners = new Set<() => void>();

export function setState(fn: (s: AppState) => AppState) {
  state = fn(state);
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
  listeners.forEach((l) => l());
}

export function useStore(): AppState {
  return useSyncExternalStore(
    (l) => {
      listeners.add(l);
      return () => listeners.delete(l);
    },
    () => state,
  );
}

export function exportState() {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `speaker-dashboard-backup-${new Date().toISOString().slice(0, 10)}.json`;
  a.click();
  URL.revokeObjectURL(a.href);
}

export async function importState(file: File) {
  const text = await file.text();
  const parsed = JSON.parse(text);
  if (parsed?.version !== 1) throw new Error('Not a dashboard backup file');
  setState(() => ({ ...initial, ...parsed }));
}

export const uid = () => Math.random().toString(36).slice(2, 10);
