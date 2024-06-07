import supertest from "supertest";

const BASE_URL = "http://localhost:3001";
const request = supertest(BASE_URL);

describe("GATEWAY", () => {
  it("GET /", async () => {
    const { statusCode } = await request.get("");
    console.log({ statusCode });
    expect(statusCode).toBe(200);
  });
});
