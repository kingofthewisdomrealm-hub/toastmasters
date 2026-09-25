import type { Club } from '../data/types';

export const ET = 'America/New_York';
const DAY = 86_400_000;
export const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const fmtCache = new Map<string, Intl.DateTimeFormat>();
function fmt(tz: string) {
  let f = fmtCache.get(tz);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: tz, hourCycle: 'h23', weekday: 'long',
      year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', second: '2-digit',
    });
    fmtCache.set(tz, f);
  }
  return f;
}

export type Parts = { y: number; m: number; d: number; h: number; mi: number; weekday: string };

export function partsIn(date: Date, tz: string): Parts {
  const p: Record<string, string> = {};
  for (const x of fmt(tz).formatToParts(date)) p[x.type] = x.value;
  return { y: +p.year, m: +p.month, d: +p.day, h: +p.hour % 24, mi: +p.minute, weekday: p.weekday };
}

function offsetMs(date: Date, tz: string) {
  const p = partsIn(date, tz);
  const asUtc = Date.UTC(p.y, p.m - 1, p.d, p.h, p.mi);
  return asUtc - Math.floor(date.getTime() / 60000) * 60000;
}

/** Wall-clock time in `tz` → real instant (handles DST in both zones). */
export function zonedToUtc(y: number, m: number, d: number, h: number, mi: number, tz: string): Date {
  const guess = Date.UTC(y, m - 1, d, h, mi);
  const o1 = offsetMs(new Date(guess), tz);
  let t = guess - o1;
  const o2 = offsetMs(new Date(t), tz);
  if (o2 !== o1) t = guess - o2;
  return new Date(t);
}

/** Monday 00:00 ET of the week containing `date`. */
export function weekStartET(date = new Date()): Date {
  const p = partsIn(date, ET);
  const idx = DAYS.indexOf(p.weekday);
  const noon = zonedToUtc(p.y, p.m, p.d, 12, 0, ET);
  const mondayNoon = new Date(noon.getTime() - idx * DAY);
  const mp = partsIn(mondayNoon, ET);
  return zonedToUtc(mp.y, mp.m, mp.d, 0, 0, ET);
}

export function todayISO_ET(date = new Date()) {
  const p = partsIn(date, ET);
  return `${p.y}-${String(p.m).padStart(2, '0')}-${String(p.d).padStart(2, '0')}`;
}

const ORD: Record<string, number> = { '1st': 1, '2nd': 2, '3rd': 3, '4th': 4, '5th': 5, first: 1, second: 2, third: 3, fourth: 4, fifth: 5 };

/** Does the club meet on this local date? Returns 'yes' | 'no' | 'maybe' (alternate-week clubs we can’t pin down). */
export function meetsOn(club: Club, local: Parts): 'yes' | 'no' | 'maybe' {
  if (local.weekday !== club.meetingDay) return 'no';
  const f = club.frequency.toLowerCase();
  if (f.startsWith('weekly')) return 'yes';
  if (/biweekly|alternate|every other/.test(f)) return 'maybe';
  const nth = Math.ceil(local.d / 7);
  const daysInMonth = new Date(Date.UTC(local.y, local.m, 0)).getUTCDate();
  const isLast = local.d + 7 > daysInMonth;
  const ords = [...f.matchAll(/(1st|2nd|3rd|4th|5th|first|second|third|fourth|fifth)/g)].map((x) => ORD[x[1]]);
  if (ords.length === 0 && !/last/.test(f)) return 'maybe';
  if (ords.includes(nth)) return 'yes';
  if (/last/.test(f) && isLast) return 'yes';
  return 'no';
}

export type Occurrence = {
  club: Club;
  start: Date;
  et: Parts;
  local: Parts;
  certainty: 'yes' | 'maybe';
};

/** All club meetings that start inside [weekStart, weekStart + 7 days). */
export function occurrencesForWeek(clubs: Club[], weekStart: Date): Occurrence[] {
  const end = weekStart.getTime() + 7 * DAY;
  const out: Occurrence[] = [];
  for (const club of clubs) {
    const [h, mi] = club.localTime.split(':').map(Number);
    const seen = new Set<number>();
    for (let k = -1; k <= 8; k++) {
      const probe = new Date(weekStart.getTime() + k * DAY + 12 * 3600_000);
      const lp = partsIn(probe, club.timezone);
      if (lp.weekday !== club.meetingDay) continue;
      const start = zonedToUtc(lp.y, lp.m, lp.d, h, mi, club.timezone);
      const t = start.getTime();
      if (t < weekStart.getTime() || t >= end || seen.has(t)) continue;
      seen.add(t);
      const local = partsIn(start, club.timezone);
      const c = meetsOn(club, local);
      if (c === 'no') continue;
      out.push({ club, start, et: partsIn(start, ET), local, certainty: c });
    }
  }
  return out.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export const BLOCKS = [
  { key: 'early', label: 'Early morning', range: '5–8 AM', from: 5, to: 8 },
  { key: 'morning', label: 'Morning', range: '8 AM–12 PM', from: 8, to: 12 },
  { key: 'afternoon', label: 'Afternoon', range: '12–5 PM', from: 12, to: 17 },
  { key: 'evening', label: 'Evening', range: '5–10 PM', from: 17, to: 22 },
  { key: 'late', label: 'Late night / International', range: '10 PM–5 AM', from: 22, to: 29 },
] as const;

export function blockOf(h: number) {
  const hh = h < 5 ? h + 24 : h;
  return BLOCKS.find((b) => hh >= b.from && hh < b.to)!.key;
}

export function hm(p: { h: number; mi: number }) {
  const ap = p.h >= 12 ? 'PM' : 'AM';
  const h12 = p.h % 12 === 0 ? 12 : p.h % 12;
  return `${h12}:${String(p.mi).padStart(2, '0')} ${ap}`;
}

export function tzAbbr(date: Date, tz: string) {
  return new Intl.DateTimeFormat('en-US', { timeZone: tz, timeZoneName: 'short' })
    .formatToParts(date).find((x) => x.type === 'timeZoneName')?.value ?? tz;
}

export function fmtDate(iso: string) {
  const [y, m, d] = iso.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });
}

export function daysUntil(iso: string, from = new Date()) {
  const [y, m, d] = iso.split('-').map(Number);
  const target = zonedToUtc(y, m, d, 0, 0, ET).getTime();
  return Math.ceil((target - from.getTime()) / DAY);
}
