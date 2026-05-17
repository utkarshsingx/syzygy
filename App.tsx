import 'react-native-gesture-handler';
import './global.css';
import '@/notifications/setup';
import '@/notifications/backgroundFetch';

import { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { SplashGate } from '@/components/system/SplashGate';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { GlobalFx } from '@/components/system/GlobalFx';
import { PhasedStatusBar } from '@/components/system/PhasedStatusBar';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { ThemeSync } from '@/theme/ThemeSync';
import { AuthProvider } from '@/auth/AuthProvider';
import { RootNavigator } from '@/navigation/RootNavigator';
import { linking } from '@/navigation/linking';
import { colors } from '@/theme/colors';
import { registerBackgroundFetch } from '@/notifications/backgroundFetch';
import { autoDetectBloomQuality } from '@/lib/deviceTier';

export default function App() {
  useEffect(() => {
    autoDetectBloomQuality();
    registerBackgroundFetch();
  }, []);

  return (
    <ErrorBoundary>
      <GestureHandlerRootView style={{ flex: 1, backgroundColor: colors.cream }}>
        <SafeAreaProvider>
          <ThemeProvider>
            <ToastProvider>
              <BottomSheetModalProvider>
                <SplashGate>
                  <AuthProvider>
                    <NavigationContainer linking={linking}>
                      <PhasedStatusBar />
                      <ThemeSync />
                      <RootNavigator />
                      <GlobalFx />
                    </NavigationContainer>
                  </AuthProvider>
                </SplashGate>
              </BottomSheetModalProvider>
            </ToastProvider>
          </ThemeProvider>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    </ErrorBoundary>
  );
}
