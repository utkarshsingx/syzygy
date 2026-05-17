import { addDays, differenceInCalendarDays, format, parseISO } from 'date-fns';
import type {
  BloomMorph,
  CyclePhase,
  PhaseSummary,
  UserPeriodData,
} from '@/types';

const DEFAULT_CYCLE = 28;
const DEFAULT_PERIOD = 5;
const FERTILE_BEFORE = 5; // days
const FERTILE_AFTER = 1; // days
const OVULATION_OFFSET_FROM_NEXT = 14; // days before next period start

const clamp = (v: number, lo: number, hi: number) => Math.max(lo, Math.min(hi, v));

// Phase length helpers — derived from cycle length so longer cycles distribute
// the extra days into the luteal phase (the most stable empirical pattern).
function phaseLengths(cycleLength: number, periodLength: number) {
  // Menstrual: actual period length, capped at 8 days.
  const menstrual = clamp(Math.round(periodLength), 2, 8);
  // Ovulation phase: a 3-day window around the ovulation day.
  const ovulation = 3;
  // Luteal: 14 days from end of fertile window to next period (the constant half).
  const luteal = clamp(cycleLength - OVULATION_OFFSET_FROM_NEXT - 1, 11, 16);
  // Follicular: whatever's left.
  const follicular = Math.max(1, cycleLength - menstrual - ovulation - luteal);
  return { menstrual, follicular, ovulation, luteal };
}

function avg(values: number[], fallback: number): number {
  if (values.length === 0) return fallback;
  return values.reduce((s, v) => s + v, 0) / values.length;
}

// Computes the rolling cycle-length average over the last `window` cycles.
// Returns the default when fewer than 2 starts are available.
export function rollingCycleLength(history: string[] | undefined, window = 6): number {
  if (!history || history.length < 2) return DEFAULT_CYCLE;
  const sorted = [...history].sort();
  const lengths: number[] = [];
  for (let i = 1; i < sorted.length; i++) {
    const a = parseISO(sorted[i - 1]!);
    const b = parseISO(sorted[i]!);
    const d = differenceInCalendarDays(b, a);
    if (d > 18 && d < 60) lengths.push(d); // discard noisy values
  }
  const slice = lengths.slice(-window);
  const v = avg(slice, DEFAULT_CYCLE);
  return clamp(Math.round(v), 18, 45);
}

// Confidence rises asymptotically with cycle count (0 with no history, ~0.95 after 8 cycles).
function computeConfidence(historyCount: number): number {
  return clamp(1 - Math.exp(-historyCount / 3.5), 0, 1);
}

// Main predictor. Returns null if no `lastPeriodStart` is known.
export function predict(
  data: UserPeriodData | undefined,
  today: Date = new Date(),
): PhaseSummary | null {
  if (!data?.lastPeriodStart) return null;

  const cycleLength = rollingCycleLength(data.history) || data.cycleLengthAvg || DEFAULT_CYCLE;
  const periodLength = data.periodLengthAvg || DEFAULT_PERIOD;
  const lengths = phaseLengths(cycleLength, periodLength);

  const lastStart = parseISO(data.lastPeriodStart);
  let cycleDay = differenceInCalendarDays(today, lastStart) + 1; // 1-indexed
  // If we're past the predicted next start, roll forward into the next cycle.
  let projectedStart = lastStart;
  while (cycleDay > cycleLength) {
    projectedStart = addDays(projectedStart, cycleLength);
    cycleDay -= cycleLength;
  }
  if (cycleDay < 1) {
    // Today is before the recorded last start — caller probably gave a future today.
    cycleDay = 1;
  }

  const nextStart = addDays(projectedStart, cycleLength);
  const ovulationDate = addDays(nextStart, -OVULATION_OFFSET_FROM_NEXT);
  const fertileStart = addDays(ovulationDate, -FERTILE_BEFORE);
  const fertileEnd = addDays(ovulationDate, FERTILE_AFTER);

  // Resolve phase + day-in-phase from cycleDay walking through phase windows.
  let phase: CyclePhase = 'follicular';
  let dayInPhase = 1;
  let cursor = 1;
  const order: Array<{ phase: CyclePhase; len: number }> = [
    { phase: 'menstrual', len: lengths.menstrual },
    { phase: 'follicular', len: lengths.follicular },
    { phase: 'ovulation', len: lengths.ovulation },
    { phase: 'luteal', len: lengths.luteal },
  ];
  for (const seg of order) {
    if (cycleDay < cursor + seg.len) {
      phase = seg.phase;
      dayInPhase = cycleDay - cursor + 1;
      break;
    }
    cursor += seg.len;
  }

  const daysUntilNextPeriod = Math.max(0, differenceInCalendarDays(nextStart, today));
  const confidence = computeConfidence(data.history?.length ?? 0);

  return {
    phase,
    cycleDay,
    dayInPhase,
    cycleLength,
    periodLength,
    nextPeriodStart: format(nextStart, 'yyyy-MM-dd'),
    daysUntilNextPeriod,
    ovulationDate: format(ovulationDate, 'yyyy-MM-dd'),
    fertileWindow: [format(fertileStart, 'yyyy-MM-dd'), format(fertileEnd, 'yyyy-MM-dd')],
    confidence,
  };
}

// Maps a phase + dayInPhase to bloom morph values. Pure — the bloom renderer
// reads this and animates between values via Reanimated springs.
//
// Curves are designed for visual continuity across phase boundaries:
//   menstrual : closed bud,        wilting,       dim
//   follicular: opening,           no wilt,       brightening
//   ovulation : fully open,        no wilt,       peak glow
//   luteal    : slowly closing,    light wilt,    dimming
export function phaseToMorph(phase: CyclePhase, dayInPhase = 1, phaseLength = 7): BloomMorph {
  const t = clamp((dayInPhase - 1) / Math.max(1, phaseLength - 1), 0, 1);

  switch (phase) {
    case 'menstrual':
      // Closed bud, wilt fades as period ends and we approach follicular.
      return {
        openness: 0.12 + t * 0.08,
        wilt: 0.65 - t * 0.45,
        glow: 0.12 + t * 0.08,
      };
    case 'follicular':
      // Opening from bud → almost-full bloom; glow rises.
      return {
        openness: 0.25 + t * 0.55,
        wilt: 0.1 - t * 0.1,
        glow: 0.25 + t * 0.5,
      };
    case 'ovulation':
      // Held fully open at peak glow; subtle breathing.
      return {
        openness: 0.92 + 0.05 * Math.sin(Math.PI * t),
        wilt: 0,
        glow: 0.88 + 0.1 * Math.sin(Math.PI * t),
      };
    case 'luteal':
      // Slowly closing; very light wilt as the cycle winds down.
      return {
        openness: 0.85 - t * 0.55,
        wilt: 0.05 + t * 0.25,
        glow: 0.7 - t * 0.45,
      };
  }
}
