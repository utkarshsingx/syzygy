import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from 'react';
import { View, Text, Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { cn } from '@/lib/cn';

type ToastKind = 'info' | 'success' | 'error';
type ToastItem = { id: number; message: string; kind: ToastKind };

type ToastContextValue = {
  show: (message: string, kind?: ToastKind) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error('useToast must be used inside ToastProvider');
  return ctx;
}

export function ToastProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<ToastItem[]>([]);
  const insets = useSafeAreaInsets();

  const show = useCallback((message: string, kind: ToastKind = 'info') => {
    const id = Date.now() + Math.random();
    setItems((cur) => [...cur, { id, message, kind }]);
    setTimeout(() => {
      setItems((cur) => cur.filter((t) => t.id !== id));
    }, 3200);
  }, []);

  const value = useMemo(() => ({ show }), [show]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <View
        pointerEvents="box-none"
        style={{
          position: 'absolute',
          left: 0,
          right: 0,
          bottom: insets.bottom + 24,
          alignItems: 'center',
          gap: 8,
        }}
      >
        {items.map((t) => (
          <Pressable
            key={t.id}
            onPress={() => setItems((cur) => cur.filter((x) => x.id !== t.id))}
            className={cn(
              'px-4 py-3 rounded-pill border max-w-[88%]',
              t.kind === 'success' && 'bg-sage-100 border-sage-300',
              t.kind === 'error' && 'bg-terracotta-50 border-terracotta-300',
              t.kind === 'info' && 'bg-paper border-ink-50/20',
            )}
          >
            <Text className="font-body-medium text-sm text-ink">{t.message}</Text>
          </Pressable>
        ))}
      </View>
    </ToastContext.Provider>
  );
}
