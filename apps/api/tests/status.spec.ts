import { TrainixApi } from "../src/app";

describe("StatusGetController", () => {
  let application: TrainixApi;

  beforeAll(async () => {
    application = new TrainixApi();
    await application.start();
  });

  it("first test", () => {
    expect(true);
  });

  afterAll(async () => {
    await application.stop();
  });
});
