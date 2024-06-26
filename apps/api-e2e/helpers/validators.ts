import { ExerciseDTO, UserDTO } from "@trainix-pkgs/dto";
import { z } from "zod";

export function isExerciseDTO(dto: unknown): dto is ExerciseDTO {
  const exerciseSchema = z.object({
    id: z.string().uuid(),
    name: z.string(),
    description: z.string().optional(),
    userId: z.string().uuid(),
    difficultyId: z.string().uuid(),
    muscleIds: z.array(z.string().uuid()).min(1),
  });

  try {
    exerciseSchema.parse(dto);
  } catch (_) {
    return false;
  }

  return true;
}

export function isUserDTO(dto: unknown): dto is UserDTO {
  const userSchema = z.object({
    name: z.string().min(1),
    surname: z.string().min(1),
    email: z.string().email(),
  });

  try {
    userSchema.parse(dto);
  } catch (_) {
    return false;
  }

  return true;
}
