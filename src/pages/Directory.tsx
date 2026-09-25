import { useState } from 'react';
import { ClubDrawer } from '../components/ClubDrawer';
import { OppDrawer, OUTREACH, setOutreach } from '../components/OppDrawer';
import { Badge, Chips, Head } from '../components/ui';
import { ladder } from '../data/roadmap';
import { speeches } from '../data/speeches';
import type { Club, Opportunity } from '../data/types';
import { clubs, clubStrength, opportunities, PRIORITY } from '../lib/derive';
import { useStore } from '../lib/store';
import { ET, hm, occurrencesForWeek, weekStartET } from '../lib/time';

const etLabel = (c: Club) => {
  const ws = weekStartET();
  const o = [...occurrencesForWeek([c], ws), ...occurrencesForWeek([c], new Date(ws.getTime() + 7 * 86400000)), ...occurrencesForWeek([c], new Date(ws.getTime() + 14 * 86400000))][0];
  return o ? `${o.et.weekday.slice(0, 3)} ${hm(o.et)}` : `${c.meetingDay.slice(0, 3)} (see schedule)`;
};

export function Clubs() {
  const s = useStore();
  const [q, setQ] = useState('');
  const [club, setClub] = useState<Club | null>(null);
  const [sort, setSort] = useState<'strength' | 'name' | 'country'>('strength');
  const list = clubs
    .filter((c) => !q || `${c.name} ${c.city} ${c.country} ${c.specialty} ${c.language} ${c.classification.join(' ')} ${c.district}`.toLowerCase().includes(q.toLowerCase()))
    .sort((a, b) => (sort === 'strength' ? clubStrength(b) - clubStrength(a) : sort === 'name' ? a.name.localeCompare(b.name) : a.country.localeCompare(b.country)));
  return (
    <div>
      <Head title="Clubs" sub={`${clubs.length} online & hybrid clubs in ${new Set(clubs.map((c) => c.country)).size} countries · every schedule checked on ${clubs[0].lastVerified}`} />
      <div className="row" style={{ marginBottom: 14 }}>
        <input className="field" style={{ maxWidth: 380 }} placeholder="Search name, city, country, specialty, language…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Chips value={sort} options={['strength', 'name', 'country'] as const} onChange={(v) => setSort(v || 'strength')} all="Sort:" />
      </div>
      <div className="card scroll-x" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Club</th><th>Where</th><th>Next (ET)</th><th>Freq.</th><th>Type</th><th>Lang.</th><th>Source</th></tr></thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="click" onClick={() => setClub(c)}>
                <td><b>{s.favorites.includes(c.id) && '★ '}{c.name}</b><div className="small muted">{c.specialty}</div></td>
                <td>{c.city}<div className="small muted">{c.country}</div></td>
                <td style={{ whiteSpace: 'nowrap' }}>{etLabel(c)}<div className="small muted">{c.format}</div></td>
                <td className="small">{c.frequency}</td>
                <td>{c.classification.map((x) => <Badge key={x} tone={x === 'ADVANCED' || x === 'PROFESSIONAL' ? 'blue' : undefined}>{x}</Badge>)}</td>
                <td className="small">{c.language}</td>
                <td>{c.verificationLevel === 'official' ? <Badge tone="green">official</Badge> : <Badge tone="amber">{c.verificationLevel}</Badge>}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="small muted">“Official” = schedule read from the club’s toastmasters.org page. “Aggregator” or “district” = read from toastmost.org or a district roster. Confirm with the club before your first visit. Times are shown in {ET}.</p>
      <ClubDrawer club={club} onClose={() => setClub(null)} />
    </div>
  );
}

export function Opportunities() {
  const s = useStore();
  const [q, setQ] = useState('');
  const [fit, setFit] = useState('');
  const [lvl, setLvl] = useState('');
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const fits = speeches.map((x) => x.name === 'From Cabinet Shop to General Contractor' ? 'Building a Trade Business' : x.name.startsWith('Condo') ? 'Condo Milestone & SIRS' : x.name.startsWith('Hurricane') ? 'Hurricane Hardening' : x.name);
  const list = opportunities.filter(
    (o) =>
      (!q || `${o.organization} ${o.city} ${o.type} ${o.county}`.toLowerCase().includes(q.toLowerCase())) &&
      (!fit || o.speechFit.includes(fit)) &&
      (!lvl || String(o.ladderLevel) === lvl),
  );
  return (
    <div>
      <Head title="Opportunities" sub={`${opportunities.length} Treasure Coast organizations that use guest speakers, matched to your talks · ★ = top 10 first targets`} />
      <div className="card tight stack" style={{ marginBottom: 14 }}>
        <input className="field" placeholder="Search organization, city, type…" value={q} onChange={(e) => setQ(e.target.value)} />
        <Chips value={fit} options={[...fits, 'Aging in Place']} onChange={setFit} all="Any speech" />
        <Chips value={lvl} options={ladder.map((l) => String(l.level))} onChange={setLvl} all="Any ladder level" />
      </div>
      <div className="card scroll-x" style={{ padding: 0 }}>
        <table className="tbl">
          <thead><tr><th>Organization</th><th>Where</th><th>Ladder</th><th>Best speech</th><th>Paid</th><th>Status</th></tr></thead>
          <tbody>
            {list.map((o) => (
              <tr key={o.id} className="click" onClick={() => setOpp(o)}>
                <td><b>{PRIORITY.includes(o.id) && '★ '}{o.organization}</b><div className="small muted">{o.type}</div></td>
                <td>{o.city}<div className="small muted">{o.county}</div></td>
                <td>{o.ladderLevel}</td>
                <td className="small">{o.speechFit.join(', ')}</td>
                <td><Badge tone={o.paid === 'paid' ? 'green' : o.paid === 'unknown' ? 'amber' : undefined}>{o.paid}</Badge></td>
                <td><Badge tone="blue">{s.outreach[o.id]?.status ?? 'Research'}</Badge></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <OppDrawer opp={opp} onClose={() => setOpp(null)} />
    </div>
  );
}

export function Outreach() {
  const s = useStore();
  const [opp, setOpp] = useState<Opportunity | null>(null);
  const [drag, setDrag] = useState<string | null>(null);
  return (
    <div>
      <Head title="Outreach" sub="Drag a card, or open it, to move an organization forward. Contacts, follow-ups, and bookings go into the Speaking Log automatically." />
      <div className="scroll-x">
        <div className="kanban">
          {OUTREACH.map((st) => {
            const items = opportunities.filter((o) => (s.outreach[o.id]?.status ?? 'Research') === st);
            return (
              <div key={st} className="col" onDragOver={(e) => e.preventDefault()} onDrop={() => { const o = opportunities.find((x) => x.id === drag); if (o) setOutreach(o.id, st, o.organization); setDrag(null); }}>
                <h3>{st}<span className="muted">{items.length}</span></h3>
                {items.map((o) => (
                  <div key={o.id} className="card tight" draggable onDragStart={() => setDrag(o.id)} onClick={() => setOpp(o)} style={{ cursor: 'pointer', padding: 10 }}>
                    <div className="t small">{o.organization}</div>
                    <div className="muted" style={{ fontSize: 11.5 }}>{o.city} · L{o.ladderLevel}{s.outreach[o.id]?.followUp ? ` · follow up ${s.outreach[o.id]!.followUp}` : ''}</div>
                  </div>
                ))}
              </div>
            );
          })}
        </div>
      </div>
      <OppDrawer opp={opp} onClose={() => setOpp(null)} />
    </div>
  );
}
