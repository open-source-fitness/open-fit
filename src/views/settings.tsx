import { useState } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { ThemePreference } from '../services/theme-preference-store';
import { useDisplayName } from '../viewmodels/display-name';
import { useTheme } from '../viewmodels/theme';
import { DisplayNameForm } from './display-name';
import { Button, Card, Copy, FormError, Screen } from './ui';

export function SettingsScreen() {
  const { displayName } = useDisplayName();
  const [editing, setEditing] = useState(false);
  return (
    <Screen>
      <Copy kind="title">Settings</Copy>
      <Card>
        {editing ? (
          <DisplayNameForm initialName={displayName ?? ''} onDone={() => setEditing(false)} />
        ) : <>
          <Copy kind="heading">Display name</Copy>
          <Copy>{displayName}</Copy>
          <Button label="Edit name" onPress={() => setEditing(true)} />
        </>}
      </Card>
      <AppearanceSettings />
    </Screen>
  );
}

const options: readonly { value: ThemePreference; label: string }[] = [
  { value: 'light', label: 'Light' },
  { value: 'dark', label: 'Dark' },
  { value: 'system', label: 'System' },
];

function AppearanceSettings() {
  const model = useTheme();
  const disabled = !model.ready || model.saving;
  let preferenceStatus = 'Your preference is saved on this device.';
  if (model.error) {
    preferenceStatus = 'Choose an appearance to try again.';
  } else if (!model.ready) {
    preferenceStatus = 'Loading preference…';
  } else if (model.saving) {
    preferenceStatus = 'Saving preference…';
  }

  return (
    <Card>
      <Copy kind="heading">Appearance</Copy>
      <Copy kind="muted">System follows your phone’s appearance.</Copy>
      <View accessibilityRole="radiogroup">
        {options.map(({ value, label }) => {
          const selected = model.preference === value;
          return (
            <Pressable
              key={value}
              accessibilityRole="radio"
              accessibilityLabel={label}
              accessibilityState={{ checked: selected, disabled }}
              disabled={disabled}
              onPress={() => void model.selectPreference(value)}
              style={({ pressed }) => ({
                minHeight: 48,
                paddingHorizontal: 12,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'space-between',
                borderBottomWidth: StyleSheet.hairlineWidth,
                borderColor: model.colors.border,
                backgroundColor: selected ? model.colors.surfaceStrong : model.colors.background,
                opacity: pressed || disabled ? 0.6 : 1,
              })}
            >
              <Copy>{label}</Copy>
              {selected ? <Ionicons name="checkmark" size={20} color={model.colors.text} accessible={false} /> : null}
            </Pressable>
          );
        })}
      </View>
      <FormError message={model.error ?? ''} />
      <Copy kind="muted">{preferenceStatus}</Copy>
    </Card>
  );
}
