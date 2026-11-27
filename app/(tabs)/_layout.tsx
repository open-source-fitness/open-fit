import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router/js-tabs';
import { PlatformPressable } from 'expo-router/react-navigation';
import { chrome } from '../../src/theme/palette';
import { useWorkouts } from '../../src/viewmodels/workout-provider';

export default function TabsLayout() {
  const { savingTemplate } = useWorkouts();
  return (
    <Tabs
      backBehavior="history"
      screenListeners={{
        tabPress: (event) => {
          if (savingTemplate) event.preventDefault();
        },
      }}
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: chrome.text,
        tabBarInactiveTintColor: chrome.secondary,
        tabBarStyle: { backgroundColor: chrome.background, borderTopColor: chrome.border },
        tabBarLabelStyle: { fontSize: 12, fontWeight: '600' },
        tabBarButton: (props) => (
          <PlatformPressable
            {...props}
            disabled={savingTemplate}
            accessibilityState={{ ...props.accessibilityState, disabled: savingTemplate }}
            style={[props.style, {
              opacity: savingTemplate ? 0.5 : 1,
              borderTopWidth: 3,
              borderTopColor: props['aria-selected'] ? chrome.accent : chrome.background,
            }]}
          />
        ),
      }}
    >
      <Tabs.Screen
        name="templates"
        options={{
          title: 'Templates',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="list-outline" color={focused ? chrome.text : chrome.secondary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="workouts"
        options={{
          title: 'Workouts',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="time-outline" color={focused ? chrome.text : chrome.secondary} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: 'Settings',
          tabBarIcon: ({ focused, size }) => (
            <Ionicons name="settings-outline" color={focused ? chrome.text : chrome.secondary} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
