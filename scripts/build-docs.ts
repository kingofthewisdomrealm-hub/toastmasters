// Regenerates /docs from the dashboard data. Run: node --experimental-strip-types scripts/build-docs.ts
import { readFileSync, writeFileSync } from 'node:fs';
import { requirements, TARGET_CYCLE } from '../src/data/requirements.ts';
import { roadmap } from '../src/data/roadmap.ts';
import { BLOCKS, blockOf, DAYS, ET, hm, occurrencesForWeek, zonedToUtc } from '../src/lib/time.ts';

const clubs = JSON.parse(readFileSync('src/data/clubs.json', 'utf8'));
const opps = JSON.parse(readFileSync('src/data/opportunities.json', 'utf8'));
const esc = (v: unknown) => (v === null || v === undefined ? '' : String(v).replace(/\|/g, '/').replace(/\n/g, ' '));
const csv = (rows: Record<string, unknown>[]) => {
  const keys = Object.keys(rows[0]);
  const q = (v: unknown) => `"${(Array.isArray(v) ? v.join('; ') : v ?? '').toString().replace(/"/g, '""')}"`;
  return [keys.join(','), ...rows.map((r) => keys.map((k) => q(r[k])).join(','))].join('\n');
};

// 02 gap analysis
let md = `# Deliverable 2: Accredited Speaker Gap-Analysis Checklist\n\nTarget: apply by ${TARGET_CYCLE.internalApplyBy} (official deadline ${TARGET_CYCLE.applyBy}, 5 p.m. MT). Stretch: ${TARGET_CYCLE.stretchApplyBy}.\nStatus “Confirm” = Josias must answer; not verifiable from public sources. Checked 2026-09-25.\n\n| # | Category | Requirement | Current status | Evidence needed | Action needed | Deadline | Source | Done? |\n|---|---|---|---|---|---|---|---|---|\n`;
requirements.forEach((r, i) => {
  md += `| ${i + 1} | ${r.category}${r.official ? '' : ' (prep)'} | ${esc(r.requirement)} | ${r.defaultStatus === 'unknown' ? 'Confirm' : r.defaultStatus.replace('_', ' ')} | ${esc(r.evidence)} | ${esc(r.action)} | ${r.deadline} | [link](${r.source}) | ${r.defaultStatus === 'done' ? '☑' : '☐'} |\n`;
});
writeFileSync('docs/02-gap-analysis-checklist.md', md);

// 03 clubs
writeFileSync('docs/03-club-database.csv', csv(clubs));
md = `# Deliverable 3: Online & Hybrid Toastmasters Club Database\n\n${clubs.length} clubs · ${new Set(clubs.map((c: any) => c.country)).size} countries · checked 2026-09-25. “official” = schedule read on the club’s toastmasters.org Find-a-Club page; “aggregator/district” = toastmost.org directory or a district roster. No Zoom links were invented; most clubs send the link by email. Full fields are in the CSV.\n\n| Club | City, Country | Day & local time (tz) | Frequency | Format | Language | Type | Verified via |\n|---|---|---|---|---|---|---|---|\n`;
for (const c of clubs) md += `| [${esc(c.name)}](${c.sourceUrl}) | ${esc(c.city)}, ${esc(c.country)} | ${c.meetingDay} ${c.localTime} (${c.timezone}) | ${esc(c.frequency)} | ${c.format} | ${esc(c.language)} | ${c.classification.join(', ')} | ${c.verificationLevel} |\n`;
writeFileSync('docs/03-club-database.md', md);

// 04 seven-day calendar, week of Mon Sep 28 2026
const ws = zonedToUtc(2026, 9, 28, 0, 0, ET);
const occ = occurrencesForWeek(clubs, ws);
md = `# Deliverable 4: Seven-Day Toastmasters Calendar (Eastern Time)\n\nWeek of Monday Sep 28 – Sunday Oct 4, 2026 (EDT). ${occ.length} meetings. † = the club meets on alternate weeks, so confirm this week. The live dashboard recalculates every week and handles daylight-saving changes (US ends Nov 1, Europe Oct 25, Australia started Oct 4).\n\n`;
for (const d of DAYS) {
  md += `## ${d}\n\n`;
  for (const b of BLOCKS) {
    const list = occ.filter((o) => o.et.weekday === d && blockOf(o.et.h) === b.key);
    if (!list.length) continue;
    md += `**${b.label} (${b.range})**\n\n`;
    for (const o of list) md += `- ${hm(o.et)}: ${o.club.name} (${o.club.city}, ${o.club.country}) · ${o.club.classification.join('/')}${o.certainty === 'maybe' ? ' †' : ''}\n`;
    md += '\n';
  }
}
writeFileSync('docs/04-seven-day-calendar-ET.md', md);

// 05 opportunities
writeFileSync('docs/05-speaking-opportunities.csv', csv(opps));
md = `# Deliverable 5: Treasure Coast Speaking Opportunities\n\n${opps.length} organizations · checked 2026-09-25. Contact names, emails, and phones are blank unless the organization publishes them. Find the program chair before you pitch.\n\n| Organization | Type | City | Ladder | Best speech | Paid | Why it fits | Source |\n|---|---|---|---|---|---|---|---|\n`;
for (const o of opps) md += `| ${esc(o.organization)} | ${o.type} | ${esc(o.city)} | ${o.ladderLevel} | ${o.speechFit.join(', ')} | ${o.paid} | ${esc(o.whyFit)} | [link](${o.source}) |\n`;
writeFileSync('docs/05-speaking-opportunities.md', md);

// 06 roadmap
md = `# Deliverable 6: 12-Month Accredited Speaker Roadmap (Oct 2026 – Sep 2027)\n\nGoal: 25 qualifying talks / 15 paid / 8 with a pre-arranged fee, 5 recommendations, and 2 candidate videos by Sep 2027. Oct–Dec 2027: add a safety margin, then apply in Jan 2028.\n\n`;
for (const m of roadmap) {
  md += `## ${m.label} · ${m.phase}\n\n**Milestone:** ${m.milestone}  \n**Running totals:** ${m.targets.engagements} talks · ${m.targets.paid} paid · ${m.targets.fee} with a fee\n\n**Weekly objectives**\n${m.weeks.map((w, i) => `${i + 1}. ${w}`).join('\n')}\n\n**Inside Toastmasters**\n${m.toastmasters.map((x) => `- ${x}`).join('\n')}\n\n**Outside Toastmasters**\n${m.outside.map((x) => `- ${x}`).join('\n')}\n\n`;
}
writeFileSync('docs/06-12-month-roadmap.md', md);
console.log('docs built', occ.length, 'meetings');
