import {
  forwardRef,
  useMemo,
  type ReactNode,
  type Ref,
} from 'react';
import BottomSheet, {
  BottomSheetBackdrop,
  BottomSheetView,
  type BottomSheetBackdropProps,
} from '@gorhom/bottom-sheet';
import { colors } from '@/theme/colors';

type Props = {
  children: ReactNode;
  snapPoints?: (string | number)[];
  index?: number;
  onChange?: (index: number) => void;
  enablePanDownToClose?: boolean;
};

// Reusable bottom sheet with botanical styling. Used for LogEntryModal,
// CalendarDay detail, and Journal composer.
export const Sheet = forwardRef(function Sheet(
  {
    children,
    snapPoints,
    index = -1,
    onChange,
    enablePanDownToClose = true,
  }: Props,
  ref: Ref<BottomSheet>,
) {
  const points = useMemo(() => snapPoints ?? ['60%', '92%'], [snapPoints]);

  const renderBackdrop = (props: BottomSheetBackdropProps) => (
    <BottomSheetBackdrop
      {...props}
      appearsOnIndex={0}
      disappearsOnIndex={-1}
      opacity={0.45}
      pressBehavior="close"
    />
  );

  return (
    <BottomSheet
      ref={ref}
      index={index}
      snapPoints={points}
      enablePanDownToClose={enablePanDownToClose}
      onChange={onChange}
      backdropComponent={renderBackdrop}
      backgroundStyle={{ backgroundColor: colors.cream }}
      handleIndicatorStyle={{ backgroundColor: colors.ink, opacity: 0.25, width: 48 }}
    >
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 20, paddingTop: 8 }}>
        {children}
      </BottomSheetView>
    </BottomSheet>
  );
});
