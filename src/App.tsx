import { useEffect, useRef, useState } from 'react';
import { Accredited } from './pages/Accredited';
import { Clubs, Opportunities, Outreach } from './pages/Directory';
import { Home } from './pages/Home';
import { SpeechLab, SpeakingLog } from './pages/Lab';
import { Meetings } from './pages/Meetings';
import { Analytics, Roadmap, Weekly } from './pages/Plan';
import { exportState, importState } from './lib/store';

const ROUTES = [
  { path: '', label: 'Home', el: Home },
  { path: 'roadmap', label: 'Roadmap', el: Roadmap },
  { path: 'meetings', label: 'Meetings', el: Meetings },
  { path: 'clubs', label: 'Clubs', el: Clubs },
  { path: 'lab', label: 'Speech Lab', el: SpeechLab },
  { path: 'opportunities', label: 'Opportunities', el: Opportunities },
  { path: 'outreach', label: 'Outreach', el: Outreach },
  { path: 'log', label: 'Speaking Log', el: SpeakingLog },
  { path: 'accredited', label: 'Accredited Speaker', el: Accredited },
  { path: 'weekly', label: 'Weekly Plan', el: Weekly },
  { path: 'analytics', label: 'Analytics', el: Analytics },
];

function useRoute() {
  const get = () => window.location.hash.replace(/^#\/?/, '');
  const [r, setR] = useState(get());
  useEffect(() => {
    const f = () => { setR(get()); window.scrollTo(0, 0); };
    window.addEventListener('hashchange', f);
    return () => window.removeEventListener('hashchange', f);
  }, []);
  return r;
}

export default function App() {
  const route = useRoute();
  const cur = ROUTES.find((x) => x.path === route) ?? ROUTES[0];
  const Page = cur.el;
  const file = useRef<HTMLInputElement>(null);
  const links = ROUTES.map((x, i) => (
    <a key={x.path} href={`#/${x.path}`} className={x === cur ? 'on' : ''}>
      <span className="num">{i === 0 ? '⌂' : i}</span>{x.label}
    </a>
  ));
  return (
    <div className="shell">
      <aside className="side">
        <div className="brand">Speaker Command Center<small>Josias Andujar · Accredited Speaker path</small></div>
        <nav className="nav">{links}</nav>
        <div className="side-foot">
          <button className="btn" onClick={exportState}>Export my data</button>
          <button className="btn" onClick={() => file.current?.click()}>Import backup</button>
          <input ref={file} type="file" accept="application/json" hidden onChange={async (e) => { const f = e.target.files?.[0]; if (f) { try { await importState(f); } catch (err) { console.log(err); } } }} />
          <div className="small muted">Your changes save in this browser. Export to move them to another device.</div>
        </div>
      </aside>
      <nav className="mobile-nav">{ROUTES.map((x) => <a key={x.path} href={`#/${x.path}`} className={x === cur ? 'on' : ''}>{x.label}</a>)}</nav>
      <main className="main"><Page /></main>
    </div>
  );
}
