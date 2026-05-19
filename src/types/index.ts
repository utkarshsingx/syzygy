// Core domain types shared across the data layer, UI, and (eventually) Cloud Functions.

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type Flow = 'spotting' | 'light' | 'medium' | 'heavy';

export type Mood =
  | 'radiant'
  | 'peaceful'
  | 'tender'
  | 'tired'
  | 'anxious'
  | 'sad'
  | 'energetic'
  | 'emotional';

export const MOODS: readonly Mood[] = [
  'radiant',
  'peaceful',
  'tender',
  'tired',
  'anxious',
  'sad',
  'energetic',
  'emotional',
] as const;

export const SYMPTOMS = [
  'cramps',
  'headache',
  'bloating',
  'tender_breasts',
  'fatigue',
  'nausea',
  'acne',
  'back_pain',
  'cravings',
  'insomnia',
] as const;
export type Symptom = (typeof SYMPTOMS)[number];

// A single calendar day of self-reported data. Document id = `YYYY-MM-DD`
// so offline writes for the same day are idempotent on reconnect.
export type CycleEntry = {
  id?: string;
  dateISO: string;
  userId: string;
  phase?: CyclePhase;
  flow?: Flow | null;
  symptoms?: Symptom[];
  mood?: Mood | null;
  notes?: string;
  isPeriodStart?: boolean;
  isPeriodEnd?: boolean;
  createdAt: number;
  updatedAt: number;
  synced?: 0 | 1;
};

// Per-user cycle profile: rolling averages + history. The prediction engine
// reads this to compute `PhaseSummary`.
export type UserPeriodData = {
  userId: string;
  cycleLengthAvg: number; // default 28
  periodLengthAvg: number; // default 5
  lastPeriodStart?: string; // ISO YYYY-MM-DD of the most recent confirmed start
  history?: string[]; // ISO YYYY-MM-DD of every recorded period start, ascending
  updatedAt: number;
};

// Optional per-day mood logged independently of CycleEntry (e.g. via a quick chip).
export type MoodEntry = {
  id?: string;
  userId: string;
  dateISO: string;
  mood: Mood;
  intensity?: number; // 1..5
  note?: string;
  createdAt: number;
  synced?: 0 | 1;
};

// Free-form journal entry. `threadId` set when shared with a partner.
export type JournalEntry = {
  id?: string;
  authorId: string;
  threadId?: string;
  type: 'note' | 'voice';
  content: string;
  audioRef?: string | null; // Firebase Storage path
  createdAt: number;
  updatedAt: number;
  synced?: 0 | 1;
};

// Partner link. Status is pending until the second member accepts the invite.
export type CoupleDoc = {
  coupleId: string;
  inviteCode: string;
  members: [string, string | null]; // [partnerAId, partnerBId | null]
  createdBy: string;
  status: 'pending' | 'linked';
  createdAt: number;
  updatedAt: number;
};

export type MessageType = 'text' | 'summon' | 'reaction' | 'mood_update';

export type Message = {
  id?: string;
  threadId: string; // typically the coupleId
  from: string;
  to: string;
  type: MessageType;
  content: string;
  readAt?: number | null;
  createdAt: number;
  synced?: 0 | 1;
};

// Voice memo blob metadata. Audio bytes live in Firebase Storage.
export type AudioBlob = {
  id?: string;
  filename: string;
  storagePath?: string;
  remoteUrl?: string;
  durationMs?: number;
  createdAt: number;
  synced?: 0 | 1;
};

// Derived (not persisted) summary computed by `predict()`. Drives the bloom
// morph, phase card, calendar coloring, and countdown.
export type PhaseSummary = {
  phase: CyclePhase;
  cycleDay: number; // 1-indexed day of cycle
  dayInPhase: number; // 1-indexed day within current phase
  cycleLength: number;
  periodLength: number;
  nextPeriodStart: string; // ISO YYYY-MM-DD
  daysUntilNextPeriod: number;
  ovulationDate: string; // ISO YYYY-MM-DD
  fertileWindow: [string, string]; // [startISO, endISO]
  confidence: number; // 0..1 — rises with logged cycle count
};

// Visual morph values consumed by <BloomCanvas>. Pure function of phase + dayInPhase.
export type BloomMorph = {
  openness: number; // 0 closed bud, 1 fully open
  wilt: number; // 0 upright, 1 fully drooped
  glow: number; // 0 quiet, 1 incandescent
};

// User profile + preferences mirrored to Firestore /users/{uid}.
export type UserProfile = {
  uid: string;
  displayName: string;
  email?: string | null;
  partnerCoupleId?: string | null;
  fcmTokens?: string[];
  notificationPrefs?: {
    remindBeforePeriodDays: number;
    dailyLogReminder: boolean;
    dailyLogReminderTime?: string; // "HH:mm"
    partnerSummons: boolean;
  };
  isAdmin?: boolean;
  createdAt: number;
  updatedAt: number;
};

export type { Track, TrackMood } from './music';
export { TRACK_MOODS } from './music';
