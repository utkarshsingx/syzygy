import { View, Text } from 'react-native';
import { format } from 'date-fns';
import { Card } from '@/components/ui/Card';
import type { JournalEntry as JournalEntryType } from '@/types';

type Props = { entry: JournalEntryType };

export function JournalEntry({ entry }: Props) {
  return (
    <Card className="mb-3">
      <Text className="font-body text-xs text-ink-100/60 mb-1.5 uppercase tracking-widest">
        {format(new Date(entry.createdAt), 'EEE, MMM d · h:mm a')}
      </Text>
      <Text className="font-body text-base text-ink leading-relaxed">{entry.content}</Text>
    </Card>
  );
}
