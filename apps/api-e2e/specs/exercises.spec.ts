import { db } from "@trainix/database";
import { request } from "../helpers/request";
import { isExerciseDTO } from "../helpers/validators";

const PATH = "/exercises";

const USER_DTO = {
  name: "test",
  surname: "test",
  email: "test@test.com",
  passwordHash: "123456789",
};

describe("/exercises", () => {
  describe("POST /", () => {
    it("should find the endpoint", async () => {
      const { status } = await request.post(PATH);
      expect(status).not.toBe(404);
    });

    it("should return 200 OK and return the created exercise", async () => {
      const difficulty = await db.difficulty.findUniqueOrThrow({
        where: { value: "easy" },
      });

      const user = await db.user.create({
        data: USER_DTO,
      });

      const { status, body } = await request.post(PATH).send({
        name: "Push Up",
        userId: user.id,
        difficultyId: difficulty.id,
      });

      expect(status).toBe(200);
      expect(isExerciseDTO(body)).toBeTruthy();

      expect(body.name).toBe("Push Up");
      expect(body.userId).toBe(user.id);
      expect(body.difficultyId).toBe(difficulty.id);

      await db.exercise.delete({
        where: { id: body.id },
      });

      await db.user.delete({
        where: { id: user.id },
      });
    });

    it("should return 400 BAD REQUEST if no body is provided", async () => {
      const { status, body, text } = await request.post(PATH);

      expect(status).toBe(400);
      expect(text).toBe("body not provided");
      expect(body).toMatchObject({});
    });

    it("should return 400 BAD REQUEST if the body is malformed", async () => {
      const { status, body, text } = await request
        .post(PATH)
        .send({ name: "Push Up" });

      expect(status).toBe(400);
      expect(text).toBe("malformed body");
      expect(body).toMatchObject({});
    });

    it("should return 404 NOT FOUND if related entities are not found", async () => {
      const { status, body, text } = await request.post(PATH).send({
        name: "Push Up",
        userId: "263609d5-f4a6-4296-aab2-7953128035c5",
        difficultyId: "263609d5-f4a6-4296-aab2-7953128035c5",
      });

      expect(status).toBe(404);
      expect(text).toBe("entities to relate not found");
      expect(body).toMatchObject({});
    });

    it("should return 409 CONFLICT if the exercise is already created", async () => {
      const difficulty = await db.difficulty.findUniqueOrThrow({
        where: { value: "easy" },
      });

      const user = await db.user.create({
        data: USER_DTO,
      });

      const { status: status1, body: body1 } = await request.post(PATH).send({
        name: "Push Up",
        userId: user.id,
        difficultyId: difficulty.id,
      });

      expect(status1).toBe(200);

      const { status: status2, text: text2 } = await request.post(PATH).send({
        name: "Push Up",
        userId: user.id,
        difficultyId: difficulty.id,
      });

      expect(status2).toBe(409);
      expect(text2).toBe("exercise with that name is already created");

      await db.exercise.delete({
        where: { id: body1.id },
      });

      await db.user.delete({
        where: { id: user.id },
      });
    });
  });
});
