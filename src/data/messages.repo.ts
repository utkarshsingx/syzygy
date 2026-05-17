import { ulid } from 'ulid';
import { firestore, paths } from './firebase';
import type { Message, MessageType } from '@/types';

export const messagesRepo = {
  subscribe(coupleId: string, cb: (messages: Message[]) => void): () => void {
    return firestore()
      .collection(paths.messages(coupleId))
      .orderBy('createdAt', 'asc')
      .limit(200)
      .onSnapshot(
        (snap) =>
          cb(
            snap.docs.map((d) => ({ ...(d.data() as Message), id: d.id })),
          ),
        (err) => {
          if (__DEV__) console.warn('[messagesRepo.subscribe]', err);
          cb([]);
        },
      );
  },

  async send(
    coupleId: string,
    from: string,
    to: string,
    type: MessageType,
    content: string,
  ): Promise<string> {
    const id = ulid();
    await firestore()
      .doc(paths.message(coupleId, id))
      .set({
        threadId: coupleId,
        from,
        to,
        type,
        content,
        readAt: null,
        createdAt: Date.now(),
      } satisfies Omit<Message, 'id'>);
    return id;
  },

  async markRead(coupleId: string, messageId: string): Promise<void> {
    await firestore()
      .doc(paths.message(coupleId, messageId))
      .set({ readAt: Date.now() }, { merge: true });
  },
};
