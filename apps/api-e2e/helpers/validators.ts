import { ExerciseDTO } from "@trainix/dto";

export function isExerciseDTO(dto: unknown): dto is ExerciseDTO {
  const exerciseDTO = dto as ExerciseDTO;

  return (
    !!exerciseDTO.name && !!exerciseDTO.userId && !!exerciseDTO.difficultyId
  );
}
