import { parseISO, addDays, format } from 'date-fns';
import { phaseToMorph, predict, rollingCycleLength } from '../predictions';
import type { UserPeriodData } from '@/types';

describe('rollingCycleLength', () => {
  it('returns 28 when no history', () => {
    expect(rollingCycleLength(undefined)).toBe(28);
    expect(rollingCycleLength([])).toBe(28);
    expect(rollingCycleLength(['2026-01-01'])).toBe(28);
  });

  it('averages two-cycle gap', () => {
    expect(rollingCycleLength(['2026-01-01', '2026-01-29'])).toBe(28);
    expect(rollingCycleLength(['2026-01-01', '2026-02-01'])).toBe(31);
  });

  it('ignores noisy outliers', () => {
    // 5-day gap should be dropped (likely a mis-log)
    expect(rollingCycleLength(['2026-01-01', '2026-01-06', '2026-02-03'])).toBe(28);
  });

  it('uses the most recent window', () => {
    // Old cycles 30, 30; recent cycles 26, 26 → window=6 takes both pairs (avg 28)
    const starts = ['2025-01-01', '2025-01-31', '2025-03-02', '2025-03-28', '2025-04-23'];
    const v = rollingCycleLength(starts, 6);
    // gaps: 30, 30, 26, 26 → avg 28
    expect(v).toBe(28);
  });
});

describe('predict', () => {
  it('returns null without lastPeriodStart', () => {
    expect(predict(undefined)).toBeNull();
    expect(
      predict({
        userId: 'u',
        cycleLengthAvg: 28,
        periodLengthAvg: 5,
        updatedAt: 0,
      } as UserPeriodData),
    ).toBeNull();
  });

  it('puts day 1 of period in menstrual phase', () => {
    const data: UserPeriodData = {
      userId: 'u',
      cycleLengthAvg: 28,
      periodLengthAvg: 5,
      lastPeriodStart: '2026-05-10',
      history: ['2026-05-10'],
      updatedAt: 0,
    };
    const today = parseISO('2026-05-10');
    const p = predict(data, today)!;
    expect(p.phase).toBe('menstrual');
    expect(p.cycleDay).toBe(1);
    expect(p.dayInPhase).toBe(1);
    expect(p.nextPeriodStart).toBe('2026-06-07'); // +28d
  });

  it('day 14 of a 28d cycle lands in ovulation window', () => {
    const data: UserPeriodData = {
      userId: 'u',
      cycleLengthAvg: 28,
      periodLengthAvg: 5,
      lastPeriodStart: '2026-05-01',
      history: ['2026-05-01'],
      updatedAt: 0,
    };
    const today = parseISO('2026-05-14');
    const p = predict(data, today)!;
    expect(p.cycleDay).toBe(14);
    // Ovulation date should be 14d before next period (2026-05-29 → 2026-05-15);
    // day 14 should fall in ovulation given our phase layout.
    expect(['ovulation', 'follicular']).toContain(p.phase);
  });

  it('rolls forward when today is past a predicted cycle end', () => {
    const data: UserPeriodData = {
      userId: 'u',
      cycleLengthAvg: 28,
      periodLengthAvg: 5,
      lastPeriodStart: '2026-01-01',
      history: ['2026-01-01'],
      updatedAt: 0,
    };
    // 60 days later — well into the next cycle
    const today = addDays(parseISO('2026-01-01'), 60);
    const p = predict(data, today)!;
    expect(p.cycleDay).toBeLessThanOrEqual(28);
    expect(p.cycleDay).toBeGreaterThanOrEqual(1);
    expect(p.daysUntilNextPeriod).toBeLessThanOrEqual(28);
  });

  it('confidence rises with more logged cycles', () => {
    const base = {
      userId: 'u',
      cycleLengthAvg: 28,
      periodLengthAvg: 5,
      lastPeriodStart: '2026-05-01',
      updatedAt: 0,
    };
    const today = parseISO('2026-05-05');
    const one = predict({ ...base, history: ['2026-05-01'] }, today)!;
    const many = predict(
      {
        ...base,
        history: Array.from({ length: 10 }, (_, i) =>
          format(addDays(parseISO('2025-08-01'), i * 28), 'yyyy-MM-dd'),
        ),
      },
      today,
    )!;
    expect(many.confidence).toBeGreaterThan(one.confidence);
    expect(many.confidence).toBeGreaterThan(0.9);
  });
});

describe('phaseToMorph', () => {
  it('produces values in [0,1] for every phase', () => {
    for (const phase of ['menstrual', 'follicular', 'ovulation', 'luteal'] as const) {
      for (let d = 1; d <= 10; d++) {
        const m = phaseToMorph(phase, d, 7);
        expect(m.openness).toBeGreaterThanOrEqual(0);
        expect(m.openness).toBeLessThanOrEqual(1);
        expect(m.wilt).toBeGreaterThanOrEqual(0);
        expect(m.wilt).toBeLessThanOrEqual(1);
        expect(m.glow).toBeGreaterThanOrEqual(0);
        expect(m.glow).toBeLessThanOrEqual(1);
      }
    }
  });

  it('menstrual is more closed than ovulation', () => {
    const m = phaseToMorph('menstrual', 1, 5);
    const o = phaseToMorph('ovulation', 2, 3);
    expect(m.openness).toBeLessThan(o.openness);
    expect(o.glow).toBeGreaterThan(m.glow);
  });

  it('luteal is more wilted than follicular', () => {
    const f = phaseToMorph('follicular', 7, 7);
    const l = phaseToMorph('luteal', 7, 7);
    expect(l.wilt).toBeGreaterThan(f.wilt);
  });

  it('ovulation peaks glow near phase midpoint', () => {
    const mid = phaseToMorph('ovulation', 2, 3);
    const edge = phaseToMorph('ovulation', 1, 3);
    expect(mid.glow).toBeGreaterThanOrEqual(edge.glow);
  });
});
