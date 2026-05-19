import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { AuthStack } from './AuthStack';
import { AppTabs } from './AppTabs';
import { ShareAcceptScreen } from '@/screens/ShareAcceptScreen';
import { ComponentGalleryScreen } from '@/screens/dev/ComponentGalleryScreen';
import { DeveloperScreen } from '@/screens/DeveloperScreen';
import { AdminMusicScreen } from '@/screens/admin/AdminMusicScreen';
import { PartnerScreen } from '@/screens/PartnerScreen';
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
      <Stack.Screen
        name="Developer"
        component={DeveloperScreen}
        options={{ headerShown: true, title: 'Developer' }}
      />
      <Stack.Screen
        name="AdminMusic"
        component={AdminMusicScreen}
        options={{ headerShown: true, title: 'Music library' }}
      />
      <Stack.Screen
        name="Partner"
        component={PartnerScreen}
        options={{ headerShown: true, title: 'Partner' }}
      />
      {__DEV__ ? (
        <Stack.Screen
          name="ComponentGallery"
          component={ComponentGalleryScreen}
          options={{ presentation: 'modal', headerShown: true, title: 'Gallery' }}
        />
      ) : null}
    </Stack.Navigator>
  );
}
