import { Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { PressScale } from '@/components/motion/PressScale';

type Props = {
  onPress: () => void;
};

// Floating action button — sits above bottom tabs. Triggers LogEntryModal.
// The web's concentric "halos" port to two soft rings around the FAB; we
// keep it simple in M5 and revisit visual polish in M7.
export function QuickLogFAB({ onPress }: Props) {
  const insets = useSafeAreaInsets();
  return (
    <View
      pointerEvents="box-none"
      style={{
        position: 'absolute',
        right: 18,
        bottom: insets.bottom + 76,
      }}
    >
      <PressScale
        onPress={onPress}
        haptic="medium"
        accessibilityLabel="Log entry"
        className="bg-terracotta rounded-pill items-center justify-center shadow-lg"
        style={{
          width: 60,
          height: 60,
          shadowColor: '#000',
          shadowOpacity: 0.2,
          shadowRadius: 12,
          shadowOffset: { width: 0, height: 6 },
          elevation: 8,
        }}
      >
        <Text className="font-display text-3xl text-cream" style={{ lineHeight: 32 }}>
          +
        </Text>
      </PressScale>
    </View>
  );
}
