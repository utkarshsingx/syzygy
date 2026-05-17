import type { NavigatorScreenParams } from '@react-navigation/native';

export type AuthStackParamList = {
  Landing: undefined;
  Onboarding: undefined;
  SignIn: undefined;
  SignUp: undefined;
};

export type AppTabsParamList = {
  Dashboard: undefined;
  Calendar: undefined;
  Insights: undefined;
  Journal: undefined;
  Partner: undefined;
  Settings: undefined;
};

export type RootStackParamList = {
  Auth: NavigatorScreenParams<AuthStackParamList>;
  AppTabs: NavigatorScreenParams<AppTabsParamList>;
  ShareAccept: { inviteCode: string };
};

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}
