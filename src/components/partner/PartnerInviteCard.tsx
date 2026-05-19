import { useState } from 'react';
import { View, Text, Share } from 'react-native';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { useToast } from '@/components/ui/Toast';
import { useAuth } from '@/auth/AuthProvider';
import { couplesRepo } from '@/data/couples.repo';
import { usersRepo } from '@/data/users.repo';
import { colors } from '@/theme/colors';

const SHARE_URL_BASE = 'https://bloom.app/share/';

export function PartnerInviteCard() {
  const { user } = useAuth();
  const toast = useToast();
  const [code, setCode] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function generate() {
    if (!user) return;
    setBusy(true);
    try {
      const { coupleId, inviteCode } = await couplesRepo.create(user.uid);
      // Stash the coupleId on the user profile so AuthProvider's subscribe
      // picks up the couple + messages immediately.
      await usersRepo.upsert({
        uid: user.uid,
        displayName: user.displayName ?? 'Friend',
        email: user.email ?? null,
        partnerCoupleId: coupleId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      setCode(inviteCode);
      toast.show('Invite generated.', 'success');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Couldn’t generate invite.', 'error');
    } finally {
      setBusy(false);
    }
  }

  async function shareInvite() {
    if (!code) return;
    try {
      await Share.share({
        message: `Join me on syzygy: ${SHARE_URL_BASE}${code}`,
      });
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Share failed.', 'error');
    }
  }

  return (
    <Card tone="tinted">
      <Text className="font-display text-2xl text-ink mb-1">For your person</Text>
      <Text className="font-body text-sm text-ink-100 mb-5">
        Generate a one-time invite. They tap the link and you’re connected —
        nothing more, nothing intrusive.
      </Text>

      {code ? (
        <>
          <View
            className="bg-cream rounded-soft border border-ink-50/15 px-4 py-3 mb-4"
          >
            <Text className="font-body text-xs text-ink-100/60 uppercase tracking-widest mb-1">
              Invite code
            </Text>
            <Text
              className="font-display text-3xl text-ink"
              selectable
              style={{ letterSpacing: 4 }}
            >
              {code}
            </Text>
            <Text className="font-body text-xs text-ink-100/60 mt-2">
              Valid for 14 days. Sharing the link is easier than the code.
            </Text>
          </View>
          <Button onPress={shareInvite}>Share invite</Button>
        </>
      ) : (
        <Button onPress={generate} loading={busy}>
          Generate invite
        </Button>
      )}
    </Card>
  );
}
