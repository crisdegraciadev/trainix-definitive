import { request } from "../helpers/request";
import { Json } from "../helpers/types";

const PATH = "/difficulties";

describe.skip("/difficulties", () => {
  describe("GET /", () => {
    it("should return 200 OK with an array of difficulties", async () => {
      const { status, body } = await request.get(PATH);

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBeTruthy();

      const difficulties: Json[] = body;

      for (const difficulty of difficulties) {
        expect(Object.keys(difficulty).length).toBe(4);

        expect(difficulty.id).toBeTruthy();
        expect(difficulty.name).toBeTruthy();
        expect(difficulty.value).toBeTruthy();
        expect(difficulty.level).toBeTruthy();
      }
    });
  });
});
