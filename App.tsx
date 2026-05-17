import 'react-native-gesture-handler';
import './global.css';
import '@/notifications/setup';

import { StatusBar } from 'expo-status-bar';
import { NavigationContainer } from '@react-navigation/native';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { BottomSheetModalProvider } from '@gorhom/bottom-sheet';

import { SplashGate } from '@/components/system/SplashGate';
import { ErrorBoundary } from '@/components/system/ErrorBoundary';
import { ToastProvider } from '@/components/ui/Toast';
import { ThemeProvider } from '@/theme/ThemeProvider';
import { AuthProvider } from '@/auth/AuthProvider';
import { RootNavigator } from '@/navigation/RootNavigator';
import { linking } from '@/navigation/linking';
import { colors } from '@/theme/colors';

export default function App() {
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
                      <StatusBar style="dark" backgroundColor={colors.cream} />
                      <RootNavigator />
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
