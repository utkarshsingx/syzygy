import { useRef, useState } from 'react';
import { FlatList, View, Text, TextInput, KeyboardAvoidingView, Platform } from 'react-native';
import { format } from 'date-fns';
import { Button } from '@/components/ui/Button';
import { PressScale } from '@/components/motion/PressScale';
import { useToast } from '@/components/ui/Toast';
import { usePartnerStore } from '@/stores/usePartnerStore';
import { useAuth } from '@/auth/AuthProvider';
import { messagesRepo } from '@/data/messages.repo';
import { colors } from '@/theme/colors';
import type { Message } from '@/types';

export function PartnerMessages() {
  const { user } = useAuth();
  const toast = useToast();
  const couple = usePartnerStore((s) => s.couple);
  const messages = usePartnerStore((s) => s.messages);
  const [draft, setDraft] = useState('');
  const [sending, setSending] = useState(false);
  const listRef = useRef<FlatList<Message>>(null);

  if (!user || !couple) return null;

  const partnerId = couple.members.find((m) => m && m !== user.uid) ?? null;

  async function send(type: 'text' | 'summon', body: string) {
    if (!user || !couple) return;
    if (!partnerId) {
      toast.show('Waiting for your partner to accept the invite.', 'info');
      return;
    }
    setSending(true);
    try {
      await messagesRepo.send(couple.coupleId, user.uid, partnerId, type, body);
      setDraft('');
      // Scroll to the bottom after the new message hits the snapshot.
      setTimeout(() => listRef.current?.scrollToEnd({ animated: true }), 200);
    } catch (e) {
      toast.show(e instanceof Error ? e.message : 'Send failed.', 'error');
    } finally {
      setSending(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(m) => m.id ?? `${m.from}-${m.createdAt}`}
        contentContainerStyle={{ padding: 16, gap: 8 }}
        ListEmptyComponent={
          <Text className="font-body text-sm text-ink-100/70 text-center mt-8">
            Nothing yet. Say hello, or send a summon.
          </Text>
        }
        renderItem={({ item }) => <Bubble message={item} mine={item.from === user.uid} />}
      />

      <View className="flex-row gap-2 px-4 pb-3 items-end">
        <PressScale
          onPress={() => send('summon', 'thinking of you')}
          haptic="medium"
          className="bg-roseDust px-3 py-3 rounded-pill"
        >
          <Text className="font-body-medium text-cream text-sm">💗</Text>
        </PressScale>
        <TextInput
          value={draft}
          onChangeText={setDraft}
          placeholder="Write something soft…"
          placeholderTextColor={`${colors.ink}66`}
          selectionColor={colors.terracotta}
          className="flex-1 bg-paper border border-ink-50/15 rounded-pill px-4 py-3 font-body text-base text-ink"
          style={{ maxHeight: 100 }}
          multiline
        />
        <Button
          size="sm"
          onPress={() => draft.trim() && send('text', draft.trim())}
          loading={sending}
          disabled={!draft.trim()}
        >
          Send
        </Button>
      </View>
    </KeyboardAvoidingView>
  );
}

function Bubble({ message, mine }: { message: Message; mine: boolean }) {
  const isSummon = message.type === 'summon';
  return (
    <View
      style={{ alignSelf: mine ? 'flex-end' : 'flex-start', maxWidth: '78%' }}
      className={`px-4 py-2.5 rounded-petal ${
        mine
          ? isSummon
            ? 'bg-roseDust'
            : 'bg-terracotta'
          : 'bg-paper border border-ink-50/15'
      }`}
    >
      <Text
        className={`font-body text-base ${mine ? 'text-cream' : 'text-ink'}`}
      >
        {isSummon ? '💗 thinking of you' : message.content}
      </Text>
      <Text
        className={`font-body text-xs mt-1 ${mine ? 'text-cream/70' : 'text-ink-100/60'}`}
      >
        {format(new Date(message.createdAt), 'h:mm a')}
      </Text>
    </View>
  );
}
