export type ExerciseDTO = {
  name: string;
  description?: string;
  userId: string;
  difficultyId: string;
};

export type CreateExerciseDTO = ExerciseDTO;
