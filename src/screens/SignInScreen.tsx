import { useState } from 'react';
import { View, Text, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { Atmosphere } from '@/components/atmosphere/Atmosphere';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Reveal } from '@/components/motion/Reveal';
import { SplitText } from '@/components/motion/SplitText';
import { useAuth } from '@/auth/AuthProvider';
import { useToast } from '@/components/ui/Toast';
import { useUserStore } from '@/stores/useUserStore';
import { fonts } from '@/theme/typography';
import { colors } from '@/theme/colors';
import type { AuthStackParamList } from '@/navigation/types';

export function SignInScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { signInWithEmail } = useAuth();
  const toast = useToast();
  const setOnboarded = useUserStore((s) => s.setOnboarded);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || !password) {
      toast.show('Email and password required.', 'info');
      return;
    }
    setLoading(true);
    try {
      await signInWithEmail(email.trim(), password);
      setOnboarded(true);
      toast.show('Welcome back.', 'success');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Sign-in failed.', 'error');
    } finally {
      setLoading(false);
    }
  }

  return (
    <SafeAreaView className="flex-1" edges={['top', 'bottom']}>
      <Atmosphere intensity="subtle" />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View className="flex-1 justify-center px-8">
          <SplitText
            style={{ fontFamily: fonts.displayBold, fontSize: 36, color: colors.ink }}
          >
            Welcome back
          </SplitText>
          <Reveal direction="up" delay={300}>
            <Text className="font-body text-sm text-ink-100 mt-2 mb-8">
              Sign in to sync your data across devices and reach your partner.
            </Text>
          </Reveal>

          <Reveal direction="up" delay={450}>
            <Input
              label="Email"
              placeholder="you@bloom.app"
              autoCapitalize="none"
              autoComplete="email"
              keyboardType="email-address"
              value={email}
              onChangeText={setEmail}
              containerClassName="mb-4"
            />
          </Reveal>
          <Reveal direction="up" delay={550}>
            <Input
              label="Password"
              placeholder="••••••••"
              secureTextEntry
              autoComplete="password"
              value={password}
              onChangeText={setPassword}
              containerClassName="mb-6"
            />
          </Reveal>

          <Reveal direction="up" delay={700}>
            <Button size="lg" onPress={submit} loading={loading}>
              Sign in
            </Button>
          </Reveal>

          <View className="h-3" />

          <Reveal direction="fade" delay={900}>
            <Button variant="ghost" size="sm" onPress={() => nav.navigate('SignUp')}>
              No account? Sign up
            </Button>
          </Reveal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
