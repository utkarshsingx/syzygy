import { View, Text, type TextStyle, type StyleProp } from 'react-native';
import Animated, { FadeInUp } from 'react-native-reanimated';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { durations } from '@/theme/motion';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
  delay?: number;
  stagger?: number;
  duration?: number;
  by?: 'word' | 'char';
  className?: string;
};

// Port of the web SplitText: each word (or char) is its own animated text
// inside a clipping box, falling into place with a stagger.
export function SplitText({
  children,
  style,
  delay = 0,
  stagger = 40,
  duration = durations.reveal,
  by = 'word',
  className,
}: Props) {
  const reduced = useReducedMotion();
  const segments = by === 'word' ? children.split(/(\s+)/) : Array.from(children);

  if (reduced) {
    return (
      <Text style={style} className={className}>
        {children}
      </Text>
    );
  }

  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
      {segments.map((seg, i) => {
        if (seg.match(/^\s+$/)) {
          return (
            <Text key={i} style={style} className={className}>
              {seg}
            </Text>
          );
        }
        return (
          <View key={i} style={{ overflow: 'hidden' }}>
            <Animated.Text
              entering={FadeInUp.delay(delay + i * stagger).duration(duration)}
              style={style}
              className={className}
            >
              {seg}
            </Animated.Text>
          </View>
        );
      })}
    </View>
  );
}
