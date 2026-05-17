import { onDocumentCreated } from 'firebase-functions/v2/firestore';
import { getFirestore } from 'firebase-admin/firestore';
import { getMessaging } from 'firebase-admin/messaging';

// Fan out FCM pushes when a new message arrives in a couple thread.
// Summons get a slightly different notification body so they stand out.
export const onPartnerMessage = onDocumentCreated(
  'couples/{coupleId}/messages/{messageId}',
  async (event) => {
    const msg = event.data?.data() as
      | {
          from: string;
          to: string;
          type: 'text' | 'summon' | 'reaction' | 'mood_update';
          content: string;
        }
      | undefined;
    if (!msg) return;

    const recipient = await getFirestore().doc(`users/${msg.to}`).get();
    if (!recipient.exists) return;
    const recipientData = recipient.data() as {
      displayName?: string;
      fcmTokens?: string[];
      notificationPrefs?: { partnerSummons?: boolean };
    };
    const tokens = recipientData.fcmTokens ?? [];
    if (tokens.length === 0) return;

    // Allow recipients to mute summons specifically.
    if (msg.type === 'summon' && recipientData.notificationPrefs?.partnerSummons === false) {
      return;
    }

    const sender = await getFirestore().doc(`users/${msg.from}`).get();
    const senderName = (sender.data() as { displayName?: string })?.displayName ?? 'Your person';

    const title = msg.type === 'summon' ? `${senderName} is thinking of you` : senderName;
    const body = msg.type === 'summon' ? '💗' : msg.content;

    const messaging = getMessaging();
    const response = await messaging.sendEachForMulticast({
      tokens,
      notification: { title, body },
      data: { type: msg.type, coupleId: event.params.coupleId },
      android: { priority: 'high' as const },
    });

    // Clean up dead tokens so we don't keep retrying them.
    const dead: string[] = [];
    response.responses.forEach((r, i) => {
      if (
        !r.success &&
        (r.error?.code === 'messaging/registration-token-not-registered' ||
          r.error?.code === 'messaging/invalid-registration-token')
      ) {
        const token = tokens[i];
        if (token) dead.push(token);
      }
    });
    if (dead.length > 0) {
      await getFirestore()
        .doc(`users/${msg.to}`)
        .update({
          fcmTokens: tokens.filter((t) => !dead.includes(t)),
        });
    }
  },
);
