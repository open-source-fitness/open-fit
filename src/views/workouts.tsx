import { useLocalSearchParams, useRouter } from 'expo-router';
import { useState } from 'react';
import { Pressable, View } from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import type { SessionExercise } from '../models/workout';
import { useTheme } from '../viewmodels/theme';
import { sessionSummary, useSessionsViewModel, useSessionViewModel } from '../viewmodels/workouts';
import { ExerciseSummary, exerciseSummaryText } from './exercise-summary';
import { SetSheet, SetSheetRow } from './set-sheet';
import { Card, Copy, LinkCard, Resource, RuledList, Screen } from './ui';

export function WorkoutsScreen() {
  const router = useRouter();
  const model = useSessionsViewModel();
  return (
    <Screen>
      <Copy kind="title">Workout history</Copy>
      <Copy kind="muted">Sample workouts</Copy>
      <Resource {...model}>
        {(sessions) =>
          sessions.length ? (
            <RuledList>{sessions.map((session) => (
              <LinkCard
                key={session.id}
                title={session.title}
                subtitle={sessionSummary(session.startedAt, session.endedAt)}
                onPress={() => router.push({ pathname: '/workouts/[id]', params: { id: session.id } })}
              />
            ))}</RuledList>
          ) : (
            <Card>
              <Copy>No workouts yet.</Copy>
            </Card>
          )
        }
      </Resource>
    </Screen>
  );
}

export function WorkoutDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const model = useSessionViewModel(id);
  return (
    <Screen>
      <Resource {...model}>
        {(session) =>
          session ? (
            <>
              <Copy kind="title">{session.title}</Copy>
              <Copy kind="muted">{sessionSummary(session.startedAt, session.endedAt)}</Copy>
              <Copy kind="muted">Sample workout. Sets show reps × weight in pounds.</Copy>
              {session.exercises.map((exercise) => (
                <SessionExerciseCard key={exercise.id} exercise={exercise} />
              ))}
            </>
          ) : (
            <Card>
              <Copy>This workout couldn’t be found.</Copy>
            </Card>
          )
        }
      </Resource>
    </Screen>
  );
}

function SessionExerciseCard({ exercise }: { exercise: SessionExercise }) {
  const [expanded, setExpanded] = useState(false);
  const { colors } = useTheme();
  const count = `${exercise.sets.length} ${exercise.sets.length === 1 ? 'set' : 'sets'}`;
  return (
    <Card>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`${exercise.name}, ${count}, ${exerciseSummaryText(exercise)}`}
        accessibilityState={{ expanded }}
        onPress={() => setExpanded((value) => !value)}
        style={{ flexDirection: 'row', alignItems: 'center', gap: 12, minHeight: 48 }}
      >
        <View style={{ flex: 1, gap: 6 }}>
          <Copy kind="heading">{exercise.name}</Copy>
          <Copy kind="muted">{count}</Copy>
          <ExerciseSummary exercise={exercise} />
        </View>
        <Ionicons
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={22}
          color={colors.text}
          accessible={false}
        />
      </Pressable>
      {expanded && exercise.sets.length > 0 ? (
        <SetSheet columns={['Target', 'Recorded']}>
          {exercise.sets.map((set) => <SetSheetRow key={set.setNumber} number={set.setNumber}
            accessibilityLabel={`Set ${set.setNumber}. Target: ${set.targetReps} reps × ${set.targetWeight} lb. Recorded: ${set.actualReps} reps × ${set.actualWeight} lb.`}
            values={[
              <Copy kind="value">{set.targetReps} × {set.targetWeight}</Copy>,
              <Copy kind="value">{set.actualReps} × {set.actualWeight}</Copy>,
            ]}
          />)}
        </SetSheet>
      ) : null}
    </Card>
  );
}
