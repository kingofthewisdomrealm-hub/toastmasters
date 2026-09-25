import { Badge, Bar, Check, Ext, Head, statusLabel } from '../components/ui';
import { BALLOT_L1, BALLOT_L2, HANDBOOK, MENTORS, APPLICATION, RECOMMENDATION, requirements, scoring, TARGET_CYCLE } from '../data/requirements';
import type { ReqStatus } from '../data/types';
import { progress, reqStatus } from '../lib/derive';
import { setState, useStore } from '../lib/store';
import { daysUntil, fmtDate } from '../lib/time';

const ORDER: ReqStatus[] = ['unknown', 'not_started', 'in_progress', 'done'];

export function Accredited() {
  const s = useStore();
  const p = progress(s);
  const cats = [...new Set(requirements.map((r) => r.category))];
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Head title="Accredited Speaker" sub="Official requirements (Handbook Item 690 Rev. 12/2024 · Application Rev. 10/2022) · checked Sep 25, 2026" />
      <div className="grid g3">
        <div className="card"><div className="eyebrow">Overall</div><div className="stat">{p.pct}%</div><Bar pct={p.pct} slim /></div>
        <div className="card"><div className="eyebrow">Target cycle</div><div className="stat" style={{ fontSize: 22 }}>Jan 31, 2028</div><div className="small muted">Submit by {fmtDate(TARGET_CYCLE.internalApplyBy)} · Level 2 at the Aug 2028 convention</div></div>
        <div className="card"><div className="eyebrow">Stretch option</div><div className="stat" style={{ fontSize: 22 }}>Jan 31, 2027</div><div className="small muted">Only if you already have 25 qualifying talks since Feb 2024 (15 paid). {daysUntil(TARGET_CYCLE.stretchApplyBy)} days away.</div></div>
      </div>

      <div className="card">
        <h3>Gap analysis checklist</h3>
        <div className="small muted" style={{ marginBottom: 10 }}>Click the circle to change the status. “Confirm” means I couldn’t verify it for you, so it needs your answer. The three talk-count items fill in from your Speaking Log.</div>
        {cats.map((cat) => (
          <div key={cat} style={{ marginTop: 14 }}>
            <div className="eyebrow" style={{ marginBottom: 4 }}>{cat}</div>
            {requirements.filter((r) => r.category === cat).map((r) => {
              const st = reqStatus(s, r.id);
              return (
                <details key={r.id} style={{ borderBottom: '1px solid var(--line)', padding: '10px 0' }}>
                  <summary className="row" style={{ cursor: 'pointer', listStyle: 'none', flexWrap: 'nowrap' }}>
                    <button className="btn ghost" style={{ padding: 0 }} title="Change status" onClick={(e) => { e.preventDefault(); setState((x) => ({ ...x, reqStatus: { ...x.reqStatus, [r.id]: ORDER[(ORDER.indexOf(st) + 1) % ORDER.length] } })); }}>
                      <Check s={st} />
                    </button>
                    <span style={{ flex: 1, fontWeight: 500 }}>{r.requirement}</span>
                    {!r.official && <Badge>prep</Badge>}
                    <Badge tone={st === 'done' ? 'green' : st === 'unknown' ? 'amber' : st === 'in_progress' ? 'blue' : undefined}>{statusLabel[st]}</Badge>
                    <span className="small muted" style={{ whiteSpace: 'nowrap' }}>{fmtDate(r.deadline)}</span>
                  </summary>
                  <dl className="kv" style={{ marginTop: 10, paddingLeft: 34 }}>
                    <dt>What it means</dt><dd>{r.detail}</dd>
                    <dt>Evidence needed</dt><dd>{r.evidence}</dd>
                    <dt>Action</dt><dd><b>{r.action}</b></dd>
                    <dt>Deadline</dt><dd>{fmtDate(r.deadline)}</dd>
                    <dt>Source</dt><dd><Ext href={r.source} /></dd>
                    <dt>Notes</dt><dd><input className="field" value={s.reqNotes[r.id] ?? ''} placeholder="Your notes / evidence link" onChange={(e) => setState((x) => ({ ...x, reqNotes: { ...x.reqNotes, [r.id]: e.target.value } }))} /></dd>
                  </dl>
                </details>
              );
            })}
          </div>
        ))}
      </div>

      <div className="grid g2">
        <div className="card">
          <h3>How judges score (both levels)</h3>
          <div className="small muted" style={{ marginBottom: 8 }}>To pass: 80+ out of 100 from 4 of 5 judges. You are not ranked against other applicants.</div>
          {scoring.map((x) => (
            <div key={x.area} style={{ marginBottom: 10 }}>
              <div className="row between"><b>{x.area}</b><span>{x.pts} pts</span></div>
              <Bar pct={x.pts} slim />
              <div className="small muted">{x.parts}</div>
            </div>
          ))}
        </div>
        <div className="card">
          <h3>Timeline of one cycle</h3>
          <dl className="kv small">
            <dt>Any time</dt><dd>Paying clients email recommendation forms (kept on file 5 years)</dd>
            <dt>Jan 1–31</dt><dd>Submit the application + video link; pay $100</dd>
            <dt>February</dt><dd>Eligibility check; one 7-day chance to fix problems</dd>
            <dt>Mar–Apr</dt><dd>Level 1 judging</dd>
            <dt>May</dt><dd>Results; confirm Level 2 within ~7 days; pay $150</dd>
            <dt>August</dt><dd>Level 2: live 15–18 min talk at the International Convention</dd>
          </dl>
        </div>
      </div>

      <div className="grid g2">
        <div className="card">
          <h3>Why applicants fail</h3>
          <ul className="small" style={{ paddingLeft: 18, margin: 0 }}>
            <li>Edited or poor-quality video, missing introduction, or the talk cut short</li>
            <li>Talks that don’t count: Toastmasters audiences, part of a regular job, under 20 minutes or under 20 people</li>
            <li>Fewer than 8 talks with a pre-arranged fee</li>
            <li>Recommendations from unpaid clients, or sent in by the applicant</li>
            <li>Applying before the speaking business is established</li>
            <li>A talk that doesn’t give enough value to the audience (Audience Response is the biggest score item)</li>
          </ul>
          <div className="small muted" style={{ marginTop: 8 }}>Level 2 results: 2023: 3 of 4 passed · 2024: 2 of 3 · 2025: apparently 0 of 2 · 2026: 1 of 3. About 96 people have ever earned it (since 1981).</div>
        </div>
        <div className="card">
          <h3>Official documents</h3>
          <div className="stack small">
            <Ext href={HANDBOOK}>Handbook (Item 690, Rev. 12/2024)</Ext>
            <Ext href={APPLICATION}>Application (Item 1208, Rev. 10/2022): use this version</Ext>
            <Ext href={RECOMMENDATION}>Recommendation form (Item 1209)</Ext>
            <Ext href={BALLOT_L1}>Level 1 judges’ guide & ballot</Ext>
            <Ext href={BALLOT_L2}>Level 2 judges’ guide & ballot</Ext>
            <Ext href={MENTORS}>Accredited Speaker mentors (24)</Ext>
          </div>
          <div className="small muted" style={{ marginTop: 10 }}>Not answered by official sources, so ask accreditedspeaker@toastmasters.org: Do “vintage” paths count? Do church talks count? Can an in-room audience and an online audience be added together to reach 20?</div>
        </div>
      </div>
    </div>
  );
}
