import { request } from "../helpers/request";

const PATH = "/status";

describe("/status", () => {
  describe("GET /", () => {
    it("should return 200 OK", async () => {
      const { statusCode } = await request.get(PATH);
      expect(statusCode).toBe(200);
    });
  });
});
