import type { Club } from '../data/types';
import { clubStrength, mergedSpeeches, missionFor } from '../lib/derive';
import { setState, useStore } from '../lib/store';
import { ET, hm, occurrencesForWeek, tzAbbr, weekStartET } from '../lib/time';
import { Badge, Drawer, Ext } from './ui';

const yn = (v: boolean | null) => (v === null ? 'Unknown: ask the club' : v ? 'Yes' : 'No');

export function ClubDrawer({ club, onClose }: { club: Club | null; onClose: () => void }) {
  const s = useStore();
  if (!club) return null;
  const sp = mergedSpeeches(s).find((x) => x.id === s.activeSpeechId) ?? mergedSpeeches(s)[0];
  const ws = weekStartET();
  const next = [...occurrencesForWeek([club], ws), ...occurrencesForWeek([club], new Date(ws.getTime() + 7 * 86400000))][0];
  const fav = s.favorites.includes(club.id);
  return (
    <Drawer open onClose={onClose}>
      <div className="stack">
        <div className="eyebrow">{club.city}, {club.country}</div>
        <h2>{club.name}</h2>
        <div className="row">
          {club.classification.map((c) => <Badge key={c} tone="blue">{c}</Badge>)}
          <Badge>{club.format}</Badge>
          <Badge>{club.language}</Badge>
          {club.verificationLevel === 'official' ? <Badge tone="green">Verified on toastmasters.org</Badge> : <Badge tone="amber">Verified via {club.verificationLevel} listing</Badge>}
          {clubStrength(club) >= 4 && <Badge tone="green">Strong for development</Badge>}
        </div>
        <div className="mission">
          <div className="eyebrow">Mission for this meeting</div>
          <div style={{ marginTop: 4, fontWeight: 500 }}>{missionFor(club, sp)}</div>
        </div>
        <dl className="kv">
          <dt>When (ET)</dt>
          <dd>{next ? <><b>{next.et.weekday} {hm(next.et)} {tzAbbr(next.start, ET)}</b>{next.certainty === 'maybe' && ' · alternate weeks, confirm with club'}</> : 'Not in the next 2 weeks: check the club schedule'}</dd>
          <dt>Local time</dt>
          <dd>{club.meetingDay} {club.localTime} · {club.timezone}</dd>
          <dt>Frequency</dt><dd>{club.frequency}</dd>
          <dt>Duration</dt><dd>{club.durationMin ? `${club.durationMin} min` : '—'}</dd>
          <dt>Zoom link</dt><dd>{club.zoomLink ? <Ext href={club.zoomLink} /> : <span className="muted">Not published. Ask the club.</span>}</dd>
          <dt>Website</dt><dd><Ext href={club.website} /></dd>
          <dt>Club # / District</dt><dd>{club.clubNumber ?? '—'} · {club.district ?? '—'}</dd>
          <dt>Contact</dt><dd>{club.contactName ?? '—'} {club.contactEmail && <a href={`mailto:${club.contactEmail}`}>{club.contactEmail}</a>}</dd>
          <dt>Guest policy</dt><dd>{club.guestPolicy ?? '—'}</dd>
          <dt>Guests may speak</dt><dd>{yn(club.guestsMaySpeak)}</dd>
          <dt>Visitors take roles</dt><dd>{yn(club.visitorsMayTakeRoles)}</dd>
          <dt>Specialty</dt><dd>{club.specialty ?? '—'}</dd>
          <dt>Activity</dt><dd>{club.activity ?? '—'}</dd>
          <dt>Notes</dt><dd className="small">{club.notes ?? '—'}</dd>
          <dt>Source</dt><dd><Ext href={club.sourceUrl} /> <span className="muted small">· checked {club.lastVerified}</span></dd>
        </dl>
        <div className="small muted">Possible roles for a visitor: Table Topics speaker, Timer, Ah-Counter, Grammarian, Evaluator. Ask the VP Education 2–3 days ahead for a speech slot.</div>
        <div className="row">
          <button className="btn primary" onClick={() => setState((x) => ({ ...x, favorites: fav ? x.favorites.filter((i) => i !== club.id) : [...x.favorites, club.id] }))}>
            {fav ? '★ In my rotation' : '☆ Add to my rotation'}
          </button>
        </div>
      </div>
    </Drawer>
  );
}
