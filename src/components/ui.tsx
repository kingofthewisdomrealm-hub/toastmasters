import { useEffect, type ReactNode } from 'react';
import type { ReqStatus } from '../data/types';

export function Bar({ pct, slim, good }: { pct: number; slim?: boolean; good?: boolean }) {
  return (
    <div className={`bar${slim ? ' slim' : ''}${good ? ' good' : ''}`} role="progressbar" aria-valuenow={pct}>
      <i style={{ width: `${Math.max(0, Math.min(100, pct))}%` }} />
    </div>
  );
}

export function Badge({ children, tone }: { children: ReactNode; tone?: 'blue' | 'green' | 'amber' | 'red' }) {
  return <span className={`badge${tone ? ' ' + tone : ''}`}>{children}</span>;
}

export function Head({ title, sub, right }: { title: string; sub?: string; right?: ReactNode }) {
  return (
    <div className="page-head">
      <div>
        <h1>{title}</h1>
        {sub && <div className="sub">{sub}</div>}
      </div>
      {right}
    </div>
  );
}

export function Drawer({ open, onClose, children }: { open: boolean; onClose: () => void; children: ReactNode }) {
  useEffect(() => {
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', k);
    return () => window.removeEventListener('keydown', k);
  }, [onClose]);
  if (!open) return null;
  return (
    <>
      <div className="drawer-bg" onClick={onClose} />
      <aside className="drawer">
        <div className="row between" style={{ marginBottom: 8 }}>
          <span />
          <button className="btn ghost" onClick={onClose} aria-label="Close">✕</button>
        </div>
        {children}
      </aside>
    </>
  );
}

export function Ext({ href, children }: { href?: string | null; children?: ReactNode }) {
  if (!href) return <span className="muted">—</span>;
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children ?? href.replace(/^https?:\/\/(www\.)?/, '').slice(0, 48)}
    </a>
  );
}

export const statusLabel: Record<ReqStatus, string> = {
  done: 'Done',
  in_progress: 'In progress',
  not_started: 'Not started',
  unknown: 'Confirm',
};

export function Check({ s }: { s: ReqStatus }) {
  return <span className={`check ${s}`}>{s === 'done' ? '✓' : s === 'unknown' ? '?' : ''}</span>;
}

export function Chips<T extends string>({ value, options, onChange, all = 'All' }: { value: T | ''; options: readonly T[]; onChange: (v: T | '') => void; all?: string }) {
  return (
    <div className="row" style={{ gap: 6 }}>
      <button className={`chip${value === '' ? ' on' : ''}`} onClick={() => onChange('')}>{all}</button>
      {options.map((o) => (
        <button key={o} className={`chip${value === o ? ' on' : ''}`} onClick={() => onChange(o)}>{o}</button>
      ))}
    </div>
  );
}
