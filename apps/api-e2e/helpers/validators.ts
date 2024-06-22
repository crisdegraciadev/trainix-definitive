import { ExerciseDTO, UserDTO } from "@trainix-pkgs/dto";
import { z } from "zod";
import { Json } from "./types";

export function isExerciseDTO(dto: Json): dto is ExerciseDTO {
  const exerciseSchema = z.object({
    name: z.string().min(1),
    userId: z.string().uuid(),
    difficultyId: z.string().uuid(),
  });

  try {
    exerciseSchema.parse(dto);
  } catch (_) {
    return false;
  }

  return true;
}

export function isUserDTO(dto: Json): dto is UserDTO {
  if (dto.password || dto.confirmPassword) {
    return false;
  }

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
