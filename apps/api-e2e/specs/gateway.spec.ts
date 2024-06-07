import { request } from "../helpers/request";

describe("/", () => {
  describe("GET /", () => {
    it("should create the server", async () => {
      const { statusCode } = await request.get("");
      expect(statusCode).toBe(200);
    });
  });
});
