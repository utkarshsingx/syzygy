import { useNavigation } from '@react-navigation/native';
import type { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { createBottomTabNavigator, type BottomTabBarButtonProps } from '@react-navigation/bottom-tabs';
import { PlatformPressable } from '@react-navigation/elements';
import { Feather } from '@expo/vector-icons';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { InsightsScreen } from '@/screens/InsightsScreen';
import { JournalScreen } from '@/screens/JournalScreen';
import { MusicScreen } from '@/screens/MusicScreen';
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
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          title: 'Home',
          tabBarIcon: ({ color, size }) => <Feather name="home" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="calendar" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Insights"
        component={InsightsScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="bar-chart-2" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Journal"
        component={JournalScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="edit-3" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Music"
        component={MusicScreen}
        options={{
          tabBarIcon: ({ color, size }) => <Feather name="music" color={color} size={size} />,
        }}
      />
      <Tab.Screen
        name="Settings"
        component={SettingsScreen}
        options={{
          tabBarButton: (props) => <SettingsTabButton {...props} />,
          tabBarIcon: ({ color, size }) => <Feather name="settings" color={color} size={size} />,
        }}
      />
    </Tab.Navigator>
  );
}
