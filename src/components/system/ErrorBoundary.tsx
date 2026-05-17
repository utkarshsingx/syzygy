import { Component, type ReactNode } from 'react';
import { View, Text } from 'react-native';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';

type Props = { children: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    if (__DEV__) {
      console.error('[Bloom ErrorBoundary]', error);
    }
  }

  render() {
    if (this.state.error) {
      return (
        <View style={{ flex: 1, backgroundColor: colors.cream, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <Text style={{ fontFamily: fonts.display, fontSize: 28, color: colors.ink, marginBottom: 8 }}>
            Something wilted.
          </Text>
          <Text style={{ fontFamily: fonts.body, fontSize: 14, color: colors.ink, textAlign: 'center' }}>
            {this.state.error.message}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}
