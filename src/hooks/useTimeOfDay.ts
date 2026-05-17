import { useEffect, useState } from 'react';

export type TimeOfDay = 'preDawn' | 'sunrise' | 'midday' | 'goldenHour' | 'night';

function classify(hour: number): TimeOfDay {
  if (hour >= 4 && hour < 7) return 'preDawn';
  if (hour >= 7 && hour < 10) return 'sunrise';
  if (hour >= 10 && hour < 17) return 'midday';
  if (hour >= 17 && hour < 20) return 'goldenHour';
  return 'night';
}

// Updates ~once an hour. The bloom reads this to tint petals + halo.
export function useTimeOfDay(): { hour: number; phase: TimeOfDay } {
  const [hour, setHour] = useState(() => new Date().getHours());

  useEffect(() => {
    const tick = () => setHour(new Date().getHours());
    const id = setInterval(tick, 60_000);
    return () => clearInterval(id);
  }, []);

  return { hour, phase: classify(hour) };
}
