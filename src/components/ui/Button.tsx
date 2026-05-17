import { type ReactNode } from 'react';
import { Text, View, ActivityIndicator } from 'react-native';
import { PressScale } from '@/components/motion/PressScale';
import { cn } from '@/lib/cn';

type Variant = 'primary' | 'secondary' | 'ghost' | 'soft';
type Size = 'sm' | 'md' | 'lg';

type Props = {
  children: ReactNode;
  onPress?: () => void;
  variant?: Variant;
  size?: Size;
  disabled?: boolean;
  loading?: boolean;
  className?: string;
  leftSlot?: ReactNode;
  rightSlot?: ReactNode;
  accessibilityLabel?: string;
};

const containerByVariant: Record<Variant, string> = {
  primary: 'bg-terracotta',
  secondary: 'bg-paper border border-ink-50/20',
  ghost: 'bg-transparent',
  soft: 'bg-terracotta-50 border border-terracotta-100',
};

const textByVariant: Record<Variant, string> = {
  primary: 'text-cream',
  secondary: 'text-ink',
  ghost: 'text-ink',
  soft: 'text-terracotta-700',
};

const sizeContainer: Record<Size, string> = {
  sm: 'px-4 py-2 rounded-pill',
  md: 'px-6 py-3 rounded-pill',
  lg: 'px-8 py-4 rounded-petal',
};

const sizeText: Record<Size, string> = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-base',
};

export function Button({
  children,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled,
  loading,
  className,
  leftSlot,
  rightSlot,
  accessibilityLabel,
}: Props) {
  const isDisabled = disabled || loading;
  return (
    <PressScale
      onPress={isDisabled ? undefined : onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? (typeof children === 'string' ? children : undefined)}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(
        'flex-row items-center justify-center gap-2',
        containerByVariant[variant],
        sizeContainer[size],
        isDisabled && 'opacity-50',
        className,
      )}
    >
      {leftSlot}
      {loading ? (
        <ActivityIndicator size="small" color={variant === 'primary' ? '#F5EFE4' : '#2A2622'} />
      ) : (
        <View className="flex-row items-center">
          {typeof children === 'string' ? (
            <Text className={cn('font-body-semibold', sizeText[size], textByVariant[variant])}>
              {children}
            </Text>
          ) : (
            children
          )}
        </View>
      )}
      {rightSlot}
    </PressScale>
  );
}
