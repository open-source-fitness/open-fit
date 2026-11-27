import { Stack, useLocalSearchParams, useRouter } from 'expo-router';
import { StyleSheet, View } from 'react-native';
import { useTemplateExerciseViewModel } from '../viewmodels/workouts';
import { CatalogExerciseImages } from './catalog-exercise-images';
import { ExerciseMuscles, exerciseEquipmentText } from './exercise-summary';
import { PlannedSetRows } from './template-set-rows';
import { Button, Card, Copy, Resource, Screen } from './ui';

export function TemplateExerciseDetailScreen() {
  const { templateId = '', exerciseId = '' } = useLocalSearchParams<{ templateId?: string; exerciseId?: string }>();
  const model = useTemplateExerciseViewModel(templateId, exerciseId);
  const router = useRouter();
  return <Screen>
    <Resource {...model}>{(exercise) => exercise ? <>
      <Stack.Screen options={{ title: exercise.name }} />
      <View style={styles.exerciseHeading}>
        <Copy kind="title">{exercise.name}</Copy>
        <ExerciseMuscles exercise={exercise} />
      </View>
      <CatalogExerciseImages key={exercise.id} images={exercise.images} name={exercise.name} maxImageSize={192} />
      <Copy kind="heading">{exercise.sets.length} {exercise.sets.length === 1 ? 'set' : 'sets'}</Copy>
      <PlannedSetRows sets={exercise.sets} />
      <Copy kind="muted">{exerciseEquipmentText(exercise)}</Copy>
    </> : <Card>
      <Copy>This template exercise couldn’t be found.</Copy>
      <Button label="Open templates" onPress={() => router.replace('/templates')} />
    </Card>}</Resource>
  </Screen>;
}

const styles = StyleSheet.create({
  exerciseHeading: { gap: 4 },
});
