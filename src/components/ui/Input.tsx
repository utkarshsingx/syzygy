import { forwardRef } from 'react';
import { TextInput, View, Text, type TextInputProps } from 'react-native';
import { cn } from '@/lib/cn';
import { colors } from '@/theme/colors';

type Props = TextInputProps & {
  label?: string;
  error?: string;
  hint?: string;
  containerClassName?: string;
};

export const Input = forwardRef<TextInput, Props>(function Input(
  { label, error, hint, containerClassName, className, ...rest },
  ref,
) {
  return (
    <View className={cn('w-full', containerClassName)}>
      {label ? (
        <Text className="font-body-medium text-sm text-ink mb-1.5">{label}</Text>
      ) : null}
      <TextInput
        ref={ref}
        placeholderTextColor={`${colors.ink}66`}
        selectionColor={colors.terracotta}
        className={cn(
          'bg-cream border border-paper rounded-soft px-4 py-3 font-body text-base text-ink',
          error && 'border-terracotta',
          className,
        )}
        {...rest}
      />
      {error ? (
        <Text className="font-body text-xs text-terracotta mt-1.5">{error}</Text>
      ) : hint ? (
        <Text className="font-body text-xs text-ink-100/70 mt-1.5">{hint}</Text>
      ) : null}
    </View>
  );
});
