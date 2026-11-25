import { createContext, useContext, useRef, useState, type ComponentRef, type ComponentProps, type PropsWithChildren, type ReactNode } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { useHeaderHeight } from 'expo-router/react-navigation';
import { SafeAreaView } from 'react-native-safe-area-context';
import Ionicons from '@expo/vector-icons/Ionicons';
import { useTheme } from '../viewmodels/theme';
import { controlRadius, screenGutter } from '../theme/palette';
import type { LoadState } from '../viewmodels/workouts';

interface ScreenScroll {
  beginDrag(): void;
  endDrag(): void;
  offset(): number;
  scrollAtEdge(pageY: number): void;
}
const ScreenScrollContext = createContext<ScreenScroll | null>(null);
export function useScreenScroll() {
  const scroll = useContext(ScreenScrollContext);
  if (!scroll) throw new Error('Screen is required for reordering.');
  return scroll;
}

export function Screen({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  const headerHeight = useHeaderHeight();
  const scrollRef = useRef<ComponentRef<typeof ScrollView>>(null);
  const metrics = useRef({ offset: 0, height: 0, contentHeight: 0, top: 0 });
  const [dragging, setDragging] = useState(false);
  const scroll: ScreenScroll = {
    beginDrag() {
      scrollRef.current?.measureInWindow((_x, y, _width, height) => {
        metrics.current.top = y;
        metrics.current.height = height;
      });
      setDragging(true);
    },
    endDrag() { setDragging(false); },
    offset() { return metrics.current.offset; },
    scrollAtEdge(pageY) {
      const m = metrics.current;
      const delta = pageY < m.top + 80 ? -8 : pageY > m.top + m.height - 80 ? 8 : 0;
      const offset = Math.max(0, Math.min(Math.max(0, m.contentHeight - m.height), m.offset + delta));
      m.offset = offset;
      scrollRef.current?.scrollTo({ y: offset, animated: false });
    },
  };
  return (
    <KeyboardAvoidingView
      style={{ flex: 1 }}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={headerHeight}
    >
      <SafeAreaView
        edges={['left', 'right', 'bottom']}
        style={{ flex: 1, backgroundColor: colors.background }}
      >
        <ScreenScrollContext.Provider value={scroll}>
          <ScrollView ref={scrollRef} scrollEnabled={!dragging} keyboardShouldPersistTaps="handled" contentContainerStyle={styles.screen}
            scrollEventThrottle={16} onScroll={(event) => { metrics.current.offset = event.nativeEvent.contentOffset.y; }}
            onLayout={(event) => { metrics.current.height = event.nativeEvent.layout.height; }}
            onContentSizeChange={(_width, height) => { metrics.current.contentHeight = height; }}>
            {children}
          </ScrollView>
        </ScreenScrollContext.Provider>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

export function Copy({
  children,
  kind = 'body',
}: PropsWithChildren<{ kind?: 'title' | 'heading' | 'body' | 'muted' | 'label' | 'value' }>) {
  const { colors, displayFont } = useTheme();
  const heading = kind === 'title' || kind === 'heading';
  return (
    <Text accessibilityRole={heading ? 'header' : undefined} style={[
      styles[kind],
      { color: kind === 'muted' || kind === 'label' ? colors.secondary : colors.text },
      kind === 'title' && displayFont ? { fontFamily: displayFont, fontWeight: 'normal' } : undefined,
    ]}>
      {children}
    </Text>
  );
}

export function FormError({ message }: { message: string }) {
  const { colors } = useTheme();
  if (!message) return null;
  return <Text accessibilityRole="alert" accessibilityLiveRegion="polite" style={{ color: colors.error, fontSize: 16 }}>{message}</Text>;
}

export function Card({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return (
    <View style={[styles.card, { backgroundColor: colors.surface, borderColor: colors.text }]}>
      {children}
    </View>
  );
}

export function Button({
  label,
  accessibilityLabel,
  onPress,
  disabled = false,
  variant = 'secondary',
  icon,
}: {
  label: string;
  accessibilityLabel?: string;
  onPress: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'secondary' | 'danger';
  icon?: ComponentProps<typeof Ionicons>['name'];
}) {
  const { colors } = useTheme();
  const foreground = variant === 'primary' ? colors.onAccent : variant === 'danger' ? colors.error : colors.text;
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ disabled }}
      disabled={disabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.button,
        {
          backgroundColor: variant === 'primary' ? colors.accent : undefined,
          borderColor: variant === 'primary' ? colors.accent : variant === 'danger' ? colors.error : colors.secondary,
          opacity: pressed || disabled ? 0.6 : 1,
        },
      ]}
    >
      {icon ? <Ionicons name={icon} size={18} color={foreground} accessible={false} /> : null}
      <Text style={[styles.buttonText, { color: foreground }]}>{label}</Text>
    </Pressable>
  );
}

export function IconButton({ label, icon, onPress, disabled = false }: {
  label: string;
  icon: ComponentProps<typeof Ionicons>['name'];
  onPress(): void;
  disabled?: boolean;
}) {
  const { colors } = useTheme();
  return <Pressable accessibilityRole="button" accessibilityLabel={label}
    accessibilityState={{ disabled }} disabled={disabled} onPress={onPress}
    style={({ pressed }) => ({ minWidth: 44, minHeight: 44, alignItems: 'center', justifyContent: 'center', opacity: disabled || pressed ? 0.5 : 1 })}>
    <Ionicons name={icon} size={24} color={colors.text} accessible={false} />
  </Pressable>;
}

export function LinkCard({
  title,
  subtitle,
  detail,
  onPress,
}: {
  title: string;
  subtitle?: string;
  detail?: string;
  onPress: () => void;
}) {
  const { colors } = useTheme();
  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel={[title, [subtitle, detail].filter(Boolean).join(' ')].filter(Boolean).join('. ')}
      onPress={onPress}
      style={({ pressed }) => [
        styles.link,
        { backgroundColor: pressed ? colors.surfaceStrong : undefined, borderColor: colors.border },
      ]}
    >
      <View style={styles.linkText}>
        <Copy kind="heading">{title}</Copy>
        {subtitle ? <Copy kind="muted">{subtitle}</Copy> : null}
        {detail ? <Copy kind="muted">{detail}</Copy> : null}
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.secondary} accessible={false} />
    </Pressable>
  );
}

export function RuledList({ children }: PropsWithChildren) {
  const { colors } = useTheme();
  return <View style={{ borderTopWidth: 2, borderTopColor: colors.text }}>{children}</View>;
}

export function Resource<T>({
  state,
  retry,
  children,
}: {
  state: LoadState<T>;
  retry: () => void;
  children: (data: T) => ReactNode;
}) {
  const { colors } = useTheme();
  if (state.status === 'loading')
    return <ActivityIndicator accessibilityLabel="Loading" color={colors.text} />;
  if (state.status === 'error')
    return (
      <Card>
        <Copy>{state.message}</Copy>
        <Button label="Try again" onPress={retry} />
      </Card>
    );
  return <>{children(state.data)}</>;
}

const styles = StyleSheet.create({
  screen: { paddingHorizontal: screenGutter, paddingTop: 24, gap: 16, paddingBottom: 32, maxWidth: 700, width: '100%', alignSelf: 'center' },
  title: { fontSize: 34, fontWeight: '800', letterSpacing: -0.4, textTransform: 'uppercase' },
  heading: { fontSize: 17, fontWeight: '600' },
  body: { fontSize: 16, lineHeight: 24 },
  muted: { fontSize: 14, lineHeight: 20 },
  label: { fontSize: 14, fontWeight: '600' },
  value: { fontSize: 16, fontVariant: ['tabular-nums'] },
  card: { padding: 16, gap: 12, borderTopWidth: 2 },
  link: {
    padding: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    minHeight: 60,
  },
  linkText: { flex: 1, gap: 3 },
  button: {
    paddingHorizontal: 12, paddingVertical: 8, borderRadius: controlRadius, borderWidth: 1,
    minHeight: 44, flexDirection: 'row', gap: 8, alignItems: 'center', justifyContent: 'center',
  },
  buttonText: { fontSize: 14, fontWeight: '600', flexShrink: 1 },
});
