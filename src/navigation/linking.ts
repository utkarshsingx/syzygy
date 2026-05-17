import type { LinkingOptions } from '@react-navigation/native';
import * as Linking from 'expo-linking';
import type { RootStackParamList } from './types';

export const linking: LinkingOptions<RootStackParamList> = {
  prefixes: [Linking.createURL('/'), 'https://bloom.app', 'bloom://'],
  config: {
    screens: {
      ShareAccept: 'share/:inviteCode',
      Auth: {
        screens: {
          Landing: '',
          SignIn: 'sign-in',
          SignUp: 'sign-up',
          Onboarding: 'onboarding',
        },
      },
      AppTabs: {
        screens: {
          Dashboard: 'dashboard',
          Calendar: 'calendar',
          Insights: 'insights',
          Journal: 'journal',
          Partner: 'partner',
          Settings: 'settings',
        },
      },
    },
  },
};
