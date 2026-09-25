import { useMemo, useState } from 'react';
import { ClubDrawer } from '../components/ClubDrawer';
import { OppDrawer } from '../components/OppDrawer';
import { Badge, Bar } from '../components/ui';
import { requirements, TARGET_CYCLE } from '../data/requirements';
import type { Club, Opportunity } from '../data/types';
import { clubs, clubStrength, currentMonth, mergedSpeeches, opportunities, progress, reqStatus } from '../lib/derive';
import { useStore } from '../lib/store';
import { daysUntil, ET, fmtDate, hm, occurrencesForWeek, partsIn, todayISO_ET, tzAbbr, weekStartET } from '../lib/time';

export function Home() {
  const s = useStore();
  const p = progress(s);
  const { month, week } = currentMonth();
  const [club, setClub] = useState<Club | null>(null);
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const today = partsIn(new Date(), ET);
  const sp = mergedSpeeches(s).find((x) => x.id === s.activeSpeechId) ?? mergedSpeeches(s)[0];

  const todays = useMemo(() => {
    const occ = occurrencesForWeek(clubs, weekStartET()).filter((o) => o.et.weekday === today.weekday && o.et.d === today.d);
    const now = Date.now();
    const upcoming = occ.filter((o) => o.start.getTime() > now - 30 * 60000);
    const favs = upcoming.filter((o) => s.favorites.includes(o.club.id));
    const rest = upcoming.filter((o) => !s.favorites.includes(o.club.id)).sort((a, b) => clubStrength(b.club) - clubStrength(a.club));
    return { list: [...favs, ...rest].slice(0, 6).sort((a, b) => a.start.getTime() - b.start.getTime()), total: occ.length };
  }, [s.favorites, today.weekday, today.d]);

  const outreachToday = opportunities.filter((o) => (s.outreach[o.id]?.status ?? 'Research') === 'Research').slice(0, 3);
  const followUps = opportunities.filter((o) => s.outreach[o.id]?.followUp && s.outreach[o.id]!.followUp! <= todayISO_ET());
  const upcoming = requirements
    .filter((r) => reqStatus(s, r.id) !== 'done')
    .sort((a, b) => a.deadline.localeCompare(b.deadline))
    .slice(0, 4);

  return (
    <div className="stack" style={{ gap: 16 }}>
      <div className="eyebrow">{today.weekday}, {fmtDate(todayISO_ET())}</div>
      <div className="card" style={{ padding: 28 }}>
        <div className="row between">
          <div className="eyebrow">Accredited Speaker progress</div>
          <Badge tone="blue">Target: apply by {fmtDate(TARGET_CYCLE.internalApplyBy)} · {daysUntil(TARGET_CYCLE.applyBy)} days to deadline</Badge>
        </div>
        <div className="row" style={{ alignItems: 'end', gap: 18, margin: '14px 0 16px' }}>
          <div className="big">{p.pct}%</div>
          <div className="muted" style={{ paddingBottom: 6 }}>{p.done} of {requirements.length} requirements done · {p.remaining} to go</div>
        </div>
        <Bar pct={p.pct} />
        <div className="grid g4 keep" style={{ marginTop: 20 }}>
          <div><div className="stat">{p.counts.total}<span className="muted small"> / 25</span></div><div className="small muted">Qualifying outside talks</div></div>
          <div><div className="stat">{p.counts.paid}<span className="muted small"> / 15</span></div><div className="small muted">Paid</div></div>
          <div><div className="stat">{p.counts.fee}<span className="muted small"> / 8</span></div><div className="small muted">With a pre-arranged fee</div></div>
          <div><div className="stat">{month.label}</div><div className="small muted">{month.phase}</div></div>
        </div>
        <div className="hr" />
        <div className="small"><b>Next milestone:</b> {month.milestone}</div>
      </div>

      <div className="grid g3">
        <div className="card">
          <div className="row between"><h3>Today’s meetings</h3><span className="small muted">{todays.total} today</span></div>
          <div className="list">
            {todays.list.length === 0 && <div className="muted small">No more meetings today. Check the Meetings tab for tomorrow.</div>}
            {todays.list.map((o) => (
              <div className="item" key={o.club.id + o.start.getTime()} onClick={() => setClub(o.club)}>
                <div className="row between"><span className="t">{hm(o.et)} <span className="muted small">{tzAbbr(o.start, ET)}</span></span>{s.favorites.includes(o.club.id) && <Badge tone="blue">★</Badge>}</div>
                <div className="small">{o.club.name}</div>
                <div className="small muted">{o.club.city} · {o.club.classification.join(', ')}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Speech Lab assignment</h3>
          <div className="eyebrow" style={{ marginTop: 4 }}>Active speech</div>
          <div className="t" style={{ fontSize: 17 }}>{sp.name}</div>
          <div className="small muted">Stage: {sp.stage} · v{sp.version}</div>
          <div className="mission" style={{ marginTop: 12 }}>
            <div className="eyebrow">Practice today</div>
            <div style={{ marginTop: 4 }}>{sp.nextExperiment}</div>
          </div>
          <div className="hr" />
          <div className="eyebrow">This week’s objective</div>
          <div className="small" style={{ marginTop: 4 }}>{month.weeks[week]}</div>
        </div>
        <div className="card">
          <h3>Outside-speaking task</h3>
          {followUps.length > 0 && (
            <div className="mission" style={{ marginBottom: 10 }}>
              <div className="eyebrow">Follow-ups due</div>
              {followUps.map((o) => <div key={o.id} className="small" style={{ cursor: 'pointer' }} onClick={() => setOpp(o)}>→ {o.organization}</div>)}
            </div>
          )}
          <div className="small muted">Contact these 3 today:</div>
          <div className="list">
            {outreachToday.map((o) => (
              <div className="item" key={o.id} onClick={() => setOpp(o)}>
                <div className="t">{o.organization}</div>
                <div className="small muted">{o.type} · {o.city} · pitch “{o.speechFit[0]}”</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="card">
        <h3>Upcoming deadlines</h3>
        <div className="list">
          {upcoming.map((r) => (
            <div className="item row between" key={r.id} style={{ cursor: 'default' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="t" style={{ fontSize: 14 }}>{r.requirement}</div>
                <div className="small muted">{r.action}</div>
              </div>
              <Badge tone={daysUntil(r.deadline) < 45 ? 'amber' : undefined}>{fmtDate(r.deadline)}</Badge>
            </div>
          ))}
        </div>
      </div>
      <ClubDrawer club={club} onClose={() => setClub(null)} />
      <OppDrawer opp={opp} onClose={() => setOpp(null)} />
    </div>
  );
}
