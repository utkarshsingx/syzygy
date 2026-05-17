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

export function SignUpScreen() {
  const nav = useNavigation<NativeStackNavigationProp<AuthStackParamList>>();
  const { upgradeAnonWithEmail, signUpWithEmail, status } = useAuth();
  const toast = useToast();
  const setOnboarded = useUserStore((s) => s.setOnboarded);
  const setStoredName = useUserStore((s) => s.setName);

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  async function submit() {
    if (!email.trim() || password.length < 6) {
      toast.show('Email + 6+ char password required.', 'info');
      return;
    }
    setLoading(true);
    try {
      // If we're currently anonymous, link credentials so data persists.
      if (status === 'anonymous') {
        await upgradeAnonWithEmail(email.trim(), password, name.trim() || undefined);
      } else {
        await signUpWithEmail(email.trim(), password, name.trim() || undefined);
      }
      if (name.trim()) setStoredName(name.trim());
      setOnboarded(true);
      toast.show('Account created.', 'success');
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Sign-up failed.', 'error');
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
            Create account
          </SplitText>
          <Reveal direction="up" delay={300}>
            <Text className="font-body text-sm text-ink-100 mt-2 mb-8">
              Sync across devices. Link your partner. Your local entries
              carry over.
            </Text>
          </Reveal>

          <Reveal direction="up" delay={450}>
            <Input
              label="Name"
              placeholder="Your name"
              autoCapitalize="words"
              value={name}
              onChangeText={setName}
              containerClassName="mb-4"
            />
          </Reveal>
          <Reveal direction="up" delay={550}>
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
          <Reveal direction="up" delay={650}>
            <Input
              label="Password"
              placeholder="At least 6 characters"
              secureTextEntry
              autoComplete="new-password"
              value={password}
              onChangeText={setPassword}
              containerClassName="mb-6"
            />
          </Reveal>

          <Reveal direction="up" delay={800}>
            <Button size="lg" onPress={submit} loading={loading}>
              Create account
            </Button>
          </Reveal>

          <View className="h-3" />

          <Reveal direction="fade" delay={1000}>
            <Button variant="ghost" size="sm" onPress={() => nav.navigate('SignIn')}>
              Have an account? Sign in
            </Button>
          </Reveal>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
