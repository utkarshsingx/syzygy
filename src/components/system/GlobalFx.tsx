import { useFxStore } from '@/stores/useFxStore';
import { PetalBurst } from '@/components/log/PetalBurst';

// App-level effect host. Mounted once at root so celebrations render above
// modals, sheets, and the bottom tabs.
export function GlobalFx() {
  const burstCounter = useFxStore((s) => s.burstCounter);
  return <PetalBurst trigger={burstCounter} />;
}
