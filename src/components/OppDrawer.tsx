import type { Opportunity, OutreachStatus } from '../data/types';
import { ladder } from '../data/roadmap';
import { setState, uid, useStore } from '../lib/store';
import { todayISO_ET } from '../lib/time';
import { Badge, Drawer, Ext } from './ui';

export const OUTREACH: OutreachStatus[] = ['Research', 'Contact', 'Follow-up', 'Conversation', 'Booked', 'Delivered', 'Referral'];

const nextAction: Record<OutreachStatus, string> = {
  Research: 'Find the program chair or speaker coordinator (website, LinkedIn, or call the office).',
  Contact: 'Send a short pitch: 3 talk titles, a 1-line bio, and your one-sheet. Offer 2 dates.',
  'Follow-up': 'Follow up 5 business days after the first contact. Mention a timely hook (hurricane season, SIRS deadlines).',
  Conversation: 'Confirm date, length (20+ min), audience size (20+), and fee or expenses IN WRITING.',
  Booked: 'Send your introduction script. Ask for permission to record. Ask the host for the head count.',
  Delivered: 'Log it. Send a thank-you. If they paid, ask them to send the recommendation form.',
  Referral: 'Ask: “Who else should hear this?” Get 2 names.',
};

export function setOutreach(id: string, status: OutreachStatus, org: string) {
  setState((s) => {
    const prev = s.outreach[id]?.status;
    const log = [...s.log];
    const today = todayISO_ET();
    if (status === 'Contact' && prev !== 'Contact') log.push({ id: uid(), date: today, kind: 'Outreach contact', title: `Contacted ${org}`, where: org });
    if (status === 'Follow-up' && prev !== 'Follow-up') log.push({ id: uid(), date: today, kind: 'Follow-up', title: `Followed up with ${org}`, where: org });
    if (status === 'Booked' && prev !== 'Booked') log.push({ id: uid(), date: today, kind: 'Booking', title: `Booked ${org}`, where: org });
    return { ...s, log, outreach: { ...s.outreach, [id]: { ...s.outreach[id], status } } };
  });
}

export function OppDrawer({ opp, onClose }: { opp: Opportunity | null; onClose: () => void }) {
  const s = useStore();
  if (!opp) return null;
  const rec = s.outreach[opp.id] ?? { status: 'Research' as OutreachStatus };
  return (
    <Drawer open onClose={onClose}>
      <div className="stack">
        <div className="eyebrow">{opp.type} · {opp.city}, {opp.county} County</div>
        <h2>{opp.organization}</h2>
        <div className="row">
          <Badge tone="blue">Ladder {opp.ladderLevel}: {ladder.find((l) => l.level === opp.ladderLevel)?.name}</Badge>
          <Badge tone={opp.paid === 'paid' ? 'green' : opp.paid === 'unpaid' ? undefined : 'amber'}>{opp.paid}</Badge>
        </div>
        <div className="mission">
          <div className="eyebrow">Recommended speech</div>
          <div style={{ fontWeight: 600, marginTop: 4 }}>{opp.speechFit.join(' · ')}</div>
          <div className="small" style={{ marginTop: 4 }}>{opp.whyFit}</div>
        </div>
        <div>
          <div className="eyebrow" style={{ marginBottom: 6 }}>Outreach status</div>
          <div className="row" style={{ gap: 6 }}>
            {OUTREACH.map((o) => (
              <button key={o} className={`chip${rec.status === o ? ' on' : ''}`} onClick={() => setOutreach(opp.id, o, opp.organization)}>{o}</button>
            ))}
          </div>
          <div className="small" style={{ marginTop: 8 }}><b>Next action:</b> {nextAction[rec.status]}</div>
        </div>
        <div className="row">
          <label className="lbl" style={{ flex: 1 }}>Follow-up date
            <input className="field" type="date" value={rec.followUp ?? ''} onChange={(e) => setState((x) => ({ ...x, outreach: { ...x.outreach, [opp.id]: { ...rec, followUp: e.target.value } } }))} />
          </label>
        </div>
        <label className="lbl">Notes
          <textarea className="field" value={rec.notes ?? ''} onChange={(e) => setState((x) => ({ ...x, outreach: { ...x.outreach, [opp.id]: { ...rec, notes: e.target.value } } }))} />
        </label>
        <dl className="kv">
          <dt>Audience</dt><dd>{opp.audience ?? '—'}{opp.audienceSize ? ` · ${opp.audienceSize}` : ''}</dd>
          <dt>Meets</dt><dd>{opp.meetingFrequency ?? '—'} {opp.meetingDetails ? `· ${opp.meetingDetails}` : ''}</dd>
          <dt>Typical speakers</dt><dd>{opp.typicalSpeakers ?? '—'}</dd>
          <dt>Contact</dt><dd>{opp.contactName ?? <span className="muted">Not published. Find the program chair.</span>}</dd>
          <dt>Email / phone</dt><dd>{opp.email ? <a href={`mailto:${opp.email}`}>{opp.email}</a> : '—'} {opp.phone ?? ''}</dd>
          <dt>Website</dt><dd><Ext href={opp.website} /></dd>
          <dt>Apply / speak page</dt><dd><Ext href={opp.applicationPage} /></dd>
          <dt>Requirements</dt><dd>{opp.speakingRequirements ?? '—'}</dd>
          <dt>Notes</dt><dd className="small">{opp.notes ?? '—'}</dd>
          <dt>Source</dt><dd><Ext href={opp.source} /> <span className="muted small">· checked {opp.lastVerified}</span></dd>
        </dl>
      </div>
    </Drawer>
  );
}
