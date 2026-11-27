import { Stack } from 'expo-router';
import { useTheme } from '../viewmodels/theme';
import { chrome } from '../theme/palette';

export function SectionStack({ screens }: { screens: Readonly<Record<string, string>> }) {
  const { colors, displayFont } = useTheme();
  return (
    <Stack
      screenOptions={{
        headerBackButtonDisplayMode: 'minimal',
        headerStyle: { backgroundColor: chrome.background },
        headerTintColor: chrome.text,
        headerTitleStyle: displayFont ? { fontFamily: displayFont, fontSize: 24 } : undefined,
        headerShadowVisible: false,
        contentStyle: { backgroundColor: colors.background },
      }}
    >
      {Object.entries(screens).map(([name, title]) => (
        <Stack.Screen key={name} name={name} options={{ title }} />
      ))}
    </Stack>
  );
}
