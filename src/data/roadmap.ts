// 12-month Accredited Speaker development roadmap.
// Target: apply Jan 2028 (deadline Jan 31, 2028). Stretch check in Jan 2027.
// Targets are cumulative qualifying outside engagements (20+ people, 20+ min, non-Toastmasters).

export type Month = {
  key: string; // YYYY-MM
  label: string;
  phase: 'A · Foundation' | 'B · Repetition' | 'C · Speech development' | 'D · External validation' | 'E · Professional speaking' | 'F · Application prep';
  milestone: string;
  targets: { engagements: number; paid: number; fee: number; pathwaysLevel: number };
  weeks: [string, string, string, string];
  toastmasters: string[];
  outside: string[];
};

export const roadmap: Month[] = [
  {
    key: '2026-10', label: 'Oct 2026', phase: 'A · Foundation',
    milestone: 'Membership confirmed, path started, speaking inventory done, first 10 organizations contacted',
    targets: { engagements: 1, paid: 0, fee: 0, pathwaysLevel: 1 },
    weeks: [
      'Confirm membership. Join 1–2 online clubs (pick from the Clubs tab). Enroll in Presentation Mastery.',
      'Speaking inventory: list every talk, story, workshop, and area of expertise you already have. Write the Missing Piece opening.',
      'Give the Missing Piece 5-minute version at 2 clubs. Email 3 AS mentors.',
      'Make speaker one-sheet v1. Contact the top 10 local organizations (Outreach tab).',
    ],
    toastmasters: ['Ice Breaker (Pathways L1) built from the Missing Piece opening', 'Take 2 meeting roles', 'Table Topics at every meeting'],
    outside: ['Speaker one-sheet v1', 'Contact 10 organizations', 'Set up the engagement log habit', 'Ask 3 AS mentors'],
  },
  {
    key: '2026-11', label: 'Nov 2026', phase: 'B · Repetition',
    milestone: 'Missing Piece v3 (7 min) tested at 3 clubs; first outside talk booked',
    targets: { engagements: 2, paid: 0, fee: 0, pathwaysLevel: 1 },
    weeks: [
      'Missing Piece v1 → Club A. Write down the 3 weakest moments.',
      'v2 → Club B. Test a new story in the middle section.',
      'v3 → Club C (an Advanced club). Ask for tough feedback.',
      'Stretch v3 to 20 minutes. Follow up with everyone you contacted in October.',
    ],
    toastmasters: ['Finish Pathways Level 1', 'Same speech at 3 clubs', 'Evaluate 2 speakers'],
    outside: ['Book the first community talk (Sebastian River Chamber or Rotary Club of Sebastian)', 'Contact 10 more organizations'],
  },
  {
    key: '2026-12', label: 'Dec 2026', phase: 'C · Speech development',
    milestone: 'Missing Piece at 20 minutes; Money: What’s Missing? 5-minute test',
    targets: { engagements: 3, paid: 0, fee: 0, pathwaysLevel: 2 },
    weeks: [
      'Give the Missing Piece 20-minute talk at a community group. Record it (practice video).',
      'Money: What’s Missing? outline and 5-minute test.',
      'Watch the recording. Score yourself against the Level 1 ballot.',
      'Plan January: pick the expertise talk (Condo Milestone & SIRS) for boards and CAI.',
    ],
    toastmasters: ['Pathways Level 2 projects', 'Test the Money opening', 'Humor experiment: 1 planned laugh per 2 minutes'],
    outside: ['First 20-minute outside talk', 'First practice recording', 'Ask the host for the head count and a written thank-you'],
  },
  {
    key: '2027-01', label: 'Jan 2027', phase: 'C · Speech development',
    milestone: 'Decide: apply now (Jan 31, 2027) or build for 2028. Condo Milestone & SIRS 20-min talk ready.',
    targets: { engagements: 5, paid: 1, fee: 0, pathwaysLevel: 2 },
    weeks: [
      'STRETCH CHECK: if you already have 25 qualifying talks since Feb 2024 (15 paid), apply by Jan 31, 2027. If not, keep building.',
      'Build the Condo Milestone & SIRS talk (20 min) for condo boards and CAI.',
      'Set your fee sheet: local community rate, association rate, workshop rate.',
      'Pitch 5 associations and HOA groups with a paid workshop offer.',
    ],
    toastmasters: ['Give the SIRS talk to a Toastmasters audience first (clarity test for non-experts)', 'Pathways Level 2 done'],
    outside: ['Fee sheet', 'First paid booking (even a small fee counts, if agreed in advance)', '2 more community talks'],
  },
  {
    key: '2027-02', label: 'Feb 2027', phase: 'D · External validation',
    milestone: 'Rotary and civic circuit: 3 outside talks this month',
    targets: { engagements: 8, paid: 2, fee: 1, pathwaysLevel: 3 },
    weeks: [
      'Rotary talk #1 (Missing Piece). Ask for a referral to 2 other clubs.',
      'Kiwanis or Lions talk. Collect a testimonial on camera (phone is fine).',
      'Paid association workshop (SIRS).',
      'Update the speaker one-sheet with photos and testimonials.',
    ],
    toastmasters: ['Pathways Level 3 + Education Series talk', 'Practice Q&A handling'],
    outside: ['3 outside talks', 'First recommendation-form candidate identified (paying client)'],
  },
  {
    key: '2027-03', label: 'Mar 2027', phase: 'D · External validation',
    milestone: 'Hurricane-season talk launched; 2 paid engagements in one month',
    targets: { engagements: 11, paid: 4, fee: 2, pathwaysLevel: 3 },
    weeks: [
      'Build the Hurricane Hardening / My Safe Florida Home talk. Demand peaks before June 1.',
      'Pitch HOAs, realtor associations, and senior communities for paid pre-season workshops.',
      'Deliver 2 hurricane talks.',
      'Ask the paying clients to send recommendation forms right away.',
    ],
    toastmasters: ['Test demonstrations and props at a club', 'Evaluate at an Advanced club'],
    outside: ['3 outside talks (2 paid)', 'First recommendation form sent in'],
  },
  {
    key: '2027-04', label: 'Apr 2027', phase: 'D · External validation',
    milestone: '45–60 minute workshop version of the best talk',
    targets: { engagements: 14, paid: 6, fee: 3, pathwaysLevel: 3 },
    weeks: [
      'Turn the strongest talk into a 45–60 minute workshop with 2 audience exercises.',
      'Deliver the workshop (Chamber, SCORE, or Builders Association).',
      '2 more talks. Record one with a single camera and a lapel mic.',
      'Review: what gets the biggest audience response? Put more of it in.',
    ],
    toastmasters: ['Pathways Level 3 done', 'Facilitate a club workshop'],
    outside: ['3 outside talks', 'Workshop offer page'],
  },
  {
    key: '2027-05', label: 'May 2027', phase: 'E · Professional speaking',
    milestone: 'Keynote offer packaged; 8 paid engagements total',
    targets: { engagements: 16, paid: 8, fee: 5, pathwaysLevel: 4 },
    weeks: [
      'Package 3 offers: keynote, workshop, and board briefing, each with a fee.',
      'Pitch 5 regional conferences and associations (Orlando, Palm Beach).',
      '2 paid talks.',
      'Second recommendation form.',
    ],
    toastmasters: ['Pathways Level 4 projects', 'Better Speaker Series talk'],
    outside: ['2 paid talks', 'Conference pitches', 'Speaker page live'],
  },
  {
    key: '2027-06', label: 'Jun 2027', phase: 'E · Professional speaking',
    milestone: 'Candidate video #1 recorded (unedited, with an introducer)',
    targets: { engagements: 18, paid: 10, fee: 6, pathwaysLevel: 4 },
    weeks: [
      'Choose the paid engagement to film. Arrange the camera, audio, and the person introducing you.',
      'Write your professional introduction. It must state your expertise.',
      'Record video #1 (20–60 min, no edits).',
      'Send it to your mentor to score against the Level 1 ballot.',
    ],
    toastmasters: ['Rehearse the full video talk at 2 clubs before filming', 'Take General Evaluator / Toastmaster roles (L4 requirements)'],
    outside: ['2 paid talks', 'Video #1', 'Third recommendation form'],
  },
  {
    key: '2027-07', label: 'Jul 2027', phase: 'E · Professional speaking',
    milestone: 'Mentor feedback applied; 11 paid, 7 with a pre-arranged fee',
    targets: { engagements: 21, paid: 11, fee: 7, pathwaysLevel: 4 },
    weeks: [
      'Rework the talk using the mentor’s ballot scores.',
      '2 outside talks.',
      'Ask the best Rotary and Chamber contacts for referrals to paying organizations.',
      'Plan the Pathways Level 5 schedule.',
    ],
    toastmasters: ['Pathways Level 4 done', 'Test the new opening and closing'],
    outside: ['3 outside talks', 'Referral requests'],
  },
  {
    key: '2027-08', label: 'Aug 2027', phase: 'E · Professional speaking',
    milestone: 'Pathways Level 5 underway; watch the AS Level 2 session (Paris convention, Aug 18–21)',
    targets: { engagements: 23, paid: 13, fee: 8, pathwaysLevel: 5 },
    weeks: [
      'Level 5: “Prepare to Speak Professionally.”',
      'Watch the 2027 convention AS Level 2 coverage. Note what passing talks do.',
      '2 paid talks.',
      'Fourth recommendation form.',
    ],
    toastmasters: ['Level 5 roles: General Evaluator ×2, Toastmaster ×2, Evaluator ×2', 'Leadership Excellence Series talk'],
    outside: ['2 paid talks', 'Fourth recommendation form'],
  },
  {
    key: '2027-09', label: 'Sep 2027', phase: 'F · Application prep',
    milestone: '25 engagements / 15 paid / 8 with a fee reached; candidate video #2',
    targets: { engagements: 25, paid: 15, fee: 8, pathwaysLevel: 5 },
    weeks: [
      'Audit the log against the Rev. 10/2022 fields. Fix any gaps now.',
      'Record video #2 at your best paid engagement.',
      'Fifth recommendation form. Ask WHQ to confirm all 5 are on file.',
      'Plan Oct–Dec: grow to 30 engagements, finish the path, draft the application.',
    ],
    toastmasters: ['Finish Pathways Level 5 + Reflect on Your Path', 'Give the Level 2-style 15–18 min talk at an Advanced club'],
    outside: ['Video #2', 'All 5 recommendations confirmed', 'Application draft started'],
  },
];

export const ROADMAP_START = '2026-09-28'; // Monday of launch week

export const ladder = [
  { level: 1, name: 'Toastmasters', note: 'Lab: safe repetitions' },
  { level: 2, name: 'Small community groups', note: 'Libraries, senior centers, churches' },
  { level: 3, name: 'Rotary / civic clubs', note: 'Weekly speaker slots' },
  { level: 4, name: 'Business networking', note: 'BNI, YPN, networking groups' },
  { level: 5, name: 'Chambers / associations', note: 'CAI, builders, realtors' },
  { level: 6, name: 'Universities / conferences', note: 'IRSC, TEDx, regional events' },
  { level: 7, name: 'Paid workshops', note: 'Pre-arranged fee' },
  { level: 8, name: 'Professional keynotes', note: 'Fee + travel' },
];

export const backChain = [
  'Accredited Speaker',
  'Level 2 live talk at the convention (15–18 min)',
  'Level 1: application + video + 5 recommendations',
  '25 outside talks · 15 paid · 8 with a pre-arranged fee',
  'Signature talks that work outside Toastmasters',
  'Community → civic → business → paid audiences',
  'Toastmasters testing at several clubs',
  'Speech development (Speech Lab)',
  'Daily practice',
];
