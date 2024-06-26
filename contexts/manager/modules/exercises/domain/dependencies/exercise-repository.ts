import { Repository } from "../../../shared/domain/repository";
import { Exercise } from "../exercise";

export interface ExerciseRepository extends Repository<Exercise> {
  save(exercise: Exercise): Promise<void>;
}
