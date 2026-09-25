import { Badge, Bar, Head } from '../components/ui';
import { backChain, ladder, roadmap } from '../data/roadmap';
import { clubs, clubStrength, currentMonth, engagementCounts, mergedSpeeches, opportunities, progress, scorecard, weekRange } from '../lib/derive';
import { useStore } from '../lib/store';
import { fmtDate, hm, occurrencesForWeek, weekStartET } from '../lib/time';
import { requirements } from '../data/requirements';
import { reqStatus } from '../lib/derive';

export function Roadmap() {
  const s = useStore();
  const { idx } = currentMonth();
  const c = engagementCounts(s.log);
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Head title="Roadmap" sub="12 months, Oct 2026 – Sep 2027, working back from the goal. Apply Jan 2028." />
      <div className="grid g2">
        <div className="card">
          <h3>Working backward from the goal</h3>
          <div className="chain">
            {backChain.map((b, i) => (
              <div key={b} style={{ display: 'contents' }}>
                {i > 0 && <i>↑</i>}
                <div>{b}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Speaking ladder</h3>
          <div className="small muted" style={{ marginBottom: 10 }}>Each step up brings a bigger audience, more credibility, better footage, and higher pay.</div>
          {ladder.slice().reverse().map((l) => {
            const n = opportunities.filter((o) => o.ladderLevel === l.level).length;
            return (
              <div key={l.level} className="row between" style={{ padding: '6px 0', borderBottom: '1px solid var(--line)' }}>
                <span><b>{l.level}</b> · {l.name} <span className="small muted">{l.note}</span></span>
                <Badge>{l.level === 1 ? `${clubs.length} clubs` : `${n} orgs`}</Badge>
              </div>
            );
          })}
        </div>
      </div>
      <div className="card">
        <h3>Monthly milestones</h3>
        <div className="small muted" style={{ marginBottom: 14 }}>Targets are running totals of qualifying outside talks. You have {c.total} now ({c.paid} paid, {c.fee} with a fee).</div>
        <div className="timeline">
          {roadmap.map((m, i) => (
            <div key={m.key} className={`tl${i === idx ? ' now' : i < idx ? ' past' : ''}`}>
              <div className="dot" />
              <details open={i === idx} style={{ paddingBottom: 18 }}>
                <summary style={{ cursor: 'pointer', listStyle: 'none' }}>
                  <div className="row between">
                    <b>{m.label}</b>
                    <span className="row" style={{ gap: 6 }}>
                      <Badge tone="blue">{m.phase}</Badge>
                      <Badge>{m.targets.engagements} talks · {m.targets.paid} paid · {m.targets.fee} fee</Badge>
                      <Badge>Pathways L{m.targets.pathwaysLevel}</Badge>
                    </span>
                  </div>
                  <div className="small">{m.milestone}</div>
                </summary>
                <div className="grid g3" style={{ marginTop: 12 }}>
                  <div>
                    <div className="eyebrow">Weekly objectives</div>
                    <ol className="small" style={{ paddingLeft: 18, margin: '6px 0' }}>{m.weeks.map((w) => <li key={w}>{w}</li>)}</ol>
                  </div>
                  <div>
                    <div className="eyebrow">Inside Toastmasters</div>
                    <ul className="small" style={{ paddingLeft: 18, margin: '6px 0' }}>{m.toastmasters.map((w) => <li key={w}>{w}</li>)}</ul>
                  </div>
                  <div>
                    <div className="eyebrow">Outside Toastmasters</div>
                    <ul className="small" style={{ paddingLeft: 18, margin: '6px 0' }}>{m.outside.map((w) => <li key={w}>{w}</li>)}</ul>
                  </div>
                </div>
              </details>
            </div>
          ))}
        </div>
      </div>
      <div className="card small muted">
        After Sep 2027: Oct–Dec 2027 grow to 30 talks (18 paid, 10 with a fee) for a safety margin, finish the path, and draft the application. Submit by Jan 15, 2028. Level 1 results come in May 2028; Level 2 is at the August 2028 convention.
      </div>
    </div>
  );
}

export function Weekly() {
  const s = useStore();
  const { month, week } = currentMonth();
  const wr = weekRange();
  const p = progress(s);
  const sp = mergedSpeeches(s).find((x) => x.id === s.activeSpeechId) ?? mergedSpeeches(s)[0];
  const gaps = requirements.filter((r) => reqStatus(s, r.id) !== 'done').sort((a, b) => b.weight - a.weight);
  const occ = occurrencesForWeek(clubs, weekStartET()).filter((o) => clubStrength(o.club) >= 3 || s.favorites.includes(o.club.id)).slice(0, 8);
  const targets = opportunities.filter((o) => (s.outreach[o.id]?.status ?? 'Research') === 'Research').slice(0, 5);
  const card = scorecard(s.log, wr.from, wr.to);
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Head title="Weekly Plan" sub={`${fmtDate(wr.from)} – ${fmtDate(wr.to)} · ${month.label}, week ${week + 1}`} />
      <div className="grid g3">
        <div className="card"><div className="eyebrow">Where am I?</div><div className="stat">{p.pct}%</div><div className="small muted">{p.counts.total}/25 talks · {p.counts.paid}/15 paid · {p.counts.fee}/8 with a fee</div></div>
        <div className="card"><div className="eyebrow">Biggest gap</div><div className="t" style={{ marginTop: 6 }}>{gaps[0]?.requirement}</div><div className="small muted">{gaps[0]?.action}</div></div>
        <div className="card"><div className="eyebrow">This week’s target</div><div className="t" style={{ marginTop: 6 }}>{month.weeks[week]}</div></div>
      </div>
      <div className="grid g2">
        <div className="card">
          <h3>What should I practice?</h3>
          <div className="t">{sp.name} <span className="muted small">· {sp.stage}</span></div>
          <div className="small" style={{ marginTop: 4 }}>{sp.nextExperiment}</div>
          <div className="hr" />
          <div className="eyebrow">Inside Toastmasters this month</div>
          <ul className="small" style={{ paddingLeft: 18 }}>{month.toastmasters.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="card">
          <h3>Where can I practice it?</h3>
          <div className="list">
            {occ.map((o) => (
              <div key={o.club.id + o.start.getTime()} className="item" style={{ cursor: 'default' }}>
                <div className="row between"><span className="t small">{o.et.weekday.slice(0, 3)} {hm(o.et)} ET</span><Badge>{o.club.classification[0]}</Badge></div>
                <div className="small muted">{o.club.name} · {o.club.city}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="grid g2">
        <div className="card">
          <h3>Where can I use it for real?</h3>
          <div className="list">{targets.map((o) => <div key={o.id} className="item" style={{ cursor: 'default' }}><div className="t small">{o.organization}</div><div className="small muted">{o.whyFit}</div></div>)}</div>
          <div className="eyebrow" style={{ marginTop: 10 }}>Outside Toastmasters this month</div>
          <ul className="small" style={{ paddingLeft: 18 }}>{month.outside.map((x) => <li key={x}>{x}</li>)}</ul>
        </div>
        <div className="card">
          <h3>Weekly speaking scorecard</h3>
          <table className="tbl"><tbody>{card.map((r) => <tr key={r.label}><td>{r.label}</td><td style={{ textAlign: 'right', fontWeight: 600 }}>{r.money ? `$${r.v.toLocaleString()}` : r.v}</td></tr>)}</tbody></table>
          <div className="eyebrow" style={{ marginTop: 12 }}>Evidence to document this week</div>
          <div className="small">For each outside talk: the booking email showing the fee, the invoice and payment, the head count (20+), the agenda showing 20+ minutes, and the client contact’s name and email. Ask paying clients for a recommendation form.</div>
        </div>
      </div>
    </div>
  );
}

export function Analytics() {
  const s = useStore();
  const L = s.log;
  const n = (k: string) => L.filter((e) => e.kind === k).length;
  const hours = L.reduce((a, e) => a + (e.minutes ?? 0), 0) / 60;
  const stats = [
    ['Speeches delivered', n('Prepared speech (TM)') + n('Outside speech') + n('Workshop')],
    ['Toastmasters meetings', n('Toastmasters meeting')],
    ['Clubs visited', new Set(L.filter((e) => e.kind === 'Toastmasters meeting' || e.kind === 'Prepared speech (TM)').map((e) => e.where)).size],
    ['Outside speeches', n('Outside speech') + n('Workshop')],
    ['Speaking hours', hours.toFixed(1)],
    ['Organizations contacted', n('Outreach contact')],
    ['Bookings', n('Booking')],
    ['Paid speeches', L.filter((e) => e.paid === 'fee' || e.paid === 'reimbursement').length],
    ['Testimonials', n('Testimonial')],
    ['Recordings', L.filter((e) => e.recorded || e.kind === 'Recording').length],
    ['Speech repetitions', L.filter((e) => e.speechId).length],
    ['Revenue', '$' + L.reduce((a, e) => a + (e.fee ?? 0), 0).toLocaleString()],
  ] as const;
  // last 12 weeks of activity
  const weeks: { label: string; v: number }[] = [];
  const now = new Date();
  for (let i = 11; i >= 0; i--) {
    const end = new Date(now.getTime() - i * 7 * 86400000);
    const start = new Date(end.getTime() - 6 * 86400000);
    const a = start.toISOString().slice(0, 10), b = end.toISOString().slice(0, 10);
    weeks.push({ label: `${start.getMonth() + 1}/${start.getDate()}`, v: L.filter((e) => e.date >= a && e.date <= b).length });
  }
  const max = Math.max(1, ...weeks.map((w) => w.v));
  const c = engagementCounts(L);
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Head title="Analytics" sub="Everything here is counted from your Speaking Log" />
      <div className="grid g4 keep">
        {stats.map(([k, v]) => <div key={k} className="card tight"><div className="eyebrow">{k}</div><div className="stat">{v}</div></div>)}
      </div>
      <div className="grid g2">
        <div className="card">
          <h3>Activity, last 12 weeks</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(12, 1fr)', gap: 6, alignItems: 'end', height: 140 }}>
            {weeks.map((w) => (
              <div key={w.label} style={{ display: 'grid', gap: 4, justifyItems: 'center' }} title={`${w.v} entries`}>
                <div style={{ width: '100%', maxWidth: 24, height: Math.max(3, (w.v / max) * 110), background: 'var(--accent)', borderRadius: '4px 4px 0 0', opacity: w.v ? 1 : 0.2 }} />
                <span className="muted" style={{ fontSize: 10 }}>{w.label}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="card">
          <h3>Accredited Speaker engagement targets</h3>
          {[['Qualifying talks', c.total, 25], ['Paid', c.paid, 15], ['Pre-arranged fee', c.fee, 8]].map(([k, v, t]) => (
            <div key={k as string} style={{ marginBottom: 12 }}>
              <div className="row between small"><b>{k}</b><span>{v} / {t}</span></div>
              <Bar pct={((v as number) / (t as number)) * 100} slim good={(v as number) >= (t as number)} />
            </div>
          ))}
          <div className="small muted">A talk counts only if it’s logged as an Outside speech or Workshop with 20+ minutes and 20+ people.</div>
        </div>
      </div>
    </div>
  );
}
