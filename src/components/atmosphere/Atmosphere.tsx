import { View, StyleSheet } from 'react-native';
import { colors } from '@/theme/colors';

type Props = {
  intensity?: 'subtle' | 'medium' | 'rich';
};

export function Atmosphere(_props: Props) {
  return (
    <View
      pointerEvents="none"
      style={[StyleSheet.absoluteFillObject, { backgroundColor: colors.cream }]}
    />
  );
}
