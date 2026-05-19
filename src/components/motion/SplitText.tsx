import { Text, type TextStyle, type StyleProp } from 'react-native';

type Props = {
  children: string;
  style?: StyleProp<TextStyle>;
  delay?: number;
  stagger?: number;
  duration?: number;
  by?: 'word' | 'char';
  className?: string;
};

export function SplitText({ children, style, className }: Props) {
  return (
    <Text style={style} className={className}>
      {children}
    </Text>
  );
}
