# Speaker Command Center: Accredited Speaker Roadmap

A dashboard and research base to help Josias Andujar become a Toastmasters **Accredited Speaker**.

**Toastmasters is the laboratory. The outside world is the field.**

## What's inside

| Deliverable | Where |
|---|---|
| 1. Current Accredited Speaker requirements (with official sources) | `docs/01-accredited-speaker-requirements.md` · dashboard → Accredited Speaker |
| 2. Gap-analysis checklist | `docs/02-gap-analysis-checklist.md` · dashboard → Accredited Speaker |
| 3. 133 online/hybrid Toastmasters clubs, 37 countries | `docs/03-club-database.csv` / `.md` · dashboard → Clubs |
| 4. Seven-day meeting calendar in Eastern Time | `docs/04-seven-day-calendar-ET.md` · dashboard → Meetings (live, DST-aware) |
| 5. 66 Treasure Coast speaking opportunities | `docs/05-speaking-opportunities.csv` / `.md` · dashboard → Opportunities |
| 6. 12-month roadmap | `docs/06-12-month-roadmap.md` · dashboard → Roadmap |
| 7. Dashboard (Vite + React + TypeScript) | `src/` |

## Deploy on Vercel (one time)

1. Go to vercel.com → **Add New… → Project** → import `kingofthewisdomrealm-hub/toastmasters`.
2. Vercel detects **Vite** on its own. Build command `npm run build`, output folder `dist`. Click **Deploy**.
3. Each push to `main` redeploys the site automatically.

## Run it on your computer

```bash
npm install
npm run dev      # live preview at http://localhost:5173
npm run build    # produces dist/index.html (one self-contained file)
npm run docs     # regenerates /docs from the data files
```

## Where the data lives

- `src/data/clubs.json`: club database (edit to add, fix, or re-verify clubs)
- `src/data/opportunities.json`: local speaking organizations
- `src/data/requirements.ts`: official AS requirements and the checklist
- `src/data/roadmap.ts`: 12-month plan
- `src/data/speeches.ts`: Speech Lab seed speeches
- Your logs, outreach statuses, and checklist ticks save in your browser (localStorage). Use **Export my data** to back them up or move them to another device.

## Research rules

Never invent Zoom links or schedules. Each club and organization row stores `sourceUrl`/`source` and `lastVerified`. Recheck the Handbook (Item 690) every December, before the Jan 1–31 application window.
