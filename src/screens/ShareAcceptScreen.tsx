import { useRoute, type RouteProp } from '@react-navigation/native';
import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import type { RootStackParamList } from '@/navigation/types';

export function ShareAcceptScreen() {
  const route = useRoute<RouteProp<RootStackParamList, 'ShareAccept'>>();
  const inviteCode = route.params?.inviteCode;

  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-display text-3xl text-ink mb-2">Partner invite</Text>
        <Text className="font-body text-base text-ink-100 text-center">
          Invite code: {inviteCode ?? 'missing'}
        </Text>
        <Text className="font-body text-xs text-ink-50 mt-6 text-center">
          Accept flow lands in M6.
        </Text>
      </View>
    </SafeAreaView>
  );
}
