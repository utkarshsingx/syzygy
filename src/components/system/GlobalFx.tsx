import { useFxStore } from '@/stores/useFxStore';
import { PetalBurst } from '@/components/log/PetalBurst';
import { StickerStage } from '@/components/stickers/StickerStage';
import { MiniPlayer } from '@/components/music/MiniPlayer';

// App-level effect host. Mounted once at root so celebrations render above
// modals, sheets, and the bottom tabs.
export function GlobalFx() {
  const burstCounter = useFxStore((s) => s.burstCounter);
  return (
    <>
      <PetalBurst trigger={burstCounter} />
      <StickerStage />
      <MiniPlayer />
    </>
  );
}
