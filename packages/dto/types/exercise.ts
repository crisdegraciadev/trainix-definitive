export type ExerciseDTO = {
  id: string;
  name: string;
  description?: string;
  userId: string;
  difficultyId: string;
  muscleIds: string[];
};

export type CreateExerciseDTO = ExerciseDTO;

export type UpdateExerciseDTO = Partial<ExerciseDTO>;
