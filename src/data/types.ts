export type Club = {
  id: string;
  name: string;
  clubNumber: string | null;
  district: string | null;
  country: string;
  city: string;
  website: string | null;
  meetingDay: string;
  localTime: string;
  timezone: string;
  durationMin: number | null;
  frequency: string;
  format: 'online' | 'hybrid';
  language: string;
  zoomLink: string | null;
  contactName: string | null;
  contactEmail: string | null;
  guestPolicy: string | null;
  guestsMaySpeak: boolean | null;
  visitorsMayTakeRoles: boolean | null;
  specialty: string | null;
  classification: string[];
  activity: string | null;
  notes: string | null;
  sourceUrl: string;
  verified: boolean;
  lastVerified: string;
  verificationLevel: 'official' | 'district' | 'aggregator';
  region: string;
};

export type Opportunity = {
  id: string;
  organization: string;
  type: string;
  city: string;
  county: string;
  website: string | null;
  audience: string | null;
  audienceSize: string | null;
  meetingFrequency: string | null;
  meetingDetails: string | null;
  typicalSpeakers: string | null;
  contactName: string | null;
  email: string | null;
  phone: string | null;
  applicationPage: string | null;
  speakingRequirements: string | null;
  paid: 'paid' | 'unpaid' | 'unknown';
  speechFit: string[];
  whyFit: string | null;
  ladderLevel: number;
  notes: string | null;
  source: string;
  lastVerified: string;
};

export type ReqStatus = 'done' | 'in_progress' | 'not_started' | 'unknown';

export type Requirement = {
  id: string;
  category: string;
  requirement: string;
  detail: string;
  evidence: string;
  action: string;
  deadline: string; // ISO date
  source: string;
  weight: number;
  defaultStatus: ReqStatus;
  official: boolean;
};

export type Stage =
  | 'Idea'
  | 'Outline'
  | '5-min test'
  | '7-min Toastmasters'
  | '10–15 min'
  | '20–30 min talk'
  | '45–60 min workshop'
  | 'Keynote'
  | 'Professional asset';

export type Speech = {
  id: string;
  name: string;
  centralIdea: string;
  audience: string;
  problem: string;
  promise: string;
  opening: string;
  stories: string[];
  framework: string;
  interaction: string;
  humor: string;
  closing: string;
  cta: string;
  stage: Stage;
  version: number;
  nextExperiment: string;
  bestAudiences: string[];
  seedNote: string;
};

export type LogEntry = {
  id: string;
  date: string; // YYYY-MM-DD
  kind:
    | 'Toastmasters meeting'
    | 'Prepared speech (TM)'
    | 'Table Topics'
    | 'Evaluation given'
    | 'Meeting role'
    | 'Outside speech'
    | 'Workshop'
    | 'Recording'
    | 'Outreach contact'
    | 'Follow-up'
    | 'Booking'
    | 'Testimonial';
  title: string;
  where: string;
  speechId?: string;
  minutes?: number;
  audience?: number;
  paid?: 'fee' | 'reimbursement' | 'none';
  fee?: number;
  recorded?: boolean;
  url?: string;
  clientContact?: string;
  notes?: string;
};

export type OutreachStatus =
  | 'Research'
  | 'Contact'
  | 'Follow-up'
  | 'Conversation'
  | 'Booked'
  | 'Delivered'
  | 'Referral';

export type OutreachRecord = { status: OutreachStatus; followUp?: string; notes?: string };
