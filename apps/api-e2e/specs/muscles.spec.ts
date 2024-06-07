import { request } from "../helpers/request";
import { Json } from "../helpers/types";

const PATH = "/muscles";

describe("/muscles", () => {
  describe("GET /", () => {
    it("should find the endpoint", async () => {
      const { status } = await request.get(PATH);
      expect(status).not.toBe(404);
    });

    it("should return 200 OK with an array of muscles", async () => {
      const { status, body } = await request.get(PATH);

      expect(status).toBe(200);
      expect(Array.isArray(body)).toBeTruthy();

      const muscles: Json[] = body;

      for (const muscle of muscles) {
        expect(Object.keys(muscle).length).toBe(3);

        expect(muscle.id).toBeTruthy();
        expect(muscle.name).toBeTruthy();
        expect(muscle.value).toBeTruthy();
      }
    });
  });
});
