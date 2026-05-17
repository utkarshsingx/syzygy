import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { InsightsScreen } from '@/screens/InsightsScreen';
import { JournalScreen } from '@/screens/JournalScreen';
import { PartnerScreen } from '@/screens/PartnerScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import type { AppTabsParamList, RootStackParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

// Long-press the Settings tab to open the dev component gallery (DEV only).
function SettingsTabButton(props: BottomTabBarButtonProps) {
  const nav = useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const { ref: _ref, delayLongPress: _d, ...rest } = props as BottomTabBarButtonProps & {
    ref?: unknown;
    delayLongPress?: number;
  };
  return (
    <PlatformPressable
      {...rest}
      onLongPress={(e) => {
        if (__DEV__) {
          nav.navigate('ComponentGallery');
        } else {
          props.onLongPress?.(e);
        }
      }}
    />
  );
}

export function AppTabs() {
  return (
    <Tab.Navigator
      initialRouteName="Dashboard"
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: colors.terracotta,
        tabBarInactiveTintColor: colors.ink,
        tabBarStyle: {
          backgroundColor: colors.cream,
          borderTopColor: colors.paper,
        },
        tabBarLabelStyle: {
          fontFamily: fonts.bodyMedium,
          fontSize: 11,
        },
      }}
    >
      <Tab.Screen name="Dashboard" component={DashboardScreen} options={{ title: 'Home' }} />
      <Tab.Screen name="Calendar" component={CalendarScreen} />
      <Tab.Screen name="Insights" component={InsightsScreen} />
      <Tab.Screen name="Journal" component={JournalScreen} />
      <Tab.Screen name="Partner" component={PartnerScreen} />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ tabBarButton: (props) => <SettingsTabButton {...props} /> }}
      />
    </Tab.Navigator>
  );
}
