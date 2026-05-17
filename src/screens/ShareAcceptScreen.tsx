import { useEffect, useState } from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRoute, useNavigation, type RouteProp } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import { couplesRepo } from '@/data/couples.repo';
import { usersRepo } from '@/data/users.repo';
import { firestore, paths } from '@/data/firebase';
import { isValidInviteCode } from '@/lib/invite';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';
import type { CoupleDoc } from '@/types';
import type { RootStackParamList } from '@/navigation/types';

export function ShareAcceptScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ShareAccept'>>();
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { user } = useAuth();
  const toast = useToast();
  const inviteCode = route.params?.inviteCode?.toUpperCase() ?? '';

  const [loading, setLoading] = useState(true);
  const [couple, setCouple] = useState<CoupleDoc | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [accepting, setAccepting] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      if (!isValidInviteCode(inviteCode)) {
        if (mounted) {
          setError('Invite code looks wrong.');
          setLoading(false);
        }
        return;
      }
      try {
        const found = await couplesRepo.getByInviteCode(inviteCode);
        if (!mounted) return;
        if (!found) {
          setError('Invite not found or expired.');
        } else if (found.status === 'linked') {
          setError('This invite was already used.');
        } else {
          setCouple(found);
        }
      } catch (e) {
        if (mounted) setError(e instanceof Error ? e.message : 'Lookup failed.');
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => {
      mounted = false;
    };
  }, [inviteCode]);

  async function accept() {
    if (!user || !couple) return;
    if (couple.members[0] === user.uid) {
      toast.show('You can’t accept your own invite.', 'error');
      return;
    }
    setAccepting(true);
    try {
      // Client-side accept — server enforces via security rules.
      // (Cloud Function `acceptInvite` covers atomicity in M6 functions/.)
      await firestore()
        .doc(paths.couple(couple.coupleId))
        .set(
          {
            members: [couple.members[0], user.uid],
            status: 'linked',
            updatedAt: Date.now(),
          },
          { merge: true },
        );
      await usersRepo.upsert({
        uid: user.uid,
        displayName: user.displayName ?? 'Friend',
        email: user.email ?? null,
        partnerCoupleId: couple.coupleId,
        createdAt: Date.now(),
        updatedAt: Date.now(),
      });
      toast.show('Linked.', 'success');
      nav.goBack();
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Accept failed.', 'error');
    } finally {
      setAccepting(false);
    }
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <Atmosphere intensity="medium" />
      <View className="flex-1 justify-center px-6">
        <Text
          style={{ fontFamily: fonts.displayBold, fontSize: 32, color: colors.ink }}
          className="mb-2"
        >
          Partner invite
        </Text>
        <Text className="font-body text-sm text-ink-100 mb-6">
          Accepting links you both so you can send gentle messages.
        </Text>

        {loading ? (
          <View className="items-center py-8">
            <ActivityIndicator color={colors.terracotta} />
          </View>
        ) : error ? (
          <Card tone="paper">
            <Text className="font-body text-base text-ink">{error}</Text>
            <Button variant="ghost" size="sm" onPress={() => nav.goBack()} className="mt-3">
              Close
            </Button>
          </Card>
        ) : couple ? (
          <Card tone="tinted">
            <Text className="font-display text-xl text-ink mb-2">
              Code {inviteCode}
            </Text>
            <Text className="font-body text-sm text-ink-100 mb-5">
              You’re about to link with the person who sent this invite. You
              can unlink in Settings anytime.
            </Text>
            <Button onPress={accept} loading={accepting}>
              Accept invite
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onPress={() => nav.goBack()}
              className="mt-2 self-center"
            >
              Not now
            </Button>
          </Card>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
