import clubsJson from '../data/clubs.json';
import oppsJson from '../data/opportunities.json';
import { requirements } from '../data/requirements';
import { roadmap } from '../data/roadmap';
import { speeches as seedSpeeches } from '../data/speeches';
import type { Club, LogEntry, Opportunity, ReqStatus, Speech } from '../data/types';
import type { AppState } from './store';
import { partsIn, ET, todayISO_ET } from './time';

export const clubs = clubsJson as Club[];
// Top first targets (best fit + easiest access), then by speaking-ladder level.
export const PRIORITY = ['opp-024', 'opp-037', 'opp-022', 'opp-034', 'opp-003', 'opp-004', 'opp-002', 'opp-014', 'opp-035', 'opp-038'];
const rank = (o: Opportunity) => (PRIORITY.includes(o.id) ? PRIORITY.indexOf(o.id) : 100 + o.ladderLevel);
export const opportunities = (oppsJson as Opportunity[]).slice().sort((a, b) => rank(a) - rank(b));

export function reqStatus(s: AppState, id: string): ReqStatus {
  return s.reqStatus[id] ?? requirements.find((r) => r.id === id)!.defaultStatus;
}

/** Engagement counts straight from the Speaking Log (only talks that meet AS rules). */
export function engagementCounts(log: LogEntry[]) {
  const q = log.filter(
    (e) => (e.kind === 'Outside speech' || e.kind === 'Workshop') && (e.minutes ?? 0) >= 20 && (e.audience ?? 0) >= 20,
  );
  return {
    total: q.length,
    paid: q.filter((e) => e.paid === 'fee' || e.paid === 'reimbursement').length,
    fee: q.filter((e) => e.paid === 'fee').length,
    all: log.filter((e) => e.kind === 'Outside speech' || e.kind === 'Workshop').length,
  };
}

/** Weighted progress. Engagement items earn partial credit from the log automatically. */
export function progress(s: AppState) {
  const c = engagementCounts(s.log);
  const auto: Record<string, number> = {
    'engagements-25': Math.min(1, c.total / 25),
    'paid-15': Math.min(1, c.paid / 15),
    'fee-8': Math.min(1, c.fee / 8),
  };
  let got = 0;
  let total = 0;
  let done = 0;
  for (const r of requirements) {
    total += r.weight;
    const st = reqStatus(s, r.id);
    let frac = st === 'done' ? 1 : st === 'in_progress' ? 0.4 : 0;
    if (r.id in auto) frac = Math.max(frac, auto[r.id]);
    if (frac >= 1) done++;
    got += r.weight * frac;
  }
  return { pct: Math.round((got / total) * 100), done, remaining: requirements.length - done, counts: c };
}

export function currentMonth(date = new Date()) {
  const p = partsIn(date, ET);
  const key = `${p.y}-${String(p.m).padStart(2, '0')}`;
  const idx = roadmap.findIndex((m) => m.key === key);
  if (idx >= 0) return { month: roadmap[idx], idx, week: Math.min(3, Math.floor((p.d - 1) / 7)) };
  // Before the roadmap starts (launch week) → month 1, week 1. After → last month.
  if (key < roadmap[0].key) return { month: roadmap[0], idx: 0, week: 0 };
  return { month: roadmap[roadmap.length - 1], idx: roadmap.length - 1, week: 3 };
}

export function mergedSpeeches(s: AppState): Speech[] {
  return seedSpeeches.map((sp) => ({ ...sp, ...(s.speechEdits[sp.id] ?? {}) }));
}

export function speechStats(s: AppState, id: string) {
  const entries = s.log.filter((e) => e.speechId === id);
  return {
    delivered: entries.length,
    clubs: [...new Set(entries.filter((e) => e.kind === 'Prepared speech (TM)').map((e) => e.where))],
    outside: [...new Set(entries.filter((e) => e.kind === 'Outside speech' || e.kind === 'Workshop').map((e) => e.where))],
    recordings: entries.filter((e) => e.recorded || e.url).map((e) => e.url).filter(Boolean) as string[],
  };
}

/** The “mission” for a club meeting: what to practice there with the active speech. */
export function missionFor(club: Club, sp: Speech): string {
  const cls = club.classification;
  if (cls.includes('ADVANCED') || cls.includes('PROFESSIONAL'))
    return `Give the full current version of “${sp.name}”. Ask evaluators to score it like the AS Level 1 ballot: Content 45, Delivery 35, Language 20.`;
  if (cls.includes('STORYTELLING')) return `Test one story from “${sp.name}” (${sp.stories[0] ?? 'your opening story'}). Is it vivid? Did they feel it?`;
  if (cls.includes('INTERNATIONAL')) return `Clarity test: does “${sp.name}” land with people from other cultures? Swap out local slang.`;
  if (cls.includes('IMPROMPTU')) return 'Table Topics: answer in 2 minutes with the Point → Story → Point structure.';
  return `Test the first 90 seconds of “${sp.name}”. Next experiment: ${sp.nextExperiment}`;
}

export function clubStrength(c: Club) {
  let s = 0;
  if (c.classification.includes('ADVANCED')) s += 3;
  if (c.classification.includes('PROFESSIONAL')) s += 3;
  if (c.classification.includes('STORYTELLING')) s += 2;
  if (c.frequency.toLowerCase().startsWith('weekly')) s += 1;
  if (c.verificationLevel === 'official') s += 1;
  if (c.guestsMaySpeak) s += 1;
  return s;
}

export function weekRange(date = new Date()) {
  const today = todayISO_ET(date);
  const [y, m, d] = today.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d));
  const dow = (dt.getUTCDay() + 6) % 7;
  const mon = new Date(dt.getTime() - dow * 86_400_000);
  const sun = new Date(mon.getTime() + 6 * 86_400_000);
  const iso = (x: Date) => x.toISOString().slice(0, 10);
  return { from: iso(mon), to: iso(sun) };
}

export function scorecard(log: LogEntry[], from: string, to: string) {
  const w = log.filter((e) => e.date >= from && e.date <= to);
  const n = (k: LogEntry['kind']) => w.filter((e) => e.kind === k).length;
  return [
    { label: 'Toastmasters meetings', v: n('Toastmasters meeting') },
    { label: 'Prepared speeches', v: n('Prepared speech (TM)') },
    { label: 'Table Topics', v: n('Table Topics') },
    { label: 'Evaluations', v: n('Evaluation given') },
    { label: 'Outside speeches', v: n('Outside speech') + n('Workshop') },
    { label: 'Organizations contacted', v: n('Outreach contact') },
    { label: 'Follow-ups', v: n('Follow-up') },
    { label: 'Bookings', v: n('Booking') },
    { label: 'Speech repetitions', v: w.filter((e) => e.speechId).length },
    { label: 'Videos captured', v: w.filter((e) => e.recorded || e.kind === 'Recording').length },
    { label: 'Testimonials', v: n('Testimonial') },
    { label: 'Speaking revenue', v: w.reduce((a, e) => a + (e.fee ?? 0), 0), money: true },
  ];
}
