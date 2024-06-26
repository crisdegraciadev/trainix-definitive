import { db } from "@trainix-pkgs/database";
import { request } from "../helpers/request";
import { isUserDTO } from "../helpers/validators";
import { Uuid } from "../../../contexts/manager/modules/shared/domain/value-objects/uuid";

const PATH = "/users";

const CREATE_USER_DTO = {
  id: Uuid.random().value,
  name: "Jhon",
  surname: "Doe",
  email: "jhon.doe@gmail.com",
  password: "abcd1234X",
  confirmPassword: "abcd1234X",
};

describe("/users", () => {
  beforeEach(async () => {
    await db.user.deleteMany({});
  });

  describe("PUT /:id", () => {
    it("should return 201 CREATED and the created user", async () => {
      const { status, body } = await request.put(PATH).send(CREATE_USER_DTO);

      expect(status).toBe(201);
      expect(isUserDTO(body.user)).toBeTruthy();
    });

    it("should return 422 UNPROCESSABLE CONTENT if the dto is invalid", async () => {
      const { status } = await request.put(PATH).send({});
      expect(status).toBe(422);
    });

    it("should return 409 CONFLICT", async () => {
      await request.put(PATH).send(CREATE_USER_DTO);
      const { status, body } = await request.put(PATH).send(CREATE_USER_DTO);

      expect(status).toBe(409);
      expect(body.message).toMatch("email already in use");
    });
  });
});
