import { useState } from 'react';
import { Badge, Head } from '../components/ui';
import { stages } from '../data/speeches';
import type { LogEntry, Speech, Stage } from '../data/types';
import { mergedSpeeches, speechStats } from '../lib/derive';
import { setState, uid, useStore } from '../lib/store';
import { fmtDate, todayISO_ET } from '../lib/time';

function edit(id: string, patch: Partial<Speech>) {
  setState((s) => ({ ...s, speechEdits: { ...s.speechEdits, [id]: { ...s.speechEdits[id], ...patch } } }));
}

export function SpeechLab() {
  const s = useStore();
  const list = mergedSpeeches(s);
  const [open, setOpen] = useState<string>(s.activeSpeechId);
  const sp = list.find((x) => x.id === open) ?? list[0];
  const st = speechStats(s, sp.id);
  const history = s.log.filter((e) => e.speechId === sp.id).sort((a, b) => b.date.localeCompare(a.date));
  const field = (k: keyof Speech, label: string, area = false) => (
    <label className="lbl">{label}
      {area ? (
        <textarea className="field" value={String(sp[k] ?? '')} onChange={(e) => edit(sp.id, { [k]: e.target.value } as Partial<Speech>)} />
      ) : (
        <input className="field" value={String(sp[k] ?? '')} onChange={(e) => edit(sp.id, { [k]: e.target.value } as Partial<Speech>)} />
      )}
    </label>
  );
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Head title="Speech Lab" sub="Toastmasters is the lab. The outside world is the field. Each speech moves from idea to professional asset." />
      <div className="grid g3">
        {list.map((x) => {
          const i = stages.indexOf(x.stage);
          return (
            <div key={x.id} className="card" style={{ cursor: 'pointer', outline: x.id === sp.id ? '2px solid var(--accent)' : undefined }} onClick={() => setOpen(x.id)}>
              <div className="row between"><div className="t">{x.name}</div>{s.activeSpeechId === x.id && <Badge tone="blue">Active</Badge>}</div>
              <div className="small muted" style={{ margin: '4px 0 10px' }}>{x.stage} · v{x.version} · {speechStats(s, x.id).delivered} deliveries</div>
              <div className="pipeline">{stages.map((stg, j) => <span key={stg} className={j <= i ? 'on' : ''} title={stg} />)}</div>
            </div>
          );
        })}
      </div>

      <div className="card">
        <div className="row between">
          <h2>{sp.name}</h2>
          <div className="row">
            {s.activeSpeechId !== sp.id && <button className="btn primary" onClick={() => setState((x) => ({ ...x, activeSpeechId: sp.id }))}>Make active</button>}
            <button className="btn" onClick={() => edit(sp.id, { version: sp.version + 1 })}>New version (v{sp.version + 1})</button>
          </div>
        </div>
        <div className="small muted" style={{ margin: '4px 0 14px' }}>{sp.seedNote}</div>
        <div className="eyebrow" style={{ marginBottom: 6 }}>Pipeline stage</div>
        <div className="row" style={{ gap: 6, marginBottom: 16 }}>
          {stages.map((stg) => <button key={stg} className={`chip${sp.stage === stg ? ' on' : ''}`} onClick={() => edit(sp.id, { stage: stg as Stage })}>{stg}</button>)}
        </div>
        <div className="mission" style={{ marginBottom: 16 }}>
          <div className="eyebrow">Next experiment</div>
          <input className="field" style={{ marginTop: 6, background: 'var(--card)' }} value={sp.nextExperiment} onChange={(e) => edit(sp.id, { nextExperiment: e.target.value })} />
        </div>
        <div className="grid g2">
          {field('centralIdea', 'Central idea')}
          {field('audience', 'Audience')}
          {field('problem', 'Problem')}
          {field('promise', 'Promise')}
          {field('opening', 'Opening', true)}
          {field('framework', 'Main framework', true)}
          {field('interaction', 'Audience interaction')}
          {field('humor', 'Humor')}
          {field('closing', 'Closing')}
          {field('cta', 'Call to action')}
        </div>
        <label className="lbl" style={{ marginTop: 12 }}>Stories (one per line)
          <textarea className="field" value={sp.stories.join('\n')} onChange={(e) => edit(sp.id, { stories: e.target.value.split('\n') })} />
        </label>
        <div className="grid g3" style={{ marginTop: 16 }}>
          <div><div className="eyebrow">Clubs delivered at</div><div className="small">{st.clubs.join(', ') || '—'}</div></div>
          <div><div className="eyebrow">Outside organizations</div><div className="small">{st.outside.join(', ') || '—'}</div></div>
          <div><div className="eyebrow">Recordings</div><div className="small">{st.recordings.map((u) => <a key={u} href={u} target="_blank" rel="noreferrer" style={{ display: 'block' }}>{u}</a>)}{st.recordings.length === 0 && '—'}</div></div>
        </div>
        <div className="hr" />
        <h3>Repetition history: what changed each time</h3>
        {history.length === 0 && <div className="small muted">No deliveries logged yet. Log each delivery in the Speaking Log and pick this speech. Write down what worked, what was weak, and what you’ll change.</div>}
        <div className="list">
          {history.map((e: LogEntry) => (
            <div key={e.id} className="item" style={{ cursor: 'default' }}>
              <div className="row between"><span className="t small">{fmtDate(e.date)} · {e.where}</span><Badge>{e.kind}</Badge></div>
              <div className="small muted">{e.notes}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const KINDS: LogEntry['kind'][] = ['Toastmasters meeting', 'Prepared speech (TM)', 'Table Topics', 'Evaluation given', 'Meeting role', 'Outside speech', 'Workshop', 'Recording', 'Outreach contact', 'Follow-up', 'Booking', 'Testimonial'];

export function SpeakingLog() {
  const s = useStore();
  const sps = mergedSpeeches(s);
  const blank: LogEntry = { id: '', date: todayISO_ET(), kind: 'Toastmasters meeting', title: '', where: '' };
  const [f, setF] = useState<LogEntry>(blank);
  const outside = f.kind === 'Outside speech' || f.kind === 'Workshop';
  const set = (p: Partial<LogEntry>) => setF({ ...f, ...p });
  const save = () => {
    if (!f.where && !f.title) return;
    setState((x) => ({ ...x, log: [...x.log, { ...f, id: uid() }] }));
    setF({ ...blank, kind: f.kind, date: f.date });
  };
  const rows = s.log.slice().sort((a, b) => b.date.localeCompare(a.date));
  const qualifies = (e: LogEntry) => (e.kind === 'Outside speech' || e.kind === 'Workshop') && (e.minutes ?? 0) >= 20 && (e.audience ?? 0) >= 20;
  return (
    <div className="stack" style={{ gap: 16 }}>
      <Head title="Speaking Log" sub="Every repetition, inside and outside Toastmasters. Outside talks use the same fields as the official application’s engagement log." />
      <div className="card">
        <div className="grid g4">
          <label className="lbl">Date<input className="field" type="date" value={f.date} onChange={(e) => set({ date: e.target.value })} /></label>
          <label className="lbl">Type<select className="field" value={f.kind} onChange={(e) => set({ kind: e.target.value as LogEntry['kind'] })}>{KINDS.map((k) => <option key={k}>{k}</option>)}</select></label>
          <label className="lbl">{outside ? 'Company / organization' : 'Club / where'}<input className="field" value={f.where} onChange={(e) => set({ where: e.target.value })} /></label>
          <label className="lbl">Speech<select className="field" value={f.speechId ?? ''} onChange={(e) => set({ speechId: e.target.value || undefined })}><option value="">—</option>{sps.map((x) => <option key={x.id} value={x.id}>{x.name}</option>)}</select></label>
          <label className="lbl">Title / role<input className="field" value={f.title} onChange={(e) => set({ title: e.target.value })} /></label>
          <label className="lbl">Length (min)<input className="field" type="number" value={f.minutes ?? ''} onChange={(e) => set({ minutes: e.target.value ? +e.target.value : undefined })} /></label>
          <label className="lbl">Audience size<input className="field" type="number" value={f.audience ?? ''} onChange={(e) => set({ audience: e.target.value ? +e.target.value : undefined })} /></label>
          <label className="lbl">Recording URL<input className="field" value={f.url ?? ''} onChange={(e) => set({ url: e.target.value, recorded: !!e.target.value })} /></label>
          {outside && (
            <>
              <label className="lbl">Contact / client<input className="field" value={f.clientContact ?? ''} onChange={(e) => set({ clientContact: e.target.value })} /></label>
              <label className="lbl">Payment<select className="field" value={f.paid ?? 'none'} onChange={(e) => set({ paid: e.target.value as LogEntry['paid'] })}><option value="none">Unpaid</option><option value="fee">Pre-arranged fee</option><option value="reimbursement">Reimbursement / gift only</option></select></label>
              <label className="lbl">Fee received ($)<input className="field" type="number" value={f.fee ?? ''} onChange={(e) => set({ fee: e.target.value ? +e.target.value : undefined })} /></label>
            </>
          )}
        </div>
        <label className="lbl" style={{ marginTop: 12 }}>Notes: what worked, what was weak, what to change next time<textarea className="field" value={f.notes ?? ''} onChange={(e) => set({ notes: e.target.value })} /></label>
        <div className="row" style={{ marginTop: 12 }}>
          <button className="btn primary" onClick={save}>Add to log</button>
          {outside && <span className="small muted">Counts toward Accredited Speaker only with 20+ minutes and 20+ people, to a non-Toastmasters audience.</span>}
        </div>
      </div>
      <div className="card scroll-x" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Date</th><th>Type</th><th>Where</th><th>Speech</th><th>Min</th><th>Aud.</th><th>Fee</th><th>AS</th><th /></tr></thead>
          <tbody>
            {rows.length === 0 && <tr><td colSpan={9} className="muted">Nothing logged yet.</td></tr>}
            {rows.map((e) => (
              <tr key={e.id}>
                <td style={{ whiteSpace: 'nowrap' }}>{e.date}</td>
                <td className="small">{e.kind}</td>
                <td>{e.where}<div className="small muted">{e.title}{e.clientContact ? ` · ${e.clientContact}` : ''}</div></td>
                <td className="small">{sps.find((x) => x.id === e.speechId)?.name ?? ''}</td>
                <td>{e.minutes ?? ''}</td>
                <td>{e.audience ?? ''}</td>
                <td className="small">{e.paid === 'fee' ? `$${e.fee ?? 0}` : e.paid === 'reimbursement' ? 'reimb.' : ''}</td>
                <td>{qualifies(e) && <Badge tone="green">✓</Badge>}</td>
                <td><button className="btn ghost small" onClick={() => setState((x) => ({ ...x, log: x.log.filter((y) => y.id !== e.id) }))}>✕</button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
