import { View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

type Props = {
  name: string;
  hint?: string;
};

// M1 stand-in for screens that will be built out in later milestones.
// Each real screen will replace this with proper content.
export function PlaceholderScreen({ name, hint }: Props) {
  return (
    <SafeAreaView className="flex-1 bg-cream" edges={['top', 'bottom']}>
      <View className="flex-1 items-center justify-center px-6">
        <Text className="font-display text-3xl text-ink mb-2">{name}</Text>
        <Text className="font-body text-base text-ink-100 text-center">
          {hint ?? 'Coming soon.'}
        </Text>
      </View>
    </SafeAreaView>
  );
}
