import { useMemo, useState } from 'react';
import { ClubDrawer } from '../components/ClubDrawer';
import { Chips, Head } from '../components/ui';
import type { Club } from '../data/types';
import { clubs, clubStrength } from '../lib/derive';
import { useStore } from '../lib/store';
import { BLOCKS, blockOf, DAYS, ET, fmtDate, hm, occurrencesForWeek, partsIn, weekStartET } from '../lib/time';

const TYPES = ['PRACTICE', 'ADVANCED', 'PROFESSIONAL', 'STORYTELLING', 'INTERNATIONAL', 'LEADERSHIP'] as const;
const REGIONS = ['United States', 'Americas / Europe / Africa / Middle East', 'Asia-Pacific'] as const;
const LANGS = ['English', 'Spanish / bilingual'] as const;

export function Meetings() {
  const s = useStore();
  const [offset, setOffset] = useState(0);
  const [type, setType] = useState<(typeof TYPES)[number] | ''>('');
  const [region, setRegion] = useState<(typeof REGIONS)[number] | ''>('');
  const [lang, setLang] = useState<(typeof LANGS)[number] | ''>('');
  const [format, setFormat] = useState<'online' | 'hybrid' | ''>('');
  const [mine, setMine] = useState(false);
  const [best, setBest] = useState(false);
  const [club, setClub] = useState<Club | null>(null);

  const ws = useMemo(() => new Date(weekStartET().getTime() + offset * 7 * 86400000), [offset]);
  const filtered = clubs.filter(
    (c) =>
      (!type || c.classification.includes(type)) &&
      (!region || c.region === region) &&
      (!lang || (lang === 'English' ? /english/i.test(c.language) : !/^english$/i.test(c.language.trim()))) &&
      (!format || c.format === format) &&
      (!mine || s.favorites.includes(c.id)) &&
      (!best || clubStrength(c) >= 4),
  );
  const occ = occurrencesForWeek(filtered, ws);
  const todayP = partsIn(new Date(), ET);
  const dates = DAYS.map((_, i) => partsIn(new Date(ws.getTime() + (i * 24 + 12) * 3600000), ET));
  const blocksFilled = BLOCKS.filter((b) => occ.some((o) => blockOf(o.et.h) === b.key)).length;

  return (
    <div>
      <Head
        title="Meetings"
        sub={`${occ.length} meetings this week, shown in Eastern Time (daylight saving handled automatically) · ${blocksFilled}/5 time blocks covered`}
        right={
          <div className="row">
            <button className="btn" onClick={() => setOffset(offset - 1)}>←</button>
            <span className="small">Week of {fmtDate(`${dates[0].y}-${String(dates[0].m).padStart(2, '0')}-${String(dates[0].d).padStart(2, '0')}`)}</span>
            <button className="btn" onClick={() => setOffset(offset + 1)}>→</button>
          </div>
        }
      />
      <div className="card tight stack" style={{ marginBottom: 16 }}>
        <Chips value={type} options={TYPES} onChange={setType} all="All types" />
        <Chips value={region} options={REGIONS} onChange={setRegion} all="All regions" />
        <div className="row">
          <Chips value={lang} options={LANGS} onChange={setLang} all="Any language" />
          <Chips value={format} options={['online', 'hybrid'] as const} onChange={setFormat} all="Online + hybrid" />
          <button className={`chip${mine ? ' on' : ''}`} onClick={() => setMine(!mine)}>★ My rotation</button>
          <button className={`chip${best ? ' on' : ''}`} onClick={() => setBest(!best)}>Strongest for development</button>
        </div>
      </div>
      <div className="card scroll-x" style={{ padding: 12 }}>
        <div className="week">
          <div />
          {DAYS.map((d, i) => (
            <div key={d} className={`h${dates[i].d === todayP.d && dates[i].m === todayP.m && offset === 0 ? ' today' : ''}`}>
              {d.slice(0, 3)} {dates[i].m}/{dates[i].d}
            </div>
          ))}
          {BLOCKS.map((b) => (
            <Row key={b.key} label={b.label} range={b.range} items={DAYS.map((d) => occ.filter((o) => o.et.weekday === d && blockOf(o.et.h) === b.key))} onPick={setClub} />
          ))}
        </div>
      </div>
      <div className="small muted" style={{ marginTop: 10 }}>
        Purple edge = Advanced · orange edge = Professional · dashed = club meets on alternate weeks (confirm before joining). Late-night meetings after midnight appear on the next day’s column.
        Never join a meeting on a Zoom link you haven’t confirmed with the club. Most clubs send the link by email.
      </div>
      <ClubDrawer club={club} onClose={() => setClub(null)} />
    </div>
  );
}

function Row({ label, range, items, onPick }: { label: string; range: string; items: ReturnType<typeof occurrencesForWeek>[]; onPick: (c: Club) => void }) {
  return (
    <>
      <div className="blk">{label}<span>{range}</span></div>
      {items.map((list, i) => (
        <div className="cell" key={i}>
          {list.map((o) => (
            <button
              key={o.club.id + o.start.getTime()}
              className={`mtg${o.club.classification.includes('ADVANCED') ? ' adv' : o.club.classification.includes('PROFESSIONAL') ? ' pro' : ''}${o.certainty === 'maybe' ? ' maybe' : ''}`}
              onClick={() => onPick(o.club)}
              title={`${o.club.name} (${o.club.city})`}
            >
              <b>{hm(o.et)}</b>
              {o.club.name.replace(/ Toastmasters?( Club)?/i, '').slice(0, 34)}
              <div className="muted" style={{ fontSize: 10.5 }}>{o.club.country === 'United States' ? o.club.city : o.club.country}</div>
            </button>
          ))}
        </div>
      ))}
    </>
  );
}
