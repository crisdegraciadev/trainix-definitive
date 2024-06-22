import { db } from "@trainix-pkgs/database";
import { request } from "../helpers/request";
import { isExerciseDTO } from "../helpers/validators";
import { Json } from "../helpers/types";

const PATH = "/exercises";

const USER_DTO = {
  name: "test",
  surname: "test",
  email: "test@test.com",
  passwordHash: "123456789",
};

describe.skip("/exercises", () => {
  beforeEach(async () => {
    await db.exercise.deleteMany({});
    await db.user.deleteMany({});
  });

  describe("POST /", () => {
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

      const { status: status1 } = await request.post(PATH).send({
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
    });
  });

  describe("PUT /:id", () => {
    it("should return 200 OK with the updated exercise", async () => {
      const difficulty = await db.difficulty.findUniqueOrThrow({
        where: { value: "easy" },
      });

      const user = await db.user.create({
        data: USER_DTO,
      });

      const exercise = await db.exercise.create({
        data: {
          name: "Push Up",
          userId: user.id,
          difficultyId: difficulty.id,
        },
      });

      const { status, body } = await request
        .put(`${PATH}/${exercise.id}`)
        .send({ name: "Pull Up" });

      expect(status).toBe(200);
      expect(isExerciseDTO(body)).toBeTruthy();

      expect(body.name).toBe("Pull Up");
      expect(body.userId).toBe(user.id);
      expect(body.difficultyId).toBe(difficulty.id);
    });

    it("should return 400 BAD REQUEST if no body is provided", async () => {
      const { status, body, text } = await request.put(
        `${PATH}/263609d5-f4a6-4296-aab2-7953128035c5`,
      );

      expect(status).toBe(400);
      expect(text).toBe("body not provided");
      expect(body).toMatchObject({});
    });

    it("should return 400 BAD REQUEST if the body is malformed", async () => {
      const { status, body, text } = await request
        .put(`${PATH}/263609d5-f4a6-4296-aab2-7953128035c5`)
        .send({ userId: 1 });

      expect(status).toBe(400);
      expect(text).toBe("malformed body");
      expect(body).toMatchObject({});
    });

    it("should return 404 NOT FOUND if the exercise to update is not found", async () => {
      const { status, text, body } = await request
        .put(`${PATH}/263609d5-f4a6-4296-aab2-7953128035c8`)
        .send({
          name: "Pull Up",
          userId: "263609d5-f4a6-4296-aab2-7953128035c5",
          difficultyId: "263609d5-f4a6-4296-aab2-7953128035c5",
        });

      expect(status).toBe(404);
      expect(text).toBe("exercise not found");
      expect(body).toMatchObject({});
    });

    it("should return 404 NOT FOUND if related entities are not found", async () => {
      const difficulty = await db.difficulty.findUniqueOrThrow({
        where: { value: "easy" },
      });

      const user = await db.user.create({
        data: USER_DTO,
      });

      const exercise = await db.exercise.create({
        data: {
          name: "Push Up",
          userId: user.id,
          difficultyId: difficulty.id,
        },
      });

      const { status, text, body } = await request
        .put(`${PATH}/${exercise.id}`)
        .send({
          name: "Pull Up",
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

      const exercise = await db.exercise.create({
        data: {
          name: "Push Up",
          userId: user.id,
          difficultyId: difficulty.id,
        },
      });

      const { status, body, text } = await request
        .put(`${PATH}/${exercise.id}`)
        .send({
          name: "Push Up",
          userId: user.id,
          difficultyId: difficulty.id,
        });

      expect(status).toBe(409);
      expect(text).toBe("exercise with that name already exists");
      expect(body).toMatchObject({});
    });
  });

  describe("GET /", () => {
    it("should return 200 OK with an array of exercises", async () => {
      const difficulty = await db.difficulty.findUniqueOrThrow({
        where: { value: "easy" },
      });

      const user = await db.user.create({
        data: USER_DTO,
      });

      const exercise1 = await db.exercise.create({
        data: {
          name: "Push Up",
          userId: user.id,
          difficultyId: difficulty.id,
        },
      });

      const exercise2 = await db.exercise.create({
        data: {
          name: "Pull Up",
          userId: user.id,
          difficultyId: difficulty.id,
        },
      });

      const { status, body } = await request.get(PATH);

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBeTruthy();

      const exercises: Json[] = body;

      expect(exercises.length).toBe(2);

      const exerciseNames = new Set(exercises.map(({ name }) => name));

      expect(exerciseNames.has(exercise1.name)).toBeTruthy();
      expect(exerciseNames.has(exercise2.name)).toBeTruthy();
    });
  });

  describe("GET /:id", () => {
    it("should return 200 OK and the found exercise", async () => {
      const difficulty = await db.difficulty.findUniqueOrThrow({
        where: { value: "easy" },
      });

      const user = await db.user.create({
        data: USER_DTO,
      });

      const exercise = await db.exercise.create({
        data: {
          name: "Push Up",
          userId: user.id,
          difficultyId: difficulty.id,
        },
      });

      const { status, body } = await request.get(`${PATH}/${exercise.id}`);

      expect(status).toBe(200);
      expect(isExerciseDTO(body)).toBeTruthy();

      expect(body.id).toBe(exercise.id);
    });

    it("should return 400 BAD REQUEST if the provided id is not an UUID", async () => {
      const { status, body, text } = await request.get(`${PATH}/${1}`);

      expect(status).toBe(400);
      expect(text).toBe("malformed id");
      expect(body).toMatchObject({});
    });

    it("should return 404 NOT FOUND if the provided id doesn't exist", async () => {
      const { status, body, text } = await request.get(
        `${PATH}/263609d5-f4a6-4296-aab2-7953128035c5`,
      );

      expect(status).toBe(404);
      expect(text).toBe("exercise not found");
      expect(body).toMatchObject({});
    });
  });

  describe("DELETE /:id", () => {
    it("should return 200 OK and return the deleted exercise", async () => {
      const difficulty = await db.difficulty.findUniqueOrThrow({
        where: { value: "easy" },
      });

      const user = await db.user.create({
        data: USER_DTO,
      });

      const exercise = await db.exercise.create({
        data: {
          name: "Push Up",
          userId: user.id,
          difficultyId: difficulty.id,
        },
      });

      const { status, body } = await request.delete(`${PATH}/${exercise.id}`);

      expect(status).toBe(200);
      expect(isExerciseDTO(body)).toBeTruthy();
    });

    it("should return 400 BAD REQUEST if the provided id is not an UUID", async () => {
      const { status, body, text } = await request.delete(`${PATH}/${1}`);

      expect(status).toBe(400);
      expect(text).toBe("malformed id");
      expect(body).toMatchObject({});
    });

    it("should return 404 NOT FOUND if the provided id doesn't exist", async () => {
      const { status, body, text } = await request.delete(
        `${PATH}/263609d5-f4a6-4296-aab2-7953128035c5`,
      );

      expect(status).toBe(404);
      expect(text).toBe("exercise not found");
      expect(body).toMatchObject({});
    });
  });
});
