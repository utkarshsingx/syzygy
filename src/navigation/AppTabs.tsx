import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { DashboardScreen } from '@/screens/DashboardScreen';
import { CalendarScreen } from '@/screens/CalendarScreen';
import { InsightsScreen } from '@/screens/InsightsScreen';
import { JournalScreen } from '@/screens/JournalScreen';
import { PartnerScreen } from '@/screens/PartnerScreen';
import { SettingsScreen } from '@/screens/SettingsScreen';
import { colors } from '@/theme/colors';
import { fonts } from '@/theme/typography';
import type { AppTabsParamList } from './types';

const Tab = createBottomTabNavigator<AppTabsParamList>();

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
      <Tab.Screen name="Settings" component={SettingsScreen} />
    </Tab.Navigator>
  );
}
