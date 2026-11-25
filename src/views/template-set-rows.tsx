import { StyleSheet, TextInput } from 'react-native';
import type { TemplateSet } from '../models/workout';
import { controlRadius } from '../theme/palette';
import { useTheme } from '../viewmodels/theme';
import { SetSheet, SetSheetRow } from './set-sheet';
import { Copy, IconButton } from './ui';

interface SetTargets { readonly reps: string; readonly weight: string }
interface SetEditor {
  readonly exerciseNumber: number;
  readonly disabled: boolean;
  changeSet(index: number, field: 'reps' | 'weight', value: string): void;
  removeSet(index: number): void;
}

export function PlannedSetRows({ sets }: { sets: readonly TemplateSet[] }) {
  return <TemplateSetRows sets={sets.map((set) => ({ reps: String(set.targetReps), weight: String(set.targetWeight) }))} />;
}

export function TemplateSetRows({ sets, editor }: { sets: readonly SetTargets[]; editor?: SetEditor }) {
  const { colors } = useTheme();

  function valueCell(set: SetTargets, index: number, field: keyof SetTargets) {
    if (!editor) return <Copy kind="value">{set[field]}</Copy>;
    const weight = field === 'weight';
    const label = weight ? 'weight (lb)' : 'reps';
    return <TextInput
      accessibilityLabel={`Exercise ${editor.exerciseNumber} set ${index + 1} ${label}`}
      placeholder={weight ? 'Weight' : 'Reps'} placeholderTextColor={colors.secondary}
      value={set[field]} onChangeText={(value) => editor.changeSet(index, field, value)}
      keyboardType={weight ? 'decimal-pad' : 'number-pad'}
      editable={!editor.disabled} accessibilityState={{ disabled: editor.disabled }}
      style={[styles.input, { color: colors.text, borderColor: colors.secondary, backgroundColor: colors.background }]}
    />;
  }

  return (
    <SetSheet columns={['Reps', 'Weight (lb)']} editable={!!editor}>
      {sets.map((set, index) => <SetSheetRow key={index} number={index + 1}
        accessibilityLabel={editor ? undefined : `Set ${index + 1}: ${set.reps} reps × ${set.weight} lb`}
        values={[valueCell(set, index, 'reps'), valueCell(set, index, 'weight')]}
        action={editor ? <IconButton label={`Remove exercise ${editor.exerciseNumber} set ${index + 1}`}
          icon="close-outline" disabled={editor.disabled} onPress={() => editor.removeSet(index)} /> : undefined}
      />)}
    </SetSheet>
  );
}

const styles = StyleSheet.create({
  input: {
    minHeight: 44, paddingHorizontal: 8, paddingVertical: 4, borderWidth: 1,
    borderRadius: controlRadius, fontSize: 16, fontVariant: ['tabular-nums'],
  },
});
