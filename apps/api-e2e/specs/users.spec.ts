import { db } from "@trainix-pkgs/database";
import { request } from "../helpers/request";

const PATH = "/users";

const CREATE_USER_DTO = {
  id: "ba768462-8fad-4c5d-9a8a-2d2a0133f996",
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
    it("should return 201 CREATED", async () => {
      const { status } = await request.put(PATH).send(CREATE_USER_DTO);

      expect(status).toBe(201);
    });
  });
});
