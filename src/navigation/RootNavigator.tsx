import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { ShareAcceptScreen } from '@/screens/ShareAcceptScreen';
import { useUserStore } from '@/stores/useUserStore';
import type { RootStackParamList } from './types';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const onboarded = useUserStore((s) => s.onboarded);

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      {onboarded ? (
        <Stack.Screen name="AppTabs" component={AppTabs} />
      ) : (
        <Stack.Screen name="Auth" component={AuthStack} />
      )}
      <Stack.Screen
        name="ShareAccept"
        component={ShareAcceptScreen}
        options={{ presentation: 'modal' }}
      />
    </Stack.Navigator>
  );
}
