import type { PropsWithChildren, ReactNode } from 'react';
import { ScrollView, StyleSheet, useWindowDimensions, View } from 'react-native';
import { useTheme } from '../viewmodels/theme';
import { Copy } from './ui';

export function SetSheet({ columns, editable = false, children }: PropsWithChildren<{
  columns: readonly [string, string];
  editable?: boolean;
}>) {
  const { colors } = useTheme();
  const { fontScale } = useWindowDimensions();
  return (
    <ScrollView horizontal keyboardShouldPersistTaps="handled" contentContainerStyle={styles.scroll}>
      <View style={[styles.sheet, { minWidth: (editable ? 234 : 200) * Math.max(1, fontScale) }]}>
        <View style={[styles.row, { backgroundColor: colors.surfaceStrong, borderColor: colors.border }]}>
          <SetSheetCells number={<Copy kind="label">Set</Copy>}
            values={[<Copy kind="label">{columns[0]}</Copy>, <Copy kind="label">{columns[1]}</Copy>]}
            action={editable ? <View /> : undefined} />
        </View>
        {children}
      </View>
    </ScrollView>
  );
}

export function SetSheetRow({ number, values, action, accessibilityLabel }: {
  number: number;
  values: readonly [ReactNode, ReactNode];
  action?: ReactNode;
  accessibilityLabel?: string;
}) {
  const { colors } = useTheme();
  return (
    <View accessible={Boolean(accessibilityLabel)} accessibilityLabel={accessibilityLabel}
      style={[styles.row, { borderColor: colors.border }]}>
      <SetSheetCells number={<Copy kind="muted">{number}</Copy>} values={values} action={action} />
    </View>
  );
}

function SetSheetCells({ number, values, action }: {
  number: ReactNode;
  values: readonly [ReactNode, ReactNode];
  action?: ReactNode;
}) {
  return <>
    <View style={styles.number}>{number}</View>
    <View style={styles.values}>
      <View style={styles.value}>{values[0]}</View>
      <View style={styles.value}>{values[1]}</View>
    </View>
    {action ? <View style={styles.action}>{action}</View> : null}
  </>;
}

const styles = StyleSheet.create({
  scroll: { flexGrow: 1 },
  sheet: { flexGrow: 1 },
  row: {
    minHeight: 40, flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 8, paddingVertical: 4, borderBottomWidth: StyleSheet.hairlineWidth,
  },
  number: { width: '14%', minWidth: 26 },
  values: { flex: 1, flexBasis: 0, flexDirection: 'row' },
  value: { width: '50%', paddingHorizontal: 4 },
  action: { width: 44, alignItems: 'center' },
});
