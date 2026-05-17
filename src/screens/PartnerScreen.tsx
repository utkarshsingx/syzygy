import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { PartnerInviteCard } from '@/components/partner/PartnerInviteCard';
import { PartnerMessages } from '@/components/partner/PartnerMessages';
import { usePartnerStore } from '@/stores/usePartnerStore';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';

export function PartnerScreen() {
  const couple = usePartnerStore((s) => s.couple);
  const linked = couple?.status === 'linked';

  return (
    <SafeAreaView className="flex-1" edges={['top']}>
      <Atmosphere intensity="subtle" />

      <View className="px-6 pt-4">
        <Text style={{ fontFamily: fonts.displayBold, fontSize: 28, color: colors.ink }}>
          Partner
        </Text>
        <Text className="font-body text-sm text-ink-100/80 mt-1 mb-4">
          {!couple
            ? 'Connect with one person to share gentle nudges.'
            : couple.status === 'pending'
              ? 'Invite pending — waiting for your person to accept.'
              : 'You’re linked.'}
        </Text>
      </View>

      {!linked ? (
        <View className="px-4">
          <PartnerInviteCard />
        </View>
      ) : (
        <PartnerMessages />
      )}
    </SafeAreaView>
  );
}
