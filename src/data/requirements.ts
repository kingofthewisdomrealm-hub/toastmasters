import type { Requirement } from './types';

// Source of truth: Accredited Speaker Program Handbook, Item 690 Rev. 12/2024
// and Application Item 1208 Rev. 10/2022. Verified 2026-09-25.
export const HANDBOOK =
  'https://ccdn.toastmasters.org/medias/files/department-documents/education-documents/accredited-speaker/690-accredited-speaker-handbook.pdf';
export const APPLICATION =
  'https://ccdn.toastmasters.org/medias/files/department-documents/education-documents/accredited-speaker/1208-accredited-speaker-application.pdf';
export const RECOMMENDATION =
  'https://ccdn.toastmasters.org/medias/files/department-documents/education-documents/accredited-speaker/accredited-speaker-recommendation.pdf';
export const BALLOT_L1 =
  'https://ccdn.toastmasters.org/medias/files/department-documents/education-documents/accredited-speaker/accredited-speaker-judges-guide-and-ballot.pdf';
export const BALLOT_L2 =
  'https://ccdn.toastmasters.org/medias/files/department-documents/education-documents/accredited-speaker/1192l2-accredited-speaker-judges-guide-and-ballot-level2-ff.pdf';
export const MENTORS =
  'https://www.toastmasters.org/membership/accredited-speaker/accredited%20speaker%20mentors';
export const BECOME = 'https://www.toastmasters.org/membership/accredited-speaker/become-an-accredited-speaker';
export const PATHWAYS_PM = 'https://www.toastmasters.org/pathways-overview/pathways-presentation-mastery-path';

export const TARGET_CYCLE = {
  applyBy: '2028-01-31',
  internalApplyBy: '2028-01-15',
  level1Results: '2028-05-31',
  level2: 'August 2028 International Convention',
  stretchApplyBy: '2027-01-31',
  convention2027: 'Paris, France · Aug 18–21, 2027',
};

export const requirements: Requirement[] = [
  // ELIGIBILITY
  {
    id: 'membership', category: 'Eligibility', official: true, weight: 4,
    requirement: 'Member of a Toastmasters club in good standing',
    detail: 'Online clubs count as full clubs. You can belong to several clubs.',
    evidence: 'Active membership in Base Camp / club roster',
    action: 'Confirm your dues are current. Pick a home club and add 1–2 online clubs for extra speaking slots.',
    deadline: '2026-10-15', source: HANDBOOK, defaultStatus: 'unknown',
  },
  {
    id: 'education', category: 'Eligibility', official: true, weight: 12,
    requirement: 'Finish a full Pathways path (all 5 levels), or earn ATM Bronze / ACB',
    detail: 'Since Oct 2025, every level also needs meeting roles, and Levels 3–5 need 10–15 min Education Series talks. You get credit for only one speech per meeting. Presentation Mastery is the best-fit path: its Level 5 includes "Prepare to Speak Professionally."',
    evidence: 'Path Completion certificate in Base Camp',
    action: 'Enroll in Presentation Mastery ($35). Ask your VP Education to pre-approve outside talks as project speeches.',
    deadline: '2027-12-15', source: HANDBOOK, defaultStatus: 'unknown',
  },
  {
    id: 'not-officer', category: 'Eligibility', official: true, weight: 1,
    requirement: 'Not an International officer, director, or region advisor (or a candidate for one)',
    detail: 'Almost everyone meets this one.',
    evidence: 'None needed',
    action: 'Confirm, then mark done.',
    deadline: '2027-12-31', source: HANDBOOK, defaultStatus: 'unknown',
  },
  // ENGAGEMENTS
  {
    id: 'engagements-25', category: 'Engagements', official: true, weight: 14,
    requirement: '25 professional-level talks to non-Toastmasters audiences in the 3 years before you apply',
    detail: 'For a Jan 2028 application, count talks from about Feb 2025 on. Aim for 30 so you can drop the weak ones.',
    evidence: 'Engagement log: Date · Organization · Contact/Client · Length · Fee · Audience size',
    action: 'Log every outside talk in the Speaking Log the same day.',
    deadline: '2027-12-31', source: HANDBOOK, defaultStatus: 'not_started',
  },
  {
    id: 'paid-15', category: 'Engagements', official: true, weight: 12,
    requirement: 'At least 15 of the 25 talks were paid',
    detail: 'Up to 7 of the 15 can be reimbursement, per diem, or a gift or donation only.',
    evidence: 'Invoice + payment receipt per talk',
    action: 'Build a fee sheet. Ask for a fee, or at least expenses, on every booking.',
    deadline: '2027-12-31', source: HANDBOOK, defaultStatus: 'not_started',
  },
  {
    id: 'fee-8', category: 'Engagements', official: true, weight: 10,
    requirement: 'At least 8 talks with a pre-arranged fee',
    detail: 'The fee has to be agreed before the talk. A thank-you check afterward does not count.',
    evidence: 'Booking email or contract that shows the fee, plus the payment',
    action: 'Put the fee in writing in every booking confirmation.',
    deadline: '2027-12-31', source: HANDBOOK, defaultStatus: 'not_started',
  },
  {
    id: 'audience-20', category: 'Engagements', official: true, weight: 4,
    requirement: 'Every counted talk: 20+ people, 20+ minutes, live',
    detail: 'Virtual talks count if 20+ people watch in real time. Recordings watched later do not.',
    evidence: 'Sign-in sheet, registration list, or webinar attendance report + agenda showing your time slot',
    action: 'Ask each host for the head count and the agenda. Take a photo of the room.',
    deadline: '2027-12-31', source: HANDBOOK, defaultStatus: 'not_started',
  },
  {
    id: 'own-content', category: 'Engagements', official: true, weight: 3,
    requirement: 'Your own content, not part of a regular job',
    detail: 'Self-employed is fine. Talks given for Covenant Builders clients count. Licensed or borrowed curriculum does not.',
    evidence: 'Your slides or outline',
    action: 'Keep every version of your speeches in the Speech Lab.',
    deadline: '2027-12-31', source: HANDBOOK, defaultStatus: 'in_progress',
  },
  // VIDEO
  {
    id: 'video', category: 'Video', official: true, weight: 10,
    requirement: 'Unedited video, 20–60 minutes, in English, before a live non-Toastmasters audience, including your introduction',
    detail: 'You are disqualified for: added music, graphics, or title slides; multiple cameras; cuts; audio or lighting fixes; stopping early; poor sound; a missing introduction. You may trim only before the introduction and after the ending.',
    evidence: 'Unlisted YouTube or Vimeo link',
    action: 'Record 2–3 real paid talks with one camera, a lapel mic, and someone introducing you. Have a mentor score each one against the Level 1 ballot.',
    deadline: '2027-11-30', source: HANDBOOK, defaultStatus: 'not_started',
  },
  {
    id: 'slides', category: 'Video', official: true, weight: 1,
    requirement: 'Send a copy of your slides if you used slides in the video',
    detail: 'Slides are optional.',
    evidence: 'PDF of the slides',
    action: 'Export the slides from the talk you recorded.',
    deadline: '2028-01-15', source: APPLICATION, defaultStatus: 'not_started',
  },
  // RECOMMENDATIONS
  {
    id: 'recs-5', category: 'Recommendations', official: true, weight: 8,
    requirement: '5 recommendation forms from 5 different paying clients',
    detail: 'The client emails the form (Item 1209) straight to accreditedspeaker@toastmasters.org. You can’t send it yourself. Forms stay on file for 5 years, so collect them right after good paid talks.',
    evidence: 'Written confirmation from WHQ that each form was received',
    action: 'After each strong paid talk, send the client the form link within 48 hours.',
    deadline: '2027-12-31', source: RECOMMENDATION, defaultStatus: 'not_started',
  },
  // PRESENCE
  {
    id: 'web', category: 'Professional presence', official: true, weight: 3,
    requirement: 'Professional website and social media (judges look at them)',
    detail: 'Not having a website can’t be the only reason you’re turned down, but it helps your score.',
    evidence: 'Speaker page URL',
    action: 'Build a speaker page with your topics, a bio, video clips, and testimonials.',
    deadline: '2027-06-30', source: HANDBOOK, defaultStatus: 'not_started',
  },
  // APPLICATION
  {
    id: 'application', category: 'Application', official: true, weight: 4,
    requirement: 'Application form (Item 1208 Rev. 10/2022) completed',
    detail: 'Use the Rev. 10/2022 form. The older azureedge copy is out of date.',
    evidence: 'Completed PDF',
    action: 'Fill in a draft in December 2027 using the Speaking Log.',
    deadline: '2028-01-15', source: APPLICATION, defaultStatus: 'not_started',
  },
  {
    id: 'submit', category: 'Application', official: true, weight: 3,
    requirement: 'Submit between Jan 1 and Jan 31, by 5 p.m. Mountain Time on Jan 31',
    detail: 'No extensions. If something is wrong, you get ONE chance to fix it within 7 days, so submit early.',
    evidence: 'Email sent to accreditedspeaker@toastmasters.org',
    action: 'Target Jan 15, 2028.',
    deadline: '2028-01-31', source: BECOME, defaultStatus: 'not_started',
  },
  {
    id: 'fee-l1', category: 'Application', official: true, weight: 1,
    requirement: '$100 Level 1 fee (nonrefundable)',
    detail: 'Pay after your materials are received.',
    evidence: 'Receipt',
    action: 'Pay when WHQ confirms receipt.',
    deadline: '2028-02-03', source: HANDBOOK, defaultStatus: 'not_started',
  },
  // LEVEL 2
  {
    id: 'l2-talk', category: 'Level 2', official: true, weight: 4,
    requirement: 'Level 2: a live 15–18 minute talk at the International Convention (August)',
    detail: 'Five judges score it. You need 80+ from 4 of the 5. Content 45 / Delivery 35 / Language 20. At Level 2, 5 points are for Subject Matter Expertise, so your introduction must state your expertise.',
    evidence: 'Level 2 invitation (May)',
    action: 'Build your strongest 15–18 min version from your best-tested talk.',
    deadline: '2028-08-15', source: BALLOT_L2, defaultStatus: 'not_started',
  },
  {
    id: 'fee-l2', category: 'Level 2', official: true, weight: 1,
    requirement: '$150 Level 2 fee + your own travel to the convention',
    detail: 'You get 3 tries at Level 2. You can put it off for up to 3 years after passing Level 1.',
    evidence: 'Receipt + travel booking',
    action: 'Save for travel to the convention.',
    deadline: '2028-06-01', source: HANDBOOK, defaultStatus: 'not_started',
  },
  // PREP (not official requirements, but they decide who passes)
  {
    id: 'read-rules', category: 'Preparation', official: false, weight: 1,
    requirement: 'Read the Handbook and both judging ballots yourself',
    detail: 'Audience Response is the biggest single score item (20 points at Level 1).',
    evidence: '—',
    action: 'Read the Level 1 ballot before every outside talk.',
    deadline: '2026-10-31', source: BALLOT_L1, defaultStatus: 'not_started',
  },
  {
    id: 'mentor', category: 'Preparation', official: false, weight: 1,
    requirement: 'Get an Accredited Speaker mentor (24 are listed; mentoring is free)',
    detail: 'Nearly every recent Accredited Speaker credits a mentor.',
    evidence: 'Mentor agreed',
    action: 'Email 3 mentors from the official list.',
    deadline: '2026-11-30', source: MENTORS, defaultStatus: 'not_started',
  },
  {
    id: 'system', category: 'Preparation', official: false, weight: 1,
    requirement: 'Tracking system in place (this dashboard)',
    detail: 'Speaking Log fields match the application engagement log.',
    evidence: 'This dashboard',
    action: 'Log every talk the same day.',
    deadline: '2026-09-30', source: HANDBOOK, defaultStatus: 'done',
  },
];

export const scoring = [
  { area: 'Content', pts: 45, parts: 'Audience response 20 · Speech development 10 · Speech value 15 (Level 2: response 15 + expertise 5)' },
  { area: 'Delivery', pts: 35, parts: 'Physical 10 · Voice 15 · Platform style 10' },
  { area: 'Language', pts: 20, parts: 'Appropriateness 10 · Correctness 10' },
];
